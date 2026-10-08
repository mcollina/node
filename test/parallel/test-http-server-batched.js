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
function test(name, options, fn) {
  if (fn === undefined) {
    fn = options;
    options = {};
  }
  if (!options.skip) tests.push({ name, fn });
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
  assert.strictEqual(response.headers.get('keep-alive'), 'timeout=65');
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

test('servers and sockets pass the node:http and net checks', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    assert.ok(req.socket instanceof net.Socket);
    assert.strictEqual(req.socket, connection);
    res.end('ok');
  }));
  assert.ok(server instanceof http.Server);
  assert.ok(server instanceof net.Server);
  let connection;
  server.on('connection', common.mustCall((socket) => {
    connection = socket;
  }));
  const response = await fetch(`http://127.0.0.1:${port}/`);
  assert.strictEqual(await response.text(), 'ok');
  await stop(server);
});

test('clientError listeners answer on the socket', async () => {
  const { server, port } = await start(common.mustNotCall());
  server.on('clientError', common.mustCall((err, socket) => {
    assert.strictEqual(err.code, 'HPE_INVALID_METHOD');
    assert.strictEqual(err.bytesParsed, 1);
    socket.end('HTTP/1.1 418 I\'m a Teapot\r\nConnection: close\r\n\r\n');
  }));
  const text = await raw(port, (socket) => socket.write('FOO / HTTP/1.1\r\n\r\n'));
  assert.strictEqual(text, 'HTTP/1.1 418 I\'m a Teapot\r\nConnection: close\r\n\r\n');
  await stop(server);
});

test('checkContinue decides about 100 Continue', async () => {
  const { server, port } = await start(common.mustNotCall());
  server.on('checkContinue', common.mustCall((req, res) => {
    res.writeContinue();
    req.setEncoding('latin1');
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => res.end(body.toUpperCase()));
  }));
  const text = await raw(port, common.mustCall((socket) => {
    socket.write('POST / HTTP/1.1\r\nHost: x\r\nExpect: 100-continue\r\n' +
                 'Content-Length: 5\r\nConnection: close\r\n\r\n');
    socket.once('data', common.mustCall((chunk) => {
      assert.strictEqual(chunk, 'HTTP/1.1 100 Continue\r\n\r\n');
      socket.write('hello');
    }));
  }));
  assert.match(text, /\r\n\r\nHELLO$/);
  await stop(server);
});

test('idle sockets time out', async () => {
  const { promise, resolve } = Promise.withResolvers();
  const { server, port } = await start(common.mustNotCall());
  server.setTimeout(50, common.mustCall((socket) => {
    assert.ok(socket instanceof net.Socket);
    socket.destroy();
    resolve();
  }));
  const socket = net.connect(port, '127.0.0.1');
  socket.on('error', () => {});
  socket.write('GET / HTTP/1.1\r\n');
  await promise;
  socket.destroy();
  await stop(server);
});

test('maxConnections drops connections over the limit', async () => {
  const { server, port } = await start(common.mustNotCall());
  server.maxConnections = 1;
  const { promise, resolve } = Promise.withResolvers();
  server.on('drop', common.mustCall((data) => {
    assert.strictEqual(data.remoteAddress, '127.0.0.1');
    resolve();
  }));
  const first = net.connect(port, '127.0.0.1');
  await new Promise((r) => first.on('connect', r));
  const second = net.connect(port, '127.0.0.1');
  second.on('error', () => {});
  await promise;
  first.destroy();
  second.destroy();
  await stop(server);
});

test('listens on Unix sockets and existing handles', {
  skip: common.isWindows,
}, async () => {
  const tmpdir = require('../common/tmpdir');
  tmpdir.refresh();
  const handler = common.mustCall((req, res) => res.end('ok'), 2);
  const pipe = http.createServer({ batched: true }, handler);
  await new Promise((resolve) => pipe.listen(common.PIPE, resolve));
  assert.strictEqual(pipe.address(), common.PIPE);
  const body = await new Promise((resolve) => {
    http.get({ socketPath: common.PIPE }, (res) => {
      res.setEncoding('latin1');
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    });
  });
  assert.strictEqual(body, 'ok');
  await stop(pipe);

  const tcp = net.createServer();
  await new Promise((resolve) => tcp.listen(0, '127.0.0.1', resolve));
  const fromHandle = http.createServer({ batched: true }, handler);
  await new Promise((resolve) => fromHandle.listen({ handle: tcp._handle }, resolve));
  const response = await fetch(`http://127.0.0.1:${fromHandle.address().port}/`);
  assert.strictEqual(await response.text(), 'ok');
  await stop(fromHandle);
});

test('responses wait for slow clients', async () => {
  const chunk = Buffer.alloc(1024 * 1024, 'x');
  let socket;
  const { server, port } = await start(common.mustCall((req, res) => {
    let writes = 0;
    while (res.write(chunk)) writes++;
    assert.ok(writes < 64);
    res.once('drain', common.mustCall(() => res.end()));
    // The client starts reading once the server is backed up.
    socket.resume();
  }));
  let received = 0;
  await raw(port, (s) => {
    socket = s;
    s.pause();
    s.write('GET / HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');
    s.on('data', (data) => { received += data.length; });
  });
  assert.ok(received > chunk.length);
  await stop(server);
});

test('upgrade requests with a body hand over a stream', async () => {
  const { server, port } = await start(common.mustNotCall());
  server.on('upgrade', common.mustCall((req, stream) => {
    let body = '';
    req.setEncoding('latin1');
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', common.mustCall(() => {
      assert.strictEqual(body, 'abc');
      stream.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: echo\r\n' +
                   'Connection: Upgrade\r\n\r\n');
      stream.on('data', (data) => stream.write(data));
      stream.on('end', () => stream.end());
    }));
  }));
  const text = await raw(port, (socket) => {
    socket.write('POST / HTTP/1.1\r\nHost: x\r\nUpgrade: echo\r\n' +
                 'Connection: Upgrade\r\nContent-Length: 3\r\n\r\nabcafter');
  }, (received) => received.endsWith('after'));
  assert.match(text, /^HTTP\/1\.1 101 Switching Protocols\r\n/);
  assert.match(text, /\r\n\r\nafter$/);
  await stop(server);
});

test('maxRequestsPerSocket answers 503 past the limit', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    res.end('ok');
  }));
  server.maxRequestsPerSocket = 1;
  server.on('dropRequest', common.mustCall());
  const text = await raw(port, (socket) => {
    socket.write('GET / HTTP/1.1\r\nHost: x\r\n\r\n' +
                 'GET / HTTP/1.1\r\nHost: x\r\n\r\n');
  }, (received) => received.includes('503'));
  assert.match(text, /^HTTP\/1\.1 200 OK\r\n/);
  assert.match(text, /HTTP\/1\.1 503 Service Unavailable\r\n/);
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
