'use strict';

const common = require('../common');
const assert = require('assert');
const fs = require('fs');

// Test that SEA functions exist
assert.strictEqual(typeof fs.getSeaVfs, 'function');
assert.strictEqual(typeof fs.hasSeaAssets, 'function');

// Test that SEA functions return appropriate values when not in SEA
{
  // hasSeaAssets should return false when not running as SEA
  const hasAssets = fs.hasSeaAssets();
  assert.strictEqual(hasAssets, false);

  // getSeaVfs should return null when not running as SEA
  const seaVfs = fs.getSeaVfs();
  assert.strictEqual(seaVfs, null);
}

// Test with custom options (should still return null when not in SEA)
{
  const seaVfs = fs.getSeaVfs({ prefix: '/custom-sea', moduleHooks: false });
  assert.strictEqual(seaVfs, null);
}
