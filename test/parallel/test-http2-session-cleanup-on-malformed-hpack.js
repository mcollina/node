'use strict';

const common = require('../common');
const assert = require('node:assert');
const http2 = require('node:http2');
const net = require('node:net');

// A server that sends a response header block which fails HPACK
// decompression (a HEADERS frame opening the block without END_HEADERS,
// followed by CONTINUATION frames carrying undecodable HPACK) causes
// nghttp2 to internally terminate the client session via
// nghttp2_session_terminate_session(COMPRESSION_ERROR), bypassing
// on_invalid_frame_recv_callback. This test ensures the client
// Http2Session still tears down correctly: it emits 'error' and 'close'
// and is destroyed, rather than being left permanently hung.

function makeFrame(type, flags, streamId, payload) {
  const header = Buffer.alloc(9);
  header.writeUIntBE(payload.length, 0, 3);
  header[3] = type;
  header[4] = flags;
  header.writeUInt32BE(streamId & 0x7fffffff, 5);
  return Buffer.concat([header, payload]);
}

const server = net.createServer((conn) => {
  conn.on('error', () => {});  // ignore EPIPE/ECONNRESET from the client

  let inbuf = Buffer.alloc(0);
  let blasted = false;

  conn.on('data', (chunk) => {
    inbuf = Buffer.concat([inbuf, chunk]);
    // Skip the HTTP/2 client connection preface (24 bytes).
    if (inbuf.length >= 24 && inbuf[0] === 0x50) {
      inbuf = inbuf.slice(24);
    }
    if (blasted) return;

    // Wait for the client's request HEADERS (with END_HEADERS), then open a
    // malformed response header block on that stream.
    let p = 0;
    while (p + 9 <= inbuf.length) {
      const len = inbuf.readUIntBE(p, 3);
      const type = inbuf[p + 3];
      const flags = inbuf[p + 4];
      const streamId = inbuf.readUInt32BE(p + 5) & 0x7fffffff;
      if (type === 0x01 && (flags & 0x04)) {  // HEADERS, END_HEADERS
        blasted = true;
        conn.write(makeFrame(0x04, 0, 0, Buffer.alloc(0)));          // SETTINGS
        // ':status' 200 via static table index 8, no END_HEADERS.
        conn.write(makeFrame(0x01, 0, streamId, Buffer.from([0x88])));
        // CONTINUATION carrying undecodable HPACK -> COMPRESSION_ERROR.
        conn.write(makeFrame(0x09, 0, streamId, Buffer.alloc(8, 0xbe)));
        break;
      }
      p += 9 + len;
    }
  });
});

server.listen(0, common.mustCall(() => {
  const port = server.address().port;
  const session = http2.connect(`http://127.0.0.1:${port}`);

  session.on('error', common.mustCall((err) => {
    assert.strictEqual(err.code, 'ERR_HTTP2_ERROR');
  }));

  // The session must be torn down once the malformed HPACK is processed; it
  // must not be left in a zombie state that swallows the in-flight request.
  session.on('close', common.mustCall(() => {
    assert.ok(session.destroyed, 'session must be destroyed after malformed HPACK');
    server.close();
  }));

  const req = session.request({ ':path': '/' });
  req.on('error', common.mustCall((err) => {
    assert.strictEqual(err.code, 'ERR_HTTP2_ERROR');
  }));
  req.end();
}));
