'use strict';

const {
  StringPrototypeStartsWith,
} = primordials;

const { isSea, getAsset, getAssetKeys } = require('sea');

// Lazy-loaded VFS
let cachedSeaVfs = null;

/**
 * Creates a VirtualFileSystem populated with SEA assets.
 * Assets are mounted at the specified prefix (default: '/sea').
 * @param {object} [options] Configuration options
 * @param {string} [options.prefix='/sea'] Mount point prefix for SEA assets
 * @param {boolean} [options.moduleHooks=true] Whether to enable require/import hooks
 * @returns {VirtualFileSystem|null} The VFS instance, or null if not running as SEA
 */
function createSeaVfs(options = {}) {
  if (!isSea()) {
    return null;
  }

  const { VirtualFileSystem } = require('internal/vfs/virtual_fs');
  const prefix = options.prefix ?? '/sea';
  const moduleHooks = options.moduleHooks !== false;

  const vfs = new VirtualFileSystem({ moduleHooks });

  // Get all asset keys and populate VFS
  const keys = getAssetKeys();
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // Get asset content as ArrayBuffer and convert to Buffer
    const content = getAsset(key);
    const buffer = Buffer.from(content);

    // Determine the path - if key starts with /, use as-is, otherwise prepend /
    const path = StringPrototypeStartsWith(key, '/') ? key : `/${key}`;
    vfs.addFile(path, buffer);
  }

  // Mount at the specified prefix
  vfs.mount(prefix);

  return vfs;
}

/**
 * Gets or creates the default SEA VFS instance.
 * This is a singleton that is lazily created on first access.
 * @param {object} [options] Configuration options (only used on first call)
 * @returns {VirtualFileSystem|null} The VFS instance, or null if not running as SEA
 */
function getSeaVfs(options) {
  if (cachedSeaVfs === null) {
    cachedSeaVfs = createSeaVfs(options);
  }
  return cachedSeaVfs;
}

/**
 * Checks if SEA VFS is available (i.e., running as SEA with assets).
 * @returns {boolean}
 */
function hasSeaAssets() {
  if (!isSea()) {
    return false;
  }
  const keys = getAssetKeys();
  return keys.length > 0;
}

module.exports = {
  createSeaVfs,
  getSeaVfs,
  hasSeaAssets,
};
