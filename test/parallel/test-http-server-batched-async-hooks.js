'use strict';
const common = require('../common');

// Batched servers give every connection the async resources of node:http:
// a TCPWRAP triggered by the server and an HTTPINCOMINGMESSAGE in which its
// requests run, so async context does not leak between requests that are
// delivered in the same batch.

const assert = require('assert');
const async_hooks = require('async_hooks');
const http = require('http');
const net = require('net');
const { AsyncLocalStorage } = async_hooks;

process.removeAllListeners('warning');

const resources = new Map();
const destroyed = new Set();
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    resources.set(asyncId, { type, triggerAsyncId, resource });
  },
  destroy(asyncId) {
    destroyed.add(asyncId);
  },
}).enable();

const als = new AsyncLocalStorage();
const seen = [];

const server = http.createServer({ batched: true }, common.mustCall((req, res) => {
  // Whatever an earlier request entered is gone.
  assert.strictEqual(als.getStore(), undefined);
  als.enterWith(req.url);

  const parser = resources.get(async_hooks.executionAsyncId());
  assert.strictEqual(parser.type, 'HTTPINCOMINGMESSAGE');
  assert.strictEqual(parser.resource.socket, req.socket);
  const tcp = resources.get(parser.triggerAsyncId);
  assert.strictEqual(tcp.type, 'TCPWRAP');
  assert.strictEqual(tcp.resource.socket, req.socket);
  const tcpServer = resources.get(tcp.triggerAsyncId);
  assert.strictEqual(tcpServer.type, 'TCPSERVERWRAP');
  seen.push({ parser: async_hooks.executionAsyncId(), tcp: parser.triggerAsyncId });

  req.on('end', common.mustCall(() => {
    // Body events run in the scope of the request.
    assert.strictEqual(als.getStore(), req.url);
    setImmediate(common.mustCall(() => {
      assert.strictEqual(als.getStore(), req.url);
      res.end(req.url);
    }));
  }));
  req.resume();
}, 4));

server.listen(0, '127.0.0.1', common.mustCall(async () => {
  const { port } = server.address();
  // Two connections, each with two pipelined requests.
  await Promise.all([['/a', '/b'], ['/c', '/d']].map((paths) => {
    const { promise, resolve } = Promise.withResolvers();
    const socket = net.connect(port, '127.0.0.1', () => {
      socket.end(paths.map((path, i) =>
        `POST ${path} HTTP/1.1\r\nHost: x\r\nContent-Length: 2\r\n` +
        `${i === paths.length - 1 ? 'Connection: close\r\n' : ''}\r\nhi`,
      ).join(''));
    });
    let text = '';
    socket.setEncoding('latin1');
    socket.on('data', (chunk) => { text += chunk; });
    socket.on('close', common.mustCall(() => {
      for (const path of paths) assert.match(text, new RegExp(`\r\n\r\n${path}`));
      resolve();
    }));
    return promise;
  }));
  server.close(common.mustCall(() => {
    setImmediate(common.mustCall(() => {
      // Requests on a connection share its resources, which are destroyed
      // with it.
      assert.strictEqual(new Set(seen.map((s) => s.parser)).size, 2);
      for (const { parser, tcp } of seen) {
        assert.ok(destroyed.has(parser));
        assert.ok(destroyed.has(tcp));
      }
    }));
  }));
}));
