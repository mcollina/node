'use strict';
const common = require('../common');
if (common.isWindows) common.skip('cluster connections are not adopted on Windows');

// Batched servers in cluster workers share the primary's port, with both
// scheduling policies.

const assert = require('assert');
const cluster = require('cluster');
const http = require('http');
const { spawnSync } = require('child_process');

if (process.argv[2] === 'child') {
  if (cluster.isPrimary) {
    let listening = 0;
    for (let i = 0; i < 2; i++) cluster.fork();
    cluster.on('listening', common.mustCall(async (worker, address) => {
      if (++listening < 2) return;
      const pids = new Set();
      for (let i = 0; i < 20; i++) {
        const response = await fetch(`http://127.0.0.1:${address.port}/`, {
          headers: { connection: 'close' },
        });
        pids.add(await response.text());
      }
      assert.strictEqual(pids.size, 2);
      for (const id in cluster.workers) cluster.workers[id].kill();
    }, 2));
  } else {
    process.removeAllListeners('warning');
    const server = http.createServer({ batched: true }, (req, res) => {
      res.end(String(process.pid));
    });
    server.listen(0, '127.0.0.1');
  }
  return;
}

for (const policy of ['rr', 'none']) {
  const child = spawnSync(process.execPath,
                          ['--no-warnings', __filename, 'child'], {
                            env: { ...process.env,
                                   NODE_CLUSTER_SCHED_POLICY: policy },
                            encoding: 'utf8',
                          });
  assert.strictEqual(child.status, 0, `${policy}: ${child.stderr}`);
}
