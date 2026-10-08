// Flags: --expose-internals
'use strict';
const common = require('../common');
const assert = require('assert');
const net = require('net');
const http = require('http');
const { createBatchedServer } = require('internal/http/batched');

async function start(handler, options) {
  const server = createBatchedServer(options, handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { server, port: server.address().port };
}

function stop(server) {
  return new Promise((resolve) => {
    server.closeAllConnections();
    server.close(resolve);
  });
}

// Writes `data` to a raw connection and resolves with everything the server
// sends until it closes the connection, or until `until` matches the
// received text.
function raw(port, data, until) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(port, '127.0.0.1');
    let received = '';
    socket.setEncoding('latin1');
    socket.on('data', (chunk) => {
      received += chunk;
      if (until !== undefined && until(received)) {
        socket.destroy();
        resolve(received);
      }
    });
    socket.on('end', () => resolve(received));
    socket.on('error', reject);
    if (typeof data === 'function') {
      data(socket);
    } else {
      socket.write(data);
    }
  });
}

function countResponses(text) {
  return text.split('HTTP/1.1 ').length - 1;
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

test('serves a response built with the node:http req/res API', async () => {
  const { server, port } = await start((req, res) => {
    res.statusCode = 201;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('X-Method', req.method);
    res.end(`hello ${req.url}`);
  });
  const response = await fetch(`http://127.0.0.1:${port}/path?q=1`);
  assert.strictEqual(response.status, 201);
  assert.strictEqual(response.headers.get('content-type'), 'text/plain');
  assert.strictEqual(response.headers.get('x-method'), 'GET');
  assert.strictEqual(response.headers.get('content-length'), '15');
  assert.match(response.headers.get('date'), /^\w{3}, \d{2} \w{3} \d{4} /);
  assert.strictEqual(await response.text(), 'hello /path?q=1');
  await stop(server);
});

test('exposes request headers and emits end for bodyless requests', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    req.on('end', common.mustCall(() => {
      res.end(`${req.headers['x-test']}|${req.httpVersion}|${req.complete}`);
    }));
  }));
  const response = await fetch(`http://127.0.0.1:${port}/`, {
    headers: { 'x-test': 'yes' },
  });
  assert.strictEqual(await response.text(), 'yes|1.1|true');
  await stop(server);
});

test('streams request bodies through data and end events', async () => {
  const { server, port } = await start((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => res.end(Buffer.concat(chunks).toString().toUpperCase()));
  });
  const response = await fetch(`http://127.0.0.1:${port}/`, {
    method: 'POST',
    body: 'abc'.repeat(10000),
  });
  assert.strictEqual(await response.text(), 'ABC'.repeat(10000));
  await stop(server);
});

test('supports async handlers and res.write', async () => {
  const { server, port } = await start(async (req, res) => {
    await new Promise(setImmediate);
    res.write('a');
    await Promise.resolve();
    res.write('b');
    res.end('c');
  });
  const response = await fetch(`http://127.0.0.1:${port}/`);
  assert.strictEqual(response.headers.get('transfer-encoding'), 'chunked');
  assert.strictEqual(await response.text(), 'abc');
  await stop(server);
});

test('handles concurrent requests', async () => {
  const { server, port } = await start((req, res) => res.end(req.url));
  const bodies = await Promise.all(Array.from({ length: 50 }, (_, i) =>
    fetch(`http://127.0.0.1:${port}/${i}`).then((r) => r.text())));
  assert.deepStrictEqual(bodies, Array.from({ length: 50 }, (_, i) => `/${i}`));
  await stop(server);
});

test('a throwing handler produces a 500 response', async () => {
  const { server, port } = await start(() => {
    throw new Error('boom');
  });
  server.on('error', common.mustCall((err) => {
    assert.strictEqual(err.message, 'boom');
  }));
  const response = await fetch(`http://127.0.0.1:${port}/`);
  assert.strictEqual(response.status, 500);
  assert.strictEqual(await response.text(), 'Internal Server Error');
  await stop(server);
});

test('a rejected async handler produces a 500 response', async () => {
  const { server, port } = await start(async () => {
    await null;
    throw new Error('boom');
  });
  const response = await fetch(`http://127.0.0.1:${port}/`);
  assert.strictEqual(response.status, 500);
  assert.strictEqual(await response.text(), 'Internal Server Error');
  await stop(server);
});

test('request body chunks retained after dispatch stay intact', async () => {
  const count = 20;
  const pending = [];
  const { server, port } = await start((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      // Answer only once every body has been read, so the chunks outlive
      // many batches.
      pending.push(() => res.end(Buffer.concat(chunks)));
      if (pending.length === count) pending.forEach((fn) => fn());
    });
  });
  const bodies = Array.from({ length: count }, (_, i) => String(i).repeat(5000));
  const echoed = await Promise.all(bodies.map((body) =>
    fetch(`http://127.0.0.1:${port}/`, { method: 'POST', body })
      .then((r) => r.text())));
  assert.deepStrictEqual(echoed, bodies);
  await stop(server);
});

test('pipelined requests come back in order', async () => {
  let n = 0;
  const { server, port } = await start((req, res) => {
    // Answer the first request last.
    if (n++ === 0) setImmediate(() => res.end(req.url));
    else res.end(req.url);
  });
  const text = await raw(port,
                         'GET /a HTTP/1.1\r\nHost: x\r\n\r\n' +
                         'GET /b HTTP/1.1\r\nHost: x\r\n\r\n' +
                         'GET /c HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');
  assert.strictEqual(countResponses(text), 3);
  const order = text.match(/\r\n\r\n\/[abc]/g).map((s) => s.slice(4));
  assert.deepStrictEqual(order, ['/a', '/b', '/c']);
  assert.match(text, /Connection: close\r\n\r\n\/c$/);
  await stop(server);
});

test('keep-alive, Connection: close and HTTP/1.0', async () => {
  const { server, port } = await start((req, res) => res.end('ok'));

  // Two requests on one connection, the second asking to close.
  const text = await raw(port, (socket) => {
    socket.write('GET / HTTP/1.1\r\nHost: x\r\n\r\n');
    socket.once('data', () => {
      socket.write('GET / HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');
    });
  });
  assert.strictEqual(countResponses(text), 2);
  assert.doesNotMatch(text.split('HTTP/1.1 ')[1], /Connection/);
  assert.match(text.split('HTTP/1.1 ')[2], /Connection: close/);

  // HTTP/1.0 closes by default.
  const text10 = await raw(port, 'GET / HTTP/1.0\r\n\r\n');
  assert.match(text10, /^HTTP\/1\.1 200 OK\r\n/);
  assert.match(text10, /Connection: close\r\n/);
  assert.match(text10, /\r\n\r\nok$/);

  // HTTP/1.0 keep-alive is acknowledged.
  const text10ka = await raw(
    port, 'GET / HTTP/1.0\r\nConnection: keep-alive\r\n\r\n',
    (t) => t.endsWith('ok'));
  assert.match(text10ka, /Connection: keep-alive\r\n/);
  await stop(server);
});

test('HEAD, 204 and 304 responses have no body', async () => {
  const { server, port } = await start((req, res) => {
    if (req.url === '/204') res.statusCode = 204;
    if (req.url === '/304') res.statusCode = 304;
    res.end('body');
  });
  const text = await raw(port,
                         'HEAD / HTTP/1.1\r\nHost: x\r\n\r\n' +
                         'GET /204 HTTP/1.1\r\nHost: x\r\n\r\n' +
                         'GET /304 HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');
  assert.strictEqual(countResponses(text), 3);
  assert.doesNotMatch(text, /body/);
  const [, head, r204, r304] = text.split('HTTP/1.1 ');
  assert.match(head, /^200 OK\r\n/);
  assert.match(head, /Content-Length: 4\r\n/);
  assert.match(r204, /^204 No Content\r\n/);
  assert.doesNotMatch(r204, /Content-Length/);
  assert.match(r304, /^304 Not Modified\r\n/);
  await stop(server);
});

test('Expect: 100-continue', async () => {
  const { server, port } = await start((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => res.end(Buffer.concat(chunks)));
  });
  const text = await raw(port, common.mustCall((socket) => {
    socket.write('POST / HTTP/1.1\r\nHost: x\r\nContent-Length: 5\r\n' +
                 'Expect: 100-continue\r\nConnection: close\r\n\r\n');
    socket.once('data', common.mustCall((chunk) => {
      assert.strictEqual(chunk, 'HTTP/1.1 100 Continue\r\n\r\n');
      socket.write('hello');
    }));
  }));
  assert.match(text, /\r\n\r\nhello$/);
  await stop(server);
});

test('chunked request bodies', async () => {
  const { server, port } = await start((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => res.end(Buffer.concat(chunks)));
  });
  const text = await raw(port,
                         'POST / HTTP/1.1\r\nHost: x\r\nTransfer-Encoding: chunked\r\n' +
                         'Connection: close\r\n\r\n' +
                         '3\r\nabc\r\n4\r\ndefg\r\n0\r\n\r\n');
  assert.match(text, /Content-Length: 7\r\n/);
  assert.match(text, /\r\n\r\nabcdefg$/);
  await stop(server);
});

test('heads bigger than the shared buffer arrive intact', async () => {
  const big = 'v'.repeat(1000);
  const { server, port } = await start((req, res) => {
    res.end(req.headers['x-big']);
  }, { requestHeadsBufferSize: 64 });
  const response = await fetch(`http://127.0.0.1:${port}/`, {
    headers: { 'x-big': big },
  });
  assert.strictEqual(await response.text(), big);
  await stop(server);
});

test('a client disconnecting mid-body aborts the request', async () => {
  const { promise, resolve } = Promise.withResolvers();
  const { server, port } = await start(common.mustCall((req, res) => {
    req.on('data', common.mustCallAtLeast());
    req.on('end', common.mustNotCall());
    req.on('aborted', common.mustCall());
    req.on('close', common.mustCall(() => {
      assert.strictEqual(req.aborted, true);
      // Responding to an aborted request is a no-op.
      res.end('late');
      resolve();
    }));
  }));
  const socket = net.connect(port, '127.0.0.1', () => {
    socket.write('POST / HTTP/1.1\r\nHost: x\r\nContent-Length: 100\r\n\r\nabc',
                 () => setImmediate(() => socket.destroy()));
  });
  await promise;
  await stop(server);
});

test('an early response to a POST keeps the connection usable', async () => {
  const { server, port } = await start((req, res) => {
    req.on('data', () => {});
    res.end(`early ${req.url}`);
  });
  const text = await raw(port, (socket) => {
    socket.write('POST /a HTTP/1.1\r\nHost: x\r\nContent-Length: 6\r\n\r\nabc');
    socket.once('data', () => {
      socket.write('def');
      socket.write('GET /b HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');
    });
  });
  assert.strictEqual(countResponses(text), 2);
  assert.match(text, /early \/a/);
  assert.match(text, /early \/b$/);
  await stop(server);
});

test('method, URL and header names decode exactly', async () => {
  const { server, port } = await start((req, res) => {
    res.end(JSON.stringify([req.method, req.url, req.rawHeaders]));
  });
  const text = await raw(port,
                         'PURGE /hi?x=1 HTTP/1.1\r\nHost: x\r\nX-Forwarded-Ssl: on\r\n' +
                         'X-Forwarded-For: 1.2.3.4\r\nConnection: close\r\n\r\n');
  const body = JSON.parse(text.slice(text.indexOf('\r\n\r\n') + 4));
  assert.deepStrictEqual(body, [
    'PURGE', '/hi?x=1',
    ['Host', 'x', 'X-Forwarded-Ssl', 'on', 'X-Forwarded-For', '1.2.3.4',
     'Connection', 'close'],
  ]);
  await stop(server);
});

test('duplicate request headers follow node:http rules', async () => {
  const { server, port } = await start((req, res) => {
    res.end(JSON.stringify(req.headers));
  });
  const text = await raw(port,
                         'GET / HTTP/1.1\r\nHost: a\r\nHost: b\r\nAccept: x\r\n' +
                         'Accept: y\r\nSet-Cookie: 1\r\nSet-Cookie: 2\r\n' +
                         'Connection: close\r\n\r\n');
  const body = JSON.parse(text.slice(text.indexOf('\r\n\r\n') + 4));
  assert.deepStrictEqual(body, {
    'host': 'a',
    'accept': 'x, y',
    'set-cookie': ['1', '2'],
    'connection': 'close',
  });
  await stop(server);
});

test('invalid response headers are rejected', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    assert.throws(() => res.setHeader('x-a', 'a\r\nInjected: 1'), {
      code: 'ERR_INVALID_CHAR',
    });
    assert.throws(() => res.setHeader('x\r\n', 'a'), {
      code: 'ERR_INVALID_HTTP_TOKEN',
    });
    res.statusMessage = 'OK\r\nInjected: 1';
    res.end();
  }));
  server.on('error', common.mustCall((err) => {
    assert.strictEqual(err.code, 'ERR_INVALID_CHAR');
  }));
  const response = await fetch(`http://127.0.0.1:${port}/`);
  assert.strictEqual(response.status, 500);
  assert.strictEqual(response.headers.get('injected'), null);
  await stop(server);
});

test('malformed requests and oversized heads are refused', async () => {
  const { server, port } = await start(common.mustNotCall(), {
    maxHeaderSize: 1024,
  });
  const bad = await raw(port, 'GET / HTTP/1.1\r\nHost x\r\n\r\n');
  assert.match(bad, /^HTTP\/1\.1 400 Bad Request\r\nConnection: close\r\n\r\n$/);
  const big = await raw(port,
                        `GET / HTTP/1.1\r\nX-Big: ${'a'.repeat(2000)}\r\n\r\n`);
  assert.match(big, /^HTTP\/1\.1 431 /);
  await stop(server);
});

test('response framing follows user headers', async () => {
  const { server, port } = await start((req, res) => {
    if (req.url === '/length') {
      res.setHeader('Content-Length', 6);
      res.write('abc');
      setImmediate(() => res.end('def'));
    } else if (req.url === '/cookies') {
      res.setHeader('Set-Cookie', ['a=1', 'b=2']);
      res.writeHead(200, 'Fine', { 'X-Other': 'yes' });
      res.end();
    }
  });
  const text = await raw(port,
                         'GET /length HTTP/1.1\r\nHost: x\r\n\r\n' +
                         'GET /cookies HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');
  const [, length, cookies] = text.split('HTTP/1.1 ');
  assert.doesNotMatch(length, /Transfer-Encoding/);
  assert.match(length, /Content-Length: 6\r\n/);
  assert.match(length, /\r\n\r\nabcdef$/);
  assert.match(cookies, /^200 Fine\r\n/);
  assert.match(cookies, /Set-Cookie: a=1\r\nSet-Cookie: b=2\r\nX-Other: yes\r\n/);
  assert.match(cookies, /Content-Length: 0\r\n/);
  await stop(server);
});

test('close() stops listening and closes idle connections', async () => {
  const { server, port } = await start((req, res) => res.end('ok'));
  assert.throws(() => server.listen(0), { code: 'ERR_SERVER_ALREADY_LISTEN' });
  const agent = new http.Agent({ keepAlive: true });
  const body = await new Promise((resolve) => {
    http.get({ port, agent }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => resolve(data));
    });
  });
  assert.strictEqual(body, 'ok');
  // The keep-alive connection is idle and must not keep the server open.
  await new Promise((resolve) => server.close(resolve));
  agent.destroy();
  await assert.rejects(fetch(`http://127.0.0.1:${port}/`), TypeError);
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
