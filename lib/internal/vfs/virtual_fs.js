'use strict';

const {
  ArrayPrototypePush,
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
  }

  /**
   * Enables overlay mode (intercepts all matching paths).
   */
  overlay() {
    if (this[kMounted] || this[kOverlay]) {
      throw new Error('VFS is already mounted or in overlay mode');
    }
    this[kOverlay] = true;
  }

  /**
   * Unmounts the VFS.
   */
  unmount() {
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
}

module.exports = {
  VirtualFileSystem,
};
