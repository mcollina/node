'use strict';

// Tests for SEA VFS functions when NOT running as a Single Executable Application.
// For full SEA VFS integration tests, see test/sea/test-single-executable-application-vfs.js

require('../common');
const assert = require('assert');
const fs = require('fs');

// Test that SEA functions are exported from fs module
assert.strictEqual(typeof fs.getSeaVfs, 'function');
assert.strictEqual(typeof fs.hasSeaAssets, 'function');

// Test hasSeaAssets() returns false when not running as SEA
{
  const hasAssets = fs.hasSeaAssets();
  assert.strictEqual(hasAssets, false);
}

// Test getSeaVfs() returns null when not running as SEA
{
  const seaVfs = fs.getSeaVfs();
  assert.strictEqual(seaVfs, null);
}

// Test getSeaVfs() with options still returns null when not in SEA
{
  const seaVfs = fs.getSeaVfs({ prefix: '/custom-sea' });
  assert.strictEqual(seaVfs, null);
}

{
  const seaVfs = fs.getSeaVfs({ moduleHooks: false });
  assert.strictEqual(seaVfs, null);
}

{
  const seaVfs = fs.getSeaVfs({ prefix: '/my-app', moduleHooks: true });
  assert.strictEqual(seaVfs, null);
}

// Verify that calling getSeaVfs multiple times is safe (caching behavior)
{
  const vfs1 = fs.getSeaVfs();
  const vfs2 = fs.getSeaVfs();
  assert.strictEqual(vfs1, vfs2);
  assert.strictEqual(vfs1, null);
}
