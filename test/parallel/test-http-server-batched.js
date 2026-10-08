'use strict';
const common = require('../common');
const assert = require('assert');
const http = require('http');
const net = require('net');

common.expectWarning('ExperimentalWarning',
                     'http.createServer() batched option is an experimental ' +
                     'feature and might change at any time');

async function start(handler, options) {
  const server = http.createServer({ batched: true, ...options }, handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { server, port: server.address().port };
}

function stop(server) {
  return new Promise((resolve) => {
    server.closeAllConnections();
    server.close(resolve);
  });
}

// Writes to a raw connection and resolves with everything received until the
// server closes it, or until `until` matches.
function raw(port, write, until) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(port, '127.0.0.1');
    let received = '';
    socket.setEncoding('latin1');
    socket.on('data', (chunk) => {
      received += chunk;
      if (until !== undefined && until(received, socket)) {
        socket.destroy();
        resolve(received);
      }
    });
    socket.on('end', () => resolve(received));
    socket.on('error', reject);
    socket.on('connect', () => write(socket));
  });
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

test('serves IncomingMessage and ServerResponse objects', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    assert.ok(req instanceof http.IncomingMessage);
    assert.ok(res instanceof http.ServerResponse);
    assert.strictEqual(req.socket.remoteAddress, '127.0.0.1');
    assert.strictEqual(req.socket.localPort, port);
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${req.method} ${req.url} ${req.headers['x-test']}`);
  }));
  const response = await fetch(`http://127.0.0.1:${port}/a?b=1`, {
    headers: { 'x-test': 'yes' },
  });
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.headers.get('keep-alive'), 'timeout=5');
  assert.strictEqual(response.headers.get('content-length'), '14');
  assert.strictEqual(await response.text(), 'GET /a?b=1 yes');
  await stop(server);
});

test('streams request bodies with backpressure', async () => {
  const size = 4 * 1024 * 1024;
  const { server, port } = await start(common.mustCall((req, res) => {
    let received = 0;
    req.on('data', (chunk) => {
      received += chunk.length;
      // Stop reading for a while on every chunk.
      req.pause();
      setImmediate(() => req.resume());
    });
    req.on('end', common.mustCall(() => res.end(String(received))));
  }));
  const response = await fetch(`http://127.0.0.1:${port}/`, {
    method: 'POST',
    body: Buffer.alloc(size, 'x'),
  });
  assert.strictEqual(await response.text(), String(size));
  await stop(server);
});

test('trailers of chunked requests', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    req.resume();
    req.on('end', common.mustCall(() => {
      res.end(JSON.stringify([req.rawTrailers, req.trailers]));
    }));
  }));
  const text = await raw(port, (socket) => {
    socket.write('POST / HTTP/1.1\r\nHost: x\r\nTransfer-Encoding: chunked\r\n' +
                 'Connection: close\r\n\r\n3\r\nabc\r\n0\r\nX-Sum: 42\r\n\r\n');
  });
  const body = JSON.parse(text.slice(text.indexOf('\r\n\r\n') + 4));
  assert.deepStrictEqual(body, [['X-Sum', '42'], { 'x-sum': '42' }]);
  await stop(server);
});

test('upgrade hands a net.Socket over with the bytes already read', async () => {
  const { server, port } = await start(common.mustNotCall());
  server.on('upgrade', common.mustCall((req, socket, head) => {
    assert.ok(socket instanceof net.Socket);
    assert.strictEqual(req.url, '/ws');
    assert.strictEqual(req.headers.upgrade, 'echo');
    assert.strictEqual(head.toString(), 'early');
    socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: echo\r\n' +
                 'Connection: Upgrade\r\n\r\n');
    socket.write(head);
    socket.on('data', (data) => socket.write(data));
    socket.on('end', () => socket.end());
  }));
  const text = await raw(port, (socket) => {
    socket.write('GET /ws HTTP/1.1\r\nHost: x\r\nUpgrade: echo\r\n' +
                 'Connection: Upgrade\r\n\r\nearly');
  }, (received, socket) => {
    if (received.endsWith('early')) socket.write('later');
    return received.endsWith('later');
  });
  assert.match(text, /^HTTP\/1\.1 101 Switching Protocols\r\n/);
  assert.match(text, /\r\n\r\nearlylater$/);
  await stop(server);
});

test('CONNECT hands a net.Socket over', async () => {
  const { server, port } = await start(common.mustNotCall());
  server.on('connect', common.mustCall((req, socket, head) => {
    assert.strictEqual(req.method, 'CONNECT');
    assert.strictEqual(req.url, 'example.com:443');
    socket.end(`HTTP/1.1 200 Connection Established\r\n\r\n${head}`);
  }));
  const text = await raw(port, (socket) => {
    socket.write('CONNECT example.com:443 HTTP/1.1\r\nHost: example.com\r\n\r\nhi');
  });
  assert.strictEqual(text, 'HTTP/1.1 200 Connection Established\r\n\r\nhi');
  await stop(server);
});

test('upgrade requests without a listener are answered and closed', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    res.end('plain');
  }));
  const text = await raw(port, (socket) => {
    socket.write('GET / HTTP/1.1\r\nHost: x\r\nUpgrade: echo\r\n' +
                 'Connection: Upgrade\r\n\r\n');
  });
  assert.match(text, /^HTTP\/1\.1 200 OK\r\n/);
  assert.match(text, /\r\n\r\nplain$/);
  await stop(server);
});

test('pipelined requests and a half-closed client are all answered', async () => {
  let n = 0;
  const { server, port } = await start(common.mustCall((req, res) => {
    // Answer the first request last.
    if (n++ === 0) setImmediate(() => res.end(req.url));
    else res.end(req.url);
  }, 3));
  const text = await raw(port, (socket) => {
    socket.end('GET /a HTTP/1.1\r\nHost: x\r\n\r\n' +
               'GET /b HTTP/1.1\r\nHost: x\r\n\r\n' +
               'GET /c HTTP/1.1\r\nHost: x\r\n\r\n');
  });
  const order = text.match(/\r\n\r\n\/[abc]/g).map((s) => s.slice(4));
  assert.deepStrictEqual(order, ['/a', '/b', '/c']);
  await stop(server);
});

test('a client going away aborts the request in flight', async () => {
  const { promise, resolve } = Promise.withResolvers();
  const { server, port } = await start(common.mustCall((req, res) => {
    req.on('error', common.mustCall((err) => {
      assert.strictEqual(err.code, 'ECONNRESET');
    }));
    res.on('close', common.mustCall(() => {
      assert.strictEqual(res.writableFinished, false);
      resolve();
    }));
    res.write('partial');
  }));
  await raw(port, (socket) => {
    socket.write('GET / HTTP/1.1\r\nHost: x\r\n\r\n');
  }, (received) => received.includes('partial'));
  await promise;
  await stop(server);
});

(async () => {
  for (const { name, fn } of tests) {
    try {
      await fn();
    } catch (err) {
      err.message = `${name}: ${err.message}`;
      throw err;
    }
  }
})().then(common.mustCall());
