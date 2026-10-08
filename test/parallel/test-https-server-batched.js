'use strict';
const common = require('../common');
if (!common.hasCrypto) common.skip('missing crypto');

const assert = require('assert');
const https = require('https');
const net = require('net');
const tls = require('tls');
const fixtures = require('../common/fixtures');

common.expectWarning('ExperimentalWarning',
                     'https.createServer() batched option is an experimental ' +
                     'feature and might change at any time');

const tlsOptions = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem'),
};

async function start(handler) {
  const server = https.createServer({ batched: true, ...tlsOptions }, handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { server, port: server.address().port };
}

function stop(server) {
  return new Promise((resolve) => {
    server.closeAllConnections();
    server.close(resolve);
  });
}

function request(port, agent, path, method = 'GET', body) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      host: '127.0.0.1',
      port,
      path,
      method,
      agent,
      rejectUnauthorized: false,
    }, (res) => {
      let data = '';
      res.setEncoding('latin1');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ res, data, reused: req.reusedSocket }));
    });
    req.on('error', reject);
    req.end(body);
  });
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

test('serves requests over TLS with keep-alive', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    assert.strictEqual(req.socket.encrypted, true);
    res.setHeader('Content-Type', 'text/plain');
    res.end(`hello ${req.url}`);
  }, 3));
  const agent = new https.Agent({ keepAlive: true });
  for (const [i, path] of ['/a', '/b', '/c'].entries()) {
    const { res, data, reused } = await request(port, agent, path);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(data, `hello ${path}`);
    assert.strictEqual(reused, i > 0);
  }
  agent.destroy();
  await stop(server);
});

test('streams large request and response bodies', async () => {
  const size = 2 * 1024 * 1024;
  const { server, port } = await start(common.mustCall((req, res) => {
    let received = 0;
    req.on('data', (chunk) => { received += chunk.length; });
    req.on('end', () => res.end(Buffer.alloc(received, 'y')));
  }));
  const { data } = await request(port, undefined, '/', 'POST',
                                 Buffer.alloc(size, 'x'));
  assert.strictEqual(data.length, size);
  assert.strictEqual(data, 'y'.repeat(size));
  await stop(server);
});

test('selects http/1.1 with ALPN', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    res.end('ok');
  }));
  const socket = tls.connect({
    port,
    host: '127.0.0.1',
    rejectUnauthorized: false,
    ALPNProtocols: ['h2', 'http/1.1'],
  });
  await new Promise((resolve) => socket.on('secureConnect', resolve));
  assert.strictEqual(socket.alpnProtocol, 'http/1.1');
  socket.end('GET / HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');
  let text = '';
  socket.setEncoding('latin1');
  socket.on('data', (chunk) => { text += chunk; });
  await new Promise((resolve) => socket.on('close', resolve));
  assert.match(text, /^HTTP\/1\.1 200 OK\r\n/);
  assert.match(text, /\r\n\r\nok$/);
  await stop(server);
});

test('a client going away aborts the request in flight', async () => {
  const { promise, resolve } = Promise.withResolvers();
  const { server, port } = await start(common.mustCall((req, res) => {
    req.on('error', common.mustCall((err) => {
      assert.strictEqual(err.code, 'ECONNRESET');
    }));
    res.on('close', common.mustCall(resolve));
    res.write('partial');
  }));
  const socket = tls.connect({ port, host: '127.0.0.1', rejectUnauthorized: false });
  socket.write('GET / HTTP/1.1\r\nHost: x\r\n\r\n');
  socket.on('data', common.mustCall(() => socket.destroy()));
  await promise;
  await stop(server);
});

test('plaintext and garbage on the TLS port close the connection', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    res.end('alive');
  }));
  for (const payload of ['GET / HTTP/1.1\r\nHost: x\r\n\r\n', 'x'.repeat(100)]) {
    await new Promise((resolve) => {
      const socket = net.connect(port, '127.0.0.1', () => socket.write(payload));
      socket.on('error', () => {});
      socket.on('close', resolve);
      socket.resume();
    });
  }
  // The server still works.
  const { data } = await request(port, undefined, '/');
  assert.strictEqual(data, 'alive');
  await stop(server);
});

test('upgrade requests are answered as ordinary requests', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    res.end('plain');
  }));
  server.on('upgrade', common.mustNotCall());
  const socket = tls.connect({ port, host: '127.0.0.1', rejectUnauthorized: false });
  socket.write('GET / HTTP/1.1\r\nHost: x\r\nUpgrade: echo\r\n' +
               'Connection: Upgrade\r\n\r\n');
  let text = '';
  socket.setEncoding('latin1');
  socket.on('data', (chunk) => { text += chunk; });
  await new Promise((resolve) => socket.on('close', resolve));
  assert.match(text, /^HTTP\/1\.1 200 OK\r\n/);
  assert.match(text, /\r\n\r\nplain$/);
  await stop(server);
});

test('verifies client certificates', async () => {
  const server = https.createServer({
    batched: true,
    ...tlsOptions,
    ca: fixtures.readKey('ca1-cert.pem'),
    requestCert: true,
    rejectUnauthorized: false,
  }, common.mustCall((req, res) => {
    const socket = req.socket;
    res.end(JSON.stringify([socket.authorized, socket.authorizationError,
                            socket.getPeerCertificate().subject?.CN ?? null]));
  }, 2));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const withCert = new https.Agent({
    key: fixtures.readKey('agent1-key.pem'),
    cert: fixtures.readKey('agent1-cert.pem'),
  });
  assert.deepStrictEqual(
    JSON.parse((await request(port, withCert, '/')).data),
    [true, null, 'agent1']);
  assert.deepStrictEqual(
    JSON.parse((await request(port, undefined, '/')).data),
    [false, 'UNABLE_TO_GET_ISSUER_CERT', null]);
  withCert.destroy();
  await stop(server);
});

test('rejectUnauthorized refuses clients without a valid certificate', async () => {
  const server = https.createServer({
    batched: true,
    ...tlsOptions,
    ca: fixtures.readKey('ca1-cert.pem'),
    requestCert: true,
  }, common.mustNotCall());
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  await assert.rejects(request(server.address().port, undefined, '/'),
                       (err) => typeof err.code === 'string');
  await stop(server);
});

test('resumes TLS sessions', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    res.end('ok');
  }, 2));
  let session;
  for (const reused of [false, true]) {
    const socket = tls.connect({
      port,
      host: '127.0.0.1',
      rejectUnauthorized: false,
      session,
      maxVersion: 'TLSv1.2',
    });
    socket.on('session', (s) => { session = s; });
    await new Promise((resolve) => socket.on('secureConnect', resolve));
    assert.strictEqual(socket.isSessionReused(), reused);
    socket.end('GET / HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');
    socket.resume();
    await new Promise((resolve) => socket.on('close', resolve));
  }
  await stop(server);
});

test('a shared secureContext is rejected', () => {
  assert.throws(() => https.createServer({
    batched: true,
    secureContext: tls.createSecureContext(tlsOptions),
  }), { code: 'ERR_INVALID_ARG_VALUE' });
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
