'use strict';

const {
  ArrayPrototypePush,
  ArrayPrototypeIndexOf,
  ArrayPrototypeSplice,
} = primordials;

const { normalizePath } = require('internal/vfs/router');

// Registry of active VFS instances
const activeVFSList = [];

// Original Module._stat function (set once when first VFS activates)
let originalStat = null;
// Original fs.readFileSync function (set once when first VFS activates)
let originalReadFileSync = null;
// Original fs.realpathSync function
let originalRealpathSync = null;
// Original fs.lstatSync function
let originalLstatSync = null;
// Original fs.statSync function
let originalStatSync = null;
// Track if hooks are installed
let hooksInstalled = false;

/**
 * Registers a VFS instance to be checked for CJS module loading.
 * @param {VirtualFileSystem} vfs The VFS instance to register
 */
function registerVFS(vfs) {
  if (ArrayPrototypeIndexOf(activeVFSList, vfs) === -1) {
    ArrayPrototypePush(activeVFSList, vfs);
    if (!hooksInstalled) {
      installHooks();
    }
  }
}

/**
 * Unregisters a VFS instance.
 * @param {VirtualFileSystem} vfs The VFS instance to unregister
 */
function unregisterVFS(vfs) {
  const index = ArrayPrototypeIndexOf(activeVFSList, vfs);
  if (index !== -1) {
    ArrayPrototypeSplice(activeVFSList, index, 1);
  }
  // Note: We don't uninstall hooks even when list is empty,
  // as another VFS might be registered later.
}

/**
 * Checks all active VFS instances for a file/directory.
 * @param {string} filename The absolute path to check
 * @returns {{ vfs: VirtualFileSystem, result: number }|null}
 */
function findVFSForStat(filename) {
  const normalized = normalizePath(filename);
  for (let i = 0; i < activeVFSList.length; i++) {
    const vfs = activeVFSList[i];
    if (vfs.shouldHandle(normalized)) {
      const result = vfs.internalModuleStat(normalized);
      // For mounted VFS, always return result (even -2 for ENOENT within mount)
      // For overlay VFS, only return if found
      if (vfs.isMounted || result >= 0) {
        return { vfs, result };
      }
    }
  }
  return null;
}

/**
 * Checks all active VFS instances for file content.
 * @param {string} filename The absolute path to read
 * @param {string|object} options Read options
 * @returns {{ vfs: VirtualFileSystem, content: Buffer|string }|null}
 */
function findVFSForRead(filename, options) {
  const normalized = normalizePath(filename);
  for (let i = 0; i < activeVFSList.length; i++) {
    const vfs = activeVFSList[i];
    if (vfs.shouldHandle(normalized)) {
      // Check if the file actually exists in VFS
      if (vfs.existsSync(normalized)) {
        try {
          const content = vfs.readFileSync(normalized, options);
          return { vfs, content };
        } catch (e) {
          // If it's a directory or other error, let real fs handle it
          // unless we're in mounted mode (where we should return the error)
          if (vfs.isMounted) {
            throw e;
          }
        }
      } else if (vfs.isMounted) {
        // In mounted mode, if path is under mount point but doesn't exist,
        // don't fall through to real fs - throw ENOENT
        const { createENOENT } = require('internal/vfs/errors');
        throw createENOENT('open', filename);
      }
    }
  }
  return null;
}

/**
 * Checks all active VFS instances for realpath.
 * @param {string} filename The path to resolve
 * @returns {{ vfs: VirtualFileSystem, realpath: string }|null}
 */
function findVFSForRealpath(filename) {
  const normalized = normalizePath(filename);
  for (let i = 0; i < activeVFSList.length; i++) {
    const vfs = activeVFSList[i];
    if (vfs.shouldHandle(normalized)) {
      if (vfs.existsSync(normalized)) {
        try {
          const realpath = vfs.realpathSync(normalized);
          return { vfs, realpath };
        } catch (e) {
          if (vfs.isMounted) {
            throw e;
          }
        }
      } else if (vfs.isMounted) {
        const { createENOENT } = require('internal/vfs/errors');
        throw createENOENT('realpath', filename);
      }
    }
  }
  return null;
}

/**
 * Checks all active VFS instances for stat/lstat.
 * @param {string} filename The path to stat
 * @returns {{ vfs: VirtualFileSystem, stats: Stats }|null}
 */
function findVFSForFsStat(filename) {
  const normalized = normalizePath(filename);
  for (let i = 0; i < activeVFSList.length; i++) {
    const vfs = activeVFSList[i];
    if (vfs.shouldHandle(normalized)) {
      if (vfs.existsSync(normalized)) {
        try {
          const stats = vfs.statSync(normalized);
          return { vfs, stats };
        } catch (e) {
          if (vfs.isMounted) {
            throw e;
          }
        }
      } else if (vfs.isMounted) {
        const { createENOENT } = require('internal/vfs/errors');
        throw createENOENT('stat', filename);
      }
    }
  }
  return null;
}

/**
 * Install hooks into Module._stat and various fs functions.
 */
function installHooks() {
  if (hooksInstalled) {
    return;
  }

  const Module = require('internal/modules/cjs/loader').Module;
  const fs = require('fs');

  // Save originals
  originalStat = Module._stat;
  originalReadFileSync = fs.readFileSync;
  originalRealpathSync = fs.realpathSync;
  originalLstatSync = fs.lstatSync;
  originalStatSync = fs.statSync;

  // Override Module._stat
  // This uses the setter which emits an experimental warning, but that's acceptable
  // for now since VFS integration IS experimental.
  Module._stat = function vfsStat(filename) {
    const vfsResult = findVFSForStat(filename);
    if (vfsResult !== null) {
      return vfsResult.result;
    }
    return originalStat(filename);
  };

  // Override fs.readFileSync
  // We need to be careful to only intercept when VFS should handle the path
  fs.readFileSync = function vfsReadFileSync(path, options) {
    // Only intercept string paths (not file descriptors)
    if (typeof path === 'string' || path instanceof URL) {
      const pathStr = typeof path === 'string' ? path : path.pathname;
      const vfsResult = findVFSForRead(pathStr, options);
      if (vfsResult !== null) {
        return vfsResult.content;
      }
    }
    return originalReadFileSync.call(fs, path, options);
  };

  // Override fs.realpathSync
  fs.realpathSync = function vfsRealpathSync(path, options) {
    if (typeof path === 'string' || path instanceof URL) {
      const pathStr = typeof path === 'string' ? path : path.pathname;
      const vfsResult = findVFSForRealpath(pathStr);
      if (vfsResult !== null) {
        return vfsResult.realpath;
      }
    }
    return originalRealpathSync.call(fs, path, options);
  };
  // Preserve the .native method
  fs.realpathSync.native = originalRealpathSync.native;

  // Override fs.lstatSync
  fs.lstatSync = function vfsLstatSync(path, options) {
    if (typeof path === 'string' || path instanceof URL) {
      const pathStr = typeof path === 'string' ? path : path.pathname;
      const vfsResult = findVFSForFsStat(pathStr);
      if (vfsResult !== null) {
        return vfsResult.stats;
      }
    }
    return originalLstatSync.call(fs, path, options);
  };

  // Override fs.statSync
  fs.statSync = function vfsStatSync(path, options) {
    if (typeof path === 'string' || path instanceof URL) {
      const pathStr = typeof path === 'string' ? path : path.pathname;
      const vfsResult = findVFSForFsStat(pathStr);
      if (vfsResult !== null) {
        return vfsResult.stats;
      }
    }
    return originalStatSync.call(fs, path, options);
  };

  hooksInstalled = true;
}

/**
 * Get the count of active VFS instances.
 * @returns {number}
 */
function getActiveVFSCount() {
  return activeVFSList.length;
}

/**
 * Check if hooks are installed.
 * @returns {boolean}
 */
function areHooksInstalled() {
  return hooksInstalled;
}

module.exports = {
  registerVFS,
  unregisterVFS,
  findVFSForStat,
  findVFSForRead,
  getActiveVFSCount,
  areHooksInstalled,
};
