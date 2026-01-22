'use strict';

// Tests for SEA VFS functions when NOT running as a Single Executable Application.
// For full SEA VFS integration tests, see test/sea/test-single-executable-application-vfs.js

const common = require('../common');
const assert = require('assert');
const fs = require('fs');

// Test that SEA functions are exported from fs module
assert.strictEqual(typeof fs.getSeaVfs, 'function', 'fs.getSeaVfs should be a function');
assert.strictEqual(typeof fs.hasSeaAssets, 'function', 'fs.hasSeaAssets should be a function');

// Test hasSeaAssets() returns false when not running as SEA
{
  const hasAssets = fs.hasSeaAssets();
  assert.strictEqual(hasAssets, false, 'hasSeaAssets() should return false when not in SEA');
}

// Test getSeaVfs() returns null when not running as SEA
{
  const seaVfs = fs.getSeaVfs();
  assert.strictEqual(seaVfs, null, 'getSeaVfs() should return null when not in SEA');
}

// Test getSeaVfs() with options still returns null when not in SEA
{
  const seaVfs = fs.getSeaVfs({ prefix: '/custom-sea' });
  assert.strictEqual(seaVfs, null, 'getSeaVfs() with prefix option should return null when not in SEA');
}

{
  const seaVfs = fs.getSeaVfs({ moduleHooks: false });
  assert.strictEqual(seaVfs, null, 'getSeaVfs() with moduleHooks option should return null when not in SEA');
}

{
  const seaVfs = fs.getSeaVfs({ prefix: '/my-app', moduleHooks: true });
  assert.strictEqual(seaVfs, null, 'getSeaVfs() with multiple options should return null when not in SEA');
}

// Verify that calling getSeaVfs multiple times is safe (caching behavior)
{
  const vfs1 = fs.getSeaVfs();
  const vfs2 = fs.getSeaVfs();
  assert.strictEqual(vfs1, vfs2, 'Multiple calls to getSeaVfs() should return the same value');
  assert.strictEqual(vfs1, null, 'Both should be null when not in SEA');
}
