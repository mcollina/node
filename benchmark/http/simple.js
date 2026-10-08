'use strict';
const common = require('../common.js');

const bench = common.createBenchmark(main, {
  // Unicode confuses ab on os x.
  type: ['bytes', 'buffer'],
  len: [4, 1024, 102400],
  chunks: [1, 4],
  c: [50, 500],
  chunkedEnc: [1, 0],
  batched: [0, 1],
  duration: 5,
});

function main({ type, len, chunks, c, chunkedEnc, batched, duration }) {
  let server = require('../fixtures/simple-http-server.js');
  if (batched) {
    process.removeAllListeners('warning');
    server = require('http').createServer({ batched: true }, server.handler);
  }
  server
  .listen(0)
  .on('listening', () => {
    const path = `/${type}/${len}/${chunks}/normal/${chunkedEnc}`;

    bench.http({
      path,
      connections: c,
      duration,
      port: server.address().port,
    }, () => {
      server.close();
    });
  });
}
