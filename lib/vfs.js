'use strict';

const { VirtualFileSystem } = require('internal/vfs/virtual_fs');
const {
  VirtualFile,
  VirtualDirectory,
} = require('internal/vfs/entries');

/**
 * Creates a new VirtualFileSystem instance.
 * @param {object} [options] Configuration options
 * @param {boolean} [options.fallthrough=true] Whether to fall through to real fs on miss
 * @returns {VirtualFileSystem}
 */
function create(options) {
  return new VirtualFileSystem(options);
}

module.exports = {
  create,
  VirtualFileSystem,
  VirtualFile,
  VirtualDirectory,
};
