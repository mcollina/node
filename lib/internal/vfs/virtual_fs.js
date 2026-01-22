'use strict';

const {
  ArrayPrototypePush,
  FunctionPrototypeBind,
  ObjectFreeze,
  PromiseResolve,
  SafeMap,
  Symbol,
} = primordials;

const { Buffer } = require('buffer');
const {
  VirtualFile,
  VirtualDirectory,
} = require('internal/vfs/entries');
const {
  normalizePath,
  splitPath,
  getParentPath,
  getBaseName,
  isUnderMountPoint,
  getRelativePath,
} = require('internal/vfs/router');
const {
  createENOENT,
  createENOTDIR,
  createEISDIR,
} = require('internal/vfs/errors');
const { Dirent } = require('internal/fs/utils');
const {
  registerVFS,
  unregisterVFS,
} = require('internal/vfs/module_hooks');
const {
  fs: {
    UV_DIRENT_FILE,
    UV_DIRENT_DIR,
  },
} = internalBinding('constants');

// Private symbols
const kRoot = Symbol('kRoot');
const kMountPoint = Symbol('kMountPoint');
const kMounted = Symbol('kMounted');
const kOverlay = Symbol('kOverlay');
const kFallthrough = Symbol('kFallthrough');
const kPromises = Symbol('kPromises');

/**
 * Virtual File System implementation.
 * Provides an in-memory file system that can be mounted at a path or used as an overlay.
 */
class VirtualFileSystem {
  /**
   * @param {object} [options] Configuration options
   * @param {boolean} [options.fallthrough=true] Whether to fall through to real fs on miss
   */
  constructor(options = {}) {
    this[kRoot] = new VirtualDirectory('/');
    this[kMountPoint] = null;
    this[kMounted] = false;
    this[kOverlay] = false;
    this[kFallthrough] = options.fallthrough !== false;
    this[kPromises] = null; // Lazy-initialized
  }

  /**
   * Gets the mount point path, or null if not mounted.
   * @returns {string|null}
   */
  get mountPoint() {
    return this[kMountPoint];
  }

  /**
   * Returns true if VFS is mounted.
   * @returns {boolean}
   */
  get isMounted() {
    return this[kMounted];
  }

  /**
   * Returns true if VFS is in overlay mode.
   * @returns {boolean}
   */
  get isOverlay() {
    return this[kOverlay];
  }

  /**
   * Returns true if VFS falls through to real fs on miss.
   * @returns {boolean}
   */
  get fallthrough() {
    return this[kFallthrough];
  }

  // ==================== Entry Management ====================

  /**
   * Adds a file to the VFS.
   * @param {string} filePath The absolute path for the file
   * @param {Buffer|string|function} content The file content or content provider
   * @param {object} [options] Optional configuration
   */
  addFile(filePath, content, options) {
    const normalized = normalizePath(filePath);
    const segments = splitPath(normalized);

    if (segments.length === 0) {
      throw new Error('Cannot add file at root path');
    }

    // Ensure parent directories exist
    let current = this[kRoot];
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      let entry = current.getEntry(segment);
      if (!entry) {
        // Auto-create parent directory
        const dirPath = '/' + segments.slice(0, i + 1).join('/');
        entry = new VirtualDirectory(dirPath);
        current.addEntry(segment, entry);
      } else if (!entry.isDirectory()) {
        throw new Error(`Cannot create file: ${segments.slice(0, i + 1).join('/')} is not a directory`);
      }
      current = entry;
    }

    // Add the file
    const fileName = segments[segments.length - 1];
    const file = new VirtualFile(normalized, content, options);
    current.addEntry(fileName, file);
  }

  /**
   * Adds a directory to the VFS.
   * @param {string} dirPath The absolute path for the directory
   * @param {function} [populate] Optional callback to populate directory contents
   * @param {object} [options] Optional configuration
   */
  addDirectory(dirPath, populate, options) {
    const normalized = normalizePath(dirPath);
    const segments = splitPath(normalized);

    // Handle root directory
    if (segments.length === 0) {
      if (typeof populate === 'function') {
        // Replace root with dynamic directory
        this[kRoot] = new VirtualDirectory('/', populate, options);
      }
      return;
    }

    // Ensure parent directories exist
    let current = this[kRoot];
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      let entry = current.getEntry(segment);
      if (!entry) {
        // Auto-create parent directory
        const parentPath = '/' + segments.slice(0, i + 1).join('/');
        entry = new VirtualDirectory(parentPath);
        current.addEntry(segment, entry);
      } else if (!entry.isDirectory()) {
        throw new Error(`Cannot create directory: ${segments.slice(0, i + 1).join('/')} is not a directory`);
      }
      current = entry;
    }

    // Add the directory
    const dirName = segments[segments.length - 1];
    const dir = new VirtualDirectory(normalized, populate, options);
    current.addEntry(dirName, dir);
  }

  /**
   * Removes an entry from the VFS.
   * @param {string} entryPath The absolute path to remove
   * @returns {boolean} True if the entry was removed
   */
  remove(entryPath) {
    const normalized = normalizePath(entryPath);
    const parentPath = getParentPath(normalized);

    if (parentPath === null) {
      // Cannot remove root
      return false;
    }

    const parent = this._resolveEntry(parentPath);
    if (!parent || !parent.isDirectory()) {
      return false;
    }

    const name = getBaseName(normalized);
    return parent.removeEntry(name);
  }

  /**
   * Checks if a path exists in the VFS.
   * @param {string} entryPath The absolute path to check
   * @returns {boolean}
   */
  has(entryPath) {
    const normalized = normalizePath(entryPath);
    return this._resolveEntry(normalized) !== null;
  }

  // ==================== Mount/Overlay ====================

  /**
   * Mounts the VFS at a specific path prefix.
   * @param {string} prefix The mount point path
   */
  mount(prefix) {
    if (this[kMounted] || this[kOverlay]) {
      throw new Error('VFS is already mounted or in overlay mode');
    }
    this[kMountPoint] = normalizePath(prefix);
    this[kMounted] = true;
    registerVFS(this);
  }

  /**
   * Enables overlay mode (intercepts all matching paths).
   */
  overlay() {
    if (this[kMounted] || this[kOverlay]) {
      throw new Error('VFS is already mounted or in overlay mode');
    }
    this[kOverlay] = true;
    registerVFS(this);
  }

  /**
   * Unmounts the VFS.
   */
  unmount() {
    unregisterVFS(this);
    this[kMountPoint] = null;
    this[kMounted] = false;
    this[kOverlay] = false;
  }

  // ==================== Path Resolution ====================

  /**
   * Resolves a path to its VFS entry, if it exists.
   * @param {string} inputPath The path to resolve
   * @returns {VirtualEntry|null}
   * @private
   */
  _resolveEntry(inputPath) {
    const normalized = normalizePath(inputPath);

    // Determine the path within VFS
    let vfsPath;
    if (this[kMounted] && this[kMountPoint]) {
      if (!isUnderMountPoint(normalized, this[kMountPoint])) {
        return null;
      }
      vfsPath = getRelativePath(normalized, this[kMountPoint]);
    } else {
      vfsPath = normalized;
    }

    // Handle root
    if (vfsPath === '/') {
      return this[kRoot];
    }

    // Walk the path
    const segments = splitPath(vfsPath);
    let current = this[kRoot];

    for (const segment of segments) {
      if (!current.isDirectory()) {
        return null;
      }
      const entry = current.getEntry(segment);
      if (!entry) {
        return null;
      }
      current = entry;
    }

    return current;
  }

  /**
   * Checks if a path should be handled by this VFS.
   * @param {string} inputPath The path to check
   * @returns {boolean}
   */
  shouldHandle(inputPath) {
    if (!this[kMounted] && !this[kOverlay]) {
      return false;
    }

    const normalized = normalizePath(inputPath);

    if (this[kOverlay]) {
      // In overlay mode, check if the path exists in VFS
      return this._resolveEntry(normalized) !== null;
    }

    if (this[kMounted] && this[kMountPoint]) {
      // In mount mode, check if path is under mount point
      return isUnderMountPoint(normalized, this[kMountPoint]);
    }

    return false;
  }

  // ==================== FS Operations (Sync) ====================

  /**
   * Checks if a path exists synchronously.
   * @param {string} filePath The path to check
   * @returns {boolean}
   */
  existsSync(filePath) {
    return this._resolveEntry(filePath) !== null;
  }

  /**
   * Gets stats for a path synchronously.
   * @param {string} filePath The path to stat
   * @returns {Stats}
   * @throws {Error} If path does not exist
   */
  statSync(filePath) {
    const entry = this._resolveEntry(filePath);
    if (!entry) {
      throw createENOENT('stat', filePath);
    }
    return entry.getStats();
  }

  /**
   * Gets stats for a path synchronously (same as statSync for VFS, no symlinks).
   * @param {string} filePath The path to stat
   * @returns {Stats}
   * @throws {Error} If path does not exist
   */
  lstatSync(filePath) {
    return this.statSync(filePath);
  }

  /**
   * Reads a file synchronously.
   * @param {string} filePath The path to read
   * @param {object|string} [options] Options or encoding
   * @returns {Buffer|string}
   * @throws {Error} If path does not exist or is a directory
   */
  readFileSync(filePath, options) {
    const entry = this._resolveEntry(filePath);
    if (!entry) {
      throw createENOENT('open', filePath);
    }
    if (entry.isDirectory()) {
      throw createEISDIR('read', filePath);
    }

    const content = entry.getContentSync();

    // Handle encoding
    if (options) {
      const encoding = typeof options === 'string' ? options : options.encoding;
      if (encoding) {
        return content.toString(encoding);
      }
    }

    return content;
  }

  /**
   * Reads directory contents synchronously.
   * @param {string} dirPath The directory path
   * @param {object} [options] Options
   * @param {boolean} [options.withFileTypes] Return Dirent objects
   * @returns {string[]|Dirent[]}
   * @throws {Error} If path does not exist or is not a directory
   */
  readdirSync(dirPath, options) {
    const entry = this._resolveEntry(dirPath);
    if (!entry) {
      throw createENOENT('scandir', dirPath);
    }
    if (!entry.isDirectory()) {
      throw createENOTDIR('scandir', dirPath);
    }

    const names = entry.getEntryNames();

    if (options?.withFileTypes) {
      const dirents = [];
      for (const name of names) {
        const childEntry = entry.getEntry(name);
        const type = childEntry.isDirectory() ? UV_DIRENT_DIR : UV_DIRENT_FILE;
        ArrayPrototypePush(dirents, new Dirent(name, type, dirPath));
      }
      return dirents;
    }

    return names;
  }

  /**
   * Gets the real path (for VFS, just normalizes the path).
   * @param {string} filePath The path
   * @returns {string}
   * @throws {Error} If path does not exist
   */
  realpathSync(filePath) {
    const normalized = normalizePath(filePath);
    const entry = this._resolveEntry(normalized);
    if (!entry) {
      throw createENOENT('realpath', filePath);
    }
    return normalized;
  }

  /**
   * Returns the stat result code for module resolution.
   * Used by Module._stat override.
   * @param {string} filePath The path to check
   * @returns {number} 0 for file, 1 for directory, -2 for not found
   */
  internalModuleStat(filePath) {
    const entry = this._resolveEntry(filePath);
    if (!entry) {
      return -2; // ENOENT
    }
    if (entry.isDirectory()) {
      return 1;
    }
    return 0;
  }

  // ==================== FS Operations (Async with Callbacks) ====================

  /**
   * Reads a file asynchronously.
   * @param {string} filePath The path to read
   * @param {object|string|function} [options] Options, encoding, or callback
   * @param {function} [callback] Callback (err, data)
   */
  readFile(filePath, options, callback) {
    // Handle optional options argument
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }

    const entry = this._resolveEntry(filePath);
    if (!entry) {
      process.nextTick(callback, createENOENT('open', filePath));
      return;
    }
    if (entry.isDirectory()) {
      process.nextTick(callback, createEISDIR('read', filePath));
      return;
    }

    // Use async getContent for dynamic content support
    entry.getContent().then((content) => {
      // Handle encoding
      if (options) {
        const encoding = typeof options === 'string' ? options : options.encoding;
        if (encoding) {
          callback(null, content.toString(encoding));
          return;
        }
      }
      callback(null, content);
    }).catch((err) => {
      callback(err);
    });
  }

  /**
   * Gets stats for a path asynchronously.
   * @param {string} filePath The path to stat
   * @param {object|function} [options] Options or callback
   * @param {function} [callback] Callback (err, stats)
   */
  stat(filePath, options, callback) {
    // Handle optional options argument
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }

    const entry = this._resolveEntry(filePath);
    if (!entry) {
      process.nextTick(callback, createENOENT('stat', filePath));
      return;
    }
    process.nextTick(callback, null, entry.getStats());
  }

  /**
   * Gets stats for a path asynchronously (same as stat for VFS, no symlinks).
   * @param {string} filePath The path to stat
   * @param {object|function} [options] Options or callback
   * @param {function} [callback] Callback (err, stats)
   */
  lstat(filePath, options, callback) {
    this.stat(filePath, options, callback);
  }

  /**
   * Reads directory contents asynchronously.
   * @param {string} dirPath The directory path
   * @param {object|function} [options] Options or callback
   * @param {function} [callback] Callback (err, entries)
   */
  readdir(dirPath, options, callback) {
    // Handle optional options argument
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }

    const entry = this._resolveEntry(dirPath);
    if (!entry) {
      process.nextTick(callback, createENOENT('scandir', dirPath));
      return;
    }
    if (!entry.isDirectory()) {
      process.nextTick(callback, createENOTDIR('scandir', dirPath));
      return;
    }

    const names = entry.getEntryNames();

    if (options?.withFileTypes) {
      const dirents = [];
      for (const name of names) {
        const childEntry = entry.getEntry(name);
        const type = childEntry.isDirectory() ? UV_DIRENT_DIR : UV_DIRENT_FILE;
        ArrayPrototypePush(dirents, new Dirent(name, type, dirPath));
      }
      process.nextTick(callback, null, dirents);
      return;
    }

    process.nextTick(callback, null, names);
  }

  /**
   * Gets the real path asynchronously.
   * @param {string} filePath The path
   * @param {object|function} [options] Options or callback
   * @param {function} [callback] Callback (err, resolvedPath)
   */
  realpath(filePath, options, callback) {
    // Handle optional options argument
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }

    const normalized = normalizePath(filePath);
    const entry = this._resolveEntry(normalized);
    if (!entry) {
      process.nextTick(callback, createENOENT('realpath', filePath));
      return;
    }
    process.nextTick(callback, null, normalized);
  }

  /**
   * Checks file accessibility asynchronously.
   * @param {string} filePath The path to check
   * @param {number|function} [mode] Access mode or callback
   * @param {function} [callback] Callback (err)
   */
  access(filePath, mode, callback) {
    // Handle optional mode argument
    if (typeof mode === 'function') {
      callback = mode;
      mode = undefined;
    }

    const entry = this._resolveEntry(filePath);
    if (!entry) {
      process.nextTick(callback, createENOENT('access', filePath));
      return;
    }
    // VFS files are always readable (no permission checks for now)
    process.nextTick(callback, null);
  }

  // ==================== Promise API ====================

  /**
   * Gets the promises API for this VFS instance.
   * @returns {object} Promise-based fs methods
   */
  get promises() {
    if (this[kPromises] === null) {
      this[kPromises] = createPromisesAPI(this);
    }
    return this[kPromises];
  }
}

/**
 * Creates the promises API object for a VFS instance.
 * @param {VirtualFileSystem} vfs The VFS instance
 * @returns {object} Promise-based fs methods
 */
function createPromisesAPI(vfs) {
  return ObjectFreeze({
    /**
     * Reads a file asynchronously.
     * @param {string} filePath The path to read
     * @param {object|string} [options] Options or encoding
     * @returns {Promise<Buffer|string>}
     */
    async readFile(filePath, options) {
      const entry = vfs._resolveEntry(filePath);
      if (!entry) {
        throw createENOENT('open', filePath);
      }
      if (entry.isDirectory()) {
        throw createEISDIR('read', filePath);
      }

      const content = await entry.getContent();

      // Handle encoding
      if (options) {
        const encoding = typeof options === 'string' ? options : options.encoding;
        if (encoding) {
          return content.toString(encoding);
        }
      }

      return content;
    },

    /**
     * Gets stats for a path asynchronously.
     * @param {string} filePath The path to stat
     * @param {object} [options] Options
     * @returns {Promise<Stats>}
     */
    async stat(filePath, options) {
      const entry = vfs._resolveEntry(filePath);
      if (!entry) {
        throw createENOENT('stat', filePath);
      }
      return entry.getStats();
    },

    /**
     * Gets stats for a path asynchronously (same as stat for VFS).
     * @param {string} filePath The path to stat
     * @param {object} [options] Options
     * @returns {Promise<Stats>}
     */
    async lstat(filePath, options) {
      return this.stat(filePath, options);
    },

    /**
     * Reads directory contents asynchronously.
     * @param {string} dirPath The directory path
     * @param {object} [options] Options
     * @returns {Promise<string[]|Dirent[]>}
     */
    async readdir(dirPath, options) {
      const entry = vfs._resolveEntry(dirPath);
      if (!entry) {
        throw createENOENT('scandir', dirPath);
      }
      if (!entry.isDirectory()) {
        throw createENOTDIR('scandir', dirPath);
      }

      const names = entry.getEntryNames();

      if (options?.withFileTypes) {
        const dirents = [];
        for (const name of names) {
          const childEntry = entry.getEntry(name);
          const type = childEntry.isDirectory() ? UV_DIRENT_DIR : UV_DIRENT_FILE;
          ArrayPrototypePush(dirents, new Dirent(name, type, dirPath));
        }
        return dirents;
      }

      return names;
    },

    /**
     * Gets the real path asynchronously.
     * @param {string} filePath The path
     * @param {object} [options] Options
     * @returns {Promise<string>}
     */
    async realpath(filePath, options) {
      const normalized = normalizePath(filePath);
      const entry = vfs._resolveEntry(normalized);
      if (!entry) {
        throw createENOENT('realpath', filePath);
      }
      return normalized;
    },

    /**
     * Checks file accessibility asynchronously.
     * @param {string} filePath The path to check
     * @param {number} [mode] Access mode
     * @returns {Promise<void>}
     */
    async access(filePath, mode) {
      const entry = vfs._resolveEntry(filePath);
      if (!entry) {
        throw createENOENT('access', filePath);
      }
      // VFS files are always readable (no permission checks for now)
    },
  });
}

module.exports = {
  VirtualFileSystem,
};
