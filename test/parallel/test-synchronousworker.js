// Flags: --experimental-synchronousworker
'use strict';

const common = require('../common');
const { once } = require('node:events');

const {
  strictEqual,
  throws,
} = require('node:assert');

const {
  SynchronousWorker,
} = require('node:worker_threads');
const assert = require('node:assert');

function deferred() {
  let res;
  const promise = new Promise((resolve) => res = resolve);
  return { res, promise };
}

// Properly handles timers that are about to expire when FreeEnvironment() is called on
// a shared event loop
(async function() {
  const w = new SynchronousWorker();

  setImmediate(() => {
    setTimeout(() => {}, 20);
    const now = Date.now();
    while (Date.now() - now < 30);
  });
  await w.stop();
})().then(common.mustCall());

(async function() {
  const w = new SynchronousWorker();

  setImmediate(() => {
    setImmediate(() => {
      setImmediate(() => {});
    });
  });
  await w.stop();
})().then(common.mustCall());

(async function() {
  const w = new SynchronousWorker();

  setImmediate(() => {
    setTimeout(() => {}, 20);
    const now = Date.now();
    while (Date.now() - now < 30);
  });
  await w.stop();
})().then(common.mustCall());

(async function() {
  const w = new SynchronousWorker();
  w.runInWorkerScope(() => {
    const req = w.createRequire(__filename);
    const vm = req('vm');
    const fs = req('fs');

    vm.runInThisContext(`({ fs }) => {
      const stream = fs.createReadStream('${__filename}');
      stream.on('open', () => {
        process._rawDebug('opened')
        console.log(process._getActiveHandles())
      })
      setTimeout(() => {}, 200000);
    }`)({ fs });
  })

  process._rawDebug('stopping');
  await w.stop();
  process._rawDebug('stopped');
})().then(common.mustCall());
