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

test('upgrades hand over a stream of the TLS connection', async () => {
  const { server, port } = await start(common.mustNotCall());
  server.on('upgrade', common.mustCall((req, stream, head) => {
    assert.strictEqual(req.headers.upgrade, 'echo');
    assert.strictEqual(stream.encrypted, true);
    stream.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: echo\r\n' +
                 'Connection: Upgrade\r\n\r\n');
    if (head.length > 0) stream.write(head);
    stream.on('data', (data) => stream.write(data));
    stream.on('end', () => stream.end());
  }));
  const socket = tls.connect({ port, host: '127.0.0.1', rejectUnauthorized: false });
  socket.write('GET / HTTP/1.1\r\nHost: x\r\nUpgrade: echo\r\n' +
               'Connection: Upgrade\r\n\r\nearly');
  let text = '';
  socket.setEncoding('latin1');
  socket.on('data', (chunk) => {
    text += chunk;
    if (text.endsWith('early')) socket.write('later');
    if (text.endsWith('later')) socket.end();
  });
  await new Promise((resolve) => socket.on('close', resolve));
  assert.match(text, /^HTTP\/1\.1 101 Switching Protocols\r\n/);
  assert.match(text, /\r\n\r\nearlylater$/);
  await stop(server);
});

test('a shared secureContext is rejected', () => {
  assert.throws(() => https.createServer({
    batched: true,
    secureContext: tls.createSecureContext(tlsOptions),
  }), { code: 'ERR_INVALID_ARG_VALUE' });
});

// Connects with TLS, sends one request and resolves with what was negotiated
// and the response body.
function tlsRequest(port, options = {}) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      port,
      host: '127.0.0.1',
      rejectUnauthorized: false,
      ...options,
    }, () => {
      const cn = socket.getPeerCertificate().subject.CN;
      const alpn = socket.alpnProtocol;
      socket.end('GET / HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');
      let text = '';
      socket.setEncoding('latin1');
      socket.on('data', (chunk) => { text += chunk; });
      socket.on('close', () => resolve({
        cn, alpn, body: text.slice(text.indexOf('\r\n\r\n') + 4),
      }));
    });
    socket.on('error', reject);
  });
}

test('servers and sockets pass the https and tls checks', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    assert.ok(req.socket instanceof tls.TLSSocket);
    res.end('ok');
  }));
  assert.ok(server instanceof https.Server);
  assert.ok(server instanceof tls.Server);
  server.on('secureConnection', common.mustCall((socket) => {
    assert.ok(socket instanceof tls.TLSSocket);
    assert.strictEqual(socket._secureEstablished, true);
  }));
  assert.strictEqual((await tlsRequest(port)).body, 'ok');
  await stop(server);
});

test('picks certificates by server name', async () => {
  const handler = common.mustCall((req, res) => {
    res.end(`${req.socket.servername}`);
  }, 4);
  const { server, port } = await start(handler);
  server.addContext('three.example', {
    key: fixtures.readKey('agent3-key.pem'),
    cert: fixtures.readKey('agent3-cert.pem'),
  });
  assert.deepStrictEqual(await tlsRequest(port), {
    cn: 'agent1', alpn: false, body: 'undefined',
  });
  assert.deepStrictEqual(await tlsRequest(port, { servername: 'three.example' }), {
    cn: 'agent3', alpn: false, body: 'three.example',
  });
  await stop(server);

  const withCallback = https.createServer({
    batched: true,
    ...tlsOptions,
    SNICallback: common.mustCall((servername, callback) => {
      setImmediate(callback, null, tls.createSecureContext({
        key: fixtures.readKey('agent3-key.pem'),
        cert: fixtures.readKey('agent3-cert.pem'),
      }));
    }, 2),
  }, handler);
  await new Promise((resolve) => withCallback.listen(0, '127.0.0.1', resolve));
  const callbackPort = withCallback.address().port;
  for (const servername of ['a.example', 'b.example']) {
    const { cn, body } = await tlsRequest(callbackPort, { servername });
    assert.strictEqual(cn, 'agent3');
    assert.strictEqual(body, servername);
  }
  await stop(withCallback);
});

test('ALPNProtocols and ALPNCallback', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    res.end('ok');
  }));
  assert.strictEqual(
    (await tlsRequest(port, { ALPNProtocols: ['h2', 'http/1.1'] })).alpn,
    'http/1.1');
  await assert.rejects(tlsRequest(port, { ALPNProtocols: ['h2'] }), {
    code: 'ERR_SSL_TLSV1_ALERT_NO_APPLICATION_PROTOCOL',
  });
  await stop(server);

  const withCallback = https.createServer({
    batched: true,
    ...tlsOptions,
    ALPNCallback: common.mustCall(({ protocols }) => protocols[1]),
  }, common.mustCall((req, res) => res.end('ok')));
  await new Promise((resolve) => withCallback.listen(0, '127.0.0.1', resolve));
  const { alpn } = await tlsRequest(withCallback.address().port,
                                    { ALPNProtocols: ['a', 'b'] });
  assert.strictEqual(alpn, 'b');
  await stop(withCallback);
});

test('keylog and tlsClientError', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    res.end('ok');
  }));
  server.on('keylog', common.mustCallAtLeast((line, socket) => {
    assert.ok(Buffer.isBuffer(line));
    assert.ok(socket instanceof tls.TLSSocket);
  }));
  await tlsRequest(port);
  const { promise, resolve } = Promise.withResolvers();
  server.on('tlsClientError', common.mustCall((err, socket) => {
    assert.match(err.code, /^ERR_SSL_/);
    resolve();
  }));
  const socket = net.connect(port, '127.0.0.1', () => {
    socket.write('GET / HTTP/1.1\r\n\r\n');
  });
  socket.on('error', () => {});
  await promise;
  socket.destroy();
  await stop(server);
});

test('setSecureContext changes the certificate of new connections', async () => {
  const { server, port } = await start(common.mustCall((req, res) => {
    res.end('ok');
  }, 2));
  assert.strictEqual((await tlsRequest(port)).cn, 'agent1');
  server.setSecureContext({
    key: fixtures.readKey('agent3-key.pem'),
    cert: fixtures.readKey('agent3-cert.pem'),
  });
  assert.strictEqual((await tlsRequest(port)).cn, 'agent3');
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
