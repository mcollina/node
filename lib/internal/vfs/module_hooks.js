'use strict';

const {
  ArrayPrototypePush,
  ArrayPrototypeIndexOf,
  ArrayPrototypeSplice,
  StringPrototypeEndsWith,
  StringPrototypeStartsWith,
} = primordials;

const { normalizePath } = require('internal/vfs/router');
const { pathToFileURL, fileURLToPath } = require('internal/url');

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
// ESM hooks instance (for potential cleanup)
let esmHooksInstance = null;

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
        // Only read files, not directories
        const statResult = vfs.internalModuleStat(normalized);
        if (statResult !== 0) {
          // Not a file (1 = dir, -2 = not found)
          // Let the real fs handle it (will throw appropriate error)
          return null;
        }
        try {
          const content = vfs.readFileSync(normalized, options);
          return { vfs, content };
        } catch (e) {
          // If read fails, fall through to default fs
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
 * Determine module format from file extension.
 * @param {string} url The file URL
 * @returns {string} The format ('module', 'commonjs', or 'json')
 */
function getFormatFromExtension(url) {
  if (StringPrototypeEndsWith(url, '.mjs')) {
    return 'module';
  }
  if (StringPrototypeEndsWith(url, '.cjs')) {
    return 'commonjs';
  }
  if (StringPrototypeEndsWith(url, '.json')) {
    return 'json';
  }
  // Default to commonjs for .js files
  // TODO: Check package.json "type" field for proper detection
  return 'commonjs';
}

/**
 * Convert a file path or file URL to a normalized file path.
 * @param {string} urlOrPath URL or path string
 * @returns {string} Normalized file path
 */
function urlToPath(urlOrPath) {
  if (StringPrototypeStartsWith(urlOrPath, 'file://')) {
    return fileURLToPath(urlOrPath);
  }
  return urlOrPath;
}

/**
 * ESM resolve hook for VFS.
 * @param {string} specifier The module specifier
 * @param {object} context The resolve context
 * @param {function} nextResolve The next resolve function in the chain
 * @returns {object} The resolve result
 */
function vfsResolveHook(specifier, context, nextResolve) {
  // Skip node: built-ins
  if (StringPrototypeStartsWith(specifier, 'node:')) {
    return nextResolve(specifier, context);
  }

  // Convert specifier to a path we can check
  let checkPath;
  if (StringPrototypeStartsWith(specifier, 'file://')) {
    checkPath = fileURLToPath(specifier);
  } else if (specifier[0] === '/') {
    // Absolute path
    checkPath = specifier;
  } else if (specifier[0] === '.') {
    // Relative path - need to resolve against parent
    if (context.parentURL) {
      const parentPath = urlToPath(context.parentURL);
      const path = require('path');
      const parentDir = path.dirname(parentPath);
      checkPath = path.resolve(parentDir, specifier);
    } else {
      return nextResolve(specifier, context);
    }
  } else {
    // Bare specifier (like 'lodash') - let default resolver handle it
    return nextResolve(specifier, context);
  }

  // Check if any VFS handles this path
  const normalized = normalizePath(checkPath);
  for (let i = 0; i < activeVFSList.length; i++) {
    const vfs = activeVFSList[i];
    if (vfs.shouldHandle(normalized) && vfs.existsSync(normalized)) {
      // Only resolve files, let directories go through normal resolution
      // (which handles package.json, index.js, etc.)
      const statResult = vfs.internalModuleStat(normalized);
      if (statResult !== 0) {
        // Not a file (1 = dir), let default resolver handle it
        return nextResolve(specifier, context);
      }
      const url = pathToFileURL(normalized).href;
      const format = getFormatFromExtension(normalized);
      return {
        url,
        format,
        shortCircuit: true,
      };
    }
  }

  // Not in VFS, let the default resolver handle it
  return nextResolve(specifier, context);
}

/**
 * ESM load hook for VFS.
 * @param {string} url The module URL
 * @param {object} context The load context
 * @param {function} nextLoad The next load function in the chain
 * @returns {object} The load result
 */
function vfsLoadHook(url, context, nextLoad) {
  // Skip node: built-ins
  if (StringPrototypeStartsWith(url, 'node:')) {
    return nextLoad(url, context);
  }

  // Only handle file:// URLs
  if (!StringPrototypeStartsWith(url, 'file://')) {
    return nextLoad(url, context);
  }

  const filePath = fileURLToPath(url);
  const normalized = normalizePath(filePath);

  // Check if any VFS handles this path
  for (let i = 0; i < activeVFSList.length; i++) {
    const vfs = activeVFSList[i];
    if (vfs.shouldHandle(normalized) && vfs.existsSync(normalized)) {
      // Only load files, not directories
      const statResult = vfs.internalModuleStat(normalized);
      if (statResult !== 0) {
        // Not a file (0 = file, 1 = dir, -2 = not found)
        // Let the default loader handle it
        return nextLoad(url, context);
      }
      try {
        const content = vfs.readFileSync(normalized, 'utf8');
        const format = context.format || getFormatFromExtension(normalized);
        return {
          format,
          source: content,
          shortCircuit: true,
        };
      } catch (e) {
        // If read fails, fall through to default loader
        if (vfs.isMounted) {
          throw e;
        }
      }
    }
  }

  // Not in VFS, let the default loader handle it
  return nextLoad(url, context);
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

  // Register ESM hooks using Module.registerHooks
  esmHooksInstance = Module.registerHooks({
    resolve: vfsResolveHook,
    load: vfsLoadHook,
  });

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
