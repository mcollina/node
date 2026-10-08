'use strict';
const common = require('../common');

// Large bodies are written from the memory they were given in. Write
// callbacks wait until the kernel has the bytes, so buffers can be reused
// from there on, as with node:http.

const assert = require('assert');
const http = require('http');
const net = require('net');

process.removeAllListeners('warning');

const size = 8 * 1024 * 1024;

async function start(handler) {
  const server = http.createServer({ batched: true }, handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { server, port: server.address().port };
}

// Sends `raw` and resolves with the body bytes of every response.
function exchange(port, raw, onConnect) {
  return new Promise((resolve) => {
    const chunks = [];
    const socket = net.connect(port, '127.0.0.1', () => {
      socket.write(raw);
      onConnect?.(socket);
    });
    socket.on('data', (chunk) => chunks.push(chunk));
    socket.on('end', () => {
      const text = Buffer.concat(chunks).toString('latin1');
      resolve(text.split(/HTTP\/1\.1 200 OK\r\n[^]*?\r\n\r\n/).slice(1));
    });
  });
}

function checkBody(body, char, length) {
  assert.strictEqual(body.length, length);
  // Positions only: a diff of megabytes would not help.
  assert.strictEqual(body.search(new RegExp(`[^${char}]`)), -1);
}

(async () => {
  {
    // The client reads only once the response is queued.
    let client;
    const { server } = await start(common.mustCall((req, res) => {
      const buffer = Buffer.alloc(size, 'a');
      res.setHeader('Content-Length', size + 1);
      res.write(buffer, common.mustCall(() => {
        buffer.fill('b');
        res.end('a');
      }));
      setImmediate(() => client.resume());
    }));
    const bodies = await exchange(
      server.address().port,
      'GET / HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n',
      (socket) => {
        socket.pause();
        client = socket;
      });
    checkBody(bodies[0], 'a', size + 1);
    server.close();
  }

  {
    // A large response waits behind a pipelined one, then a string body.
    const responses = [];
    const { server } = await start(common.mustCall((req, res) => {
      responses.push(res);
      if (responses.length < 2) return;
      const buffer = Buffer.alloc(size, 'b');
      responses[1].end(buffer, common.mustCall(() => buffer.fill('x')));
      setImmediate(() => responses[0].end('c'.repeat(size)));
    }, 2));
    const bodies = await exchange(
      server.address().port,
      'GET /1 HTTP/1.1\r\nHost: x\r\n\r\n' +
      'GET /2 HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');
    assert.strictEqual(bodies.length, 2);
    checkBody(bodies[0], 'c', size);
    checkBody(bodies[1], 'b', size);
    server.close();
  }
})().then(common.mustCall());
