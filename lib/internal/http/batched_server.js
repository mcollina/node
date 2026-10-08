'use strict';

// http.createServer({ batched: true }): the node:http request and response
// classes on top of the http_batch transport (src/node_http_batch.cc).
// Native code owns the sockets and the parser and delivers every request
// parsed during one event loop iteration in one call. ServerResponse frames
// its own output, which goes back as raw bytes in one call per batch.
//
// Every connection gets a BatchedSocket, a lightweight stand-in for
// net.Socket. Upgrade and CONNECT requests detach the connection from the
// batched transport and hand a real net.Socket to the 'upgrade' and
// 'connect' listeners.

const {
  Array,
  Promise,
  SafeMap,
  StringPrototypeToLowerCase,
  Symbol,
  SymbolAsyncDispose,
} = primordials;

const EventEmitter = require('events');
const net = require('net');
const { Buffer } = require('buffer');
const { latin1Slice } = internalBinding('buffer');
const { triggerUncaughtException } = internalBinding('errors');
const {
  IncomingMessage,
  kDetachAbortSignal,
  readStart,
} = require('_http_incoming');
const { ServerResponse } = require('_http_server');
const {
  kUniqueHeaders,
  parseUniqueHeadersOption,
} = require('_http_outgoing');
const {
  ConnResetException,
  codes: {
    ERR_SERVER_NOT_RUNNING,
  },
} = require('internal/errors');
const { validateFunction, validateObject } = require('internal/validators');
const {
  ResponseBatch,
  listenBatched,
  applyTimeouts,
  readU32,
  knownHeaders,
  methods,
  symbols: {
    kBatch,
    kHandle,
    kOnBatch,
    kOnClose,
    kShared,
    kTimeouts,
    kUnref,
  },
  constants: {
    kHasBody,
    kUpgrade,
    kKeepAlive,
    kHeadPrefix,
    kBodyAbort,
    kConnectionClosed,
    kTrailers,
    kKnownHeader,
    kOpEnd,
    kOpRaw,
    kOpShutdown,
    kUserConnectionClose,
  },
} = require('internal/http/batched');

const kConnectionId = Symbol('kConnectionId');
const kRequestId = Symbol('kRequestId');
const kRemote = Symbol('kRemote');
const kReadPaused = Symbol('kReadPaused');
const kLocal = Symbol('kLocal');
const kSockets = Symbol('kSockets');
const kRequests = Symbol('kRequests');
const kIncomingMessage = Symbol('kIncomingMessage');
const kServerResponse = Symbol('kServerResponse');
const kResponseOptions = Symbol('kResponseOptions');

// The parts of net.Socket that node:http and common request handlers use.
class BatchedSocket extends EventEmitter {
  constructor(server, connectionId) {
    super();
    this.server = server;
    this[kConnectionId] = connectionId;
    // Id of the request whose response is being written, 0 between requests.
    this[kRequestId] = 0;
    this[kReadPaused] = false;
    this[kRemote] = null;
    this[kLocal] = null;
    this._httpMessage = null;
    this._paused = false;
    this.parser = null;
    this.destroyed = false;
    this.readable = true;
    this.writable = true;
    this.readableHighWaterMark = 16384;
    this.writableHighWaterMark = 16384;
    this.writableLength = 0;
    this.writableNeedDrain = false;
    // OutgoingMessage reads and resets the cork count through this.
    this._writableState = { corked: 0, errored: null, needDrain: false };
    this.encrypted = undefined;
  }

  #address(remote) {
    const key = remote ? kRemote : kLocal;
    let address = this[key];
    if (address === null) {
      address = {};
      const handle = this.server[kHandle];
      if (handle === null ||
          handle.connectionAddress(this[kConnectionId], remote, address) !== 0) {
        return {};
      }
      this[key] = address;
    }
    return address;
  }

  get remoteAddress() { return this.#address(true).address; }
  get remotePort() { return this.#address(true).port; }
  get remoteFamily() { return this.#address(true).family; }
  get localAddress() { return this.#address(false).address; }
  get localPort() { return this.#address(false).port; }
  get localFamily() { return this.#address(false).family; }

  address() {
    return this.#address(false);
  }

  write(data, encoding, cb) {
    if (typeof encoding === 'function') {
      cb = encoding;
      encoding = undefined;
    }
    const id = this[kRequestId];
    if (this.destroyed || !this.writable || id === 0) {
      if (typeof cb === 'function') process.nextTick(cb);
      return false;
    }
    if (data.length !== 0) {
      let latin1 = false;
      if (typeof data === 'string' && encoding !== undefined &&
          encoding !== 'utf8' && encoding !== 'utf-8') {
        if (encoding === 'latin1' || encoding === 'binary') {
          latin1 = true;
        } else {
          data = Buffer.from(data, encoding);
        }
      }
      this.server[kBatch].record(kOpRaw, 0, 0, id, null, data, latin1);
    }
    if (typeof cb === 'function') process.nextTick(cb);
    return true;
  }

  get writableCorked() {
    return this._writableState.corked;
  }

  // Records are batched until the end of the event loop iteration anyway.
  cork() {
    this._writableState.corked++;
  }

  uncork() {
    if (this._writableState.corked > 0) this._writableState.corked--;
  }

  pause() {
    if (!this.isPaused()) {
      this[kReadPaused] = true;
      this.server[kHandle]?.pauseConnection(this[kConnectionId]);
      this.emit('pause');
    }
    return this;
  }

  resume() {
    if (this.isPaused()) {
      this[kReadPaused] = false;
      this.server[kHandle]?.resumeConnection(this[kConnectionId]);
      this.emit('resume');
    }
    return this;
  }

  isPaused() {
    return this[kReadPaused];
  }

  // Socket-level timeouts are not tracked by the batched transport; the
  // native keep-alive and headers timeouts still apply.
  setTimeout(msecs, callback) {
    if (typeof callback === 'function') this.once('timeout', callback);
    return this;
  }

  setNoDelay() {
    return this;
  }

  setKeepAlive() {
    return this;
  }

  ref() {
    return this;
  }

  unref() {
    return this;
  }

  destroySoon() {
    this.end();
  }

  // Closes the connection once everything written so far is sent, also in
  // the middle of a request (for example after a hijacked response).
  end(data, encoding, cb) {
    if (typeof data === 'function') {
      cb = data;
      data = undefined;
    }
    if (data != null) this.write(data, encoding);
    if (!this.destroyed && this.writable) {
      this.writable = false;
      this.server[kBatch].record(kOpShutdown, 0, 0, this[kConnectionId],
                                null, null, false);
    }
    if (typeof cb === 'function') process.nextTick(cb);
    return this;
  }

  destroy(err) {
    if (this.destroyed) return this;
    this.destroyed = true;
    this.readable = false;
    this.writable = false;
    this.server[kHandle]?.closeConnection(this[kConnectionId]);
    if (err) process.nextTick(emitErrorNT, this, err);
    return this;
  }
}

function emitErrorNT(socket, err) {
  socket.emit('error', err);
}

function emitCloseNT(res) {
  if (!res._closed) {
    res.destroyed = true;
    res._closed = true;
    res.emit('close');
  }
}

// 'finish' listener of every ServerResponse.
function onResponseFinish() {
  const res = this;
  const req = res.req;
  const socket = res.socket;
  const server = socket.server;
  const id = socket[kRequestId];
  server[kBatch].record(kOpEnd, res._last ? kUserConnectionClose : 0, 0, id,
                        null, null, false);
  socket[kRequestId] = 0;
  // Once the response is done native code drops the rest of the body.
  if (!req.complete) {
    server[kRequests].delete(id);
    readStart(socket);
  }
  req[kDetachAbortSignal]();
  if (!req._consuming && !req._readableState.resumeScheduled) req._dump();
  res.detachSocket(socket);
  process.nextTick(emitCloseNT, res);
}

// Decodes `count` header fields at `o` into `raw`, returns the end offset.
function readFields(buf, o, raw, count) {
  for (let i = 0; i < count; i++) {
    const n = buf[o] | (buf[o + 1] << 8);
    o += 2;
    if ((n & kKnownHeader) !== 0) {
      raw[2 * i] = knownHeaders[n & ~kKnownHeader];
    } else {
      raw[2 * i] = latin1Slice(buf, o, o + n);
      o += n;
    }
    const valueLength = readU32(buf, o);
    o += 4;
    raw[2 * i + 1] = latin1Slice(buf, o, o + valueLength);
    o += valueLength;
  }
  return o;
}

function hasHostHeader(raw) {
  for (let i = 0; i < raw.length; i += 2) {
    const name = raw[i];
    if (name.length === 4 && StringPrototypeToLowerCase(name) === 'host') {
      return true;
    }
  }
  return false;
}

class BatchedHttpServer extends EventEmitter {
  constructor(options, requestListener) {
    super();
    if (typeof options === 'function') {
      requestListener = options;
      options = {};
    } else if (options == null) {
      options = {};
    } else {
      validateObject(options, 'options');
    }
    if (requestListener !== undefined) {
      validateFunction(requestListener, 'requestListener');
      this.on('request', requestListener);
    }
    this[kIncomingMessage] = options.IncomingMessage || IncomingMessage;
    this[kServerResponse] = options.ServerResponse || ServerResponse;
    this[kResponseOptions] = {
      highWaterMark: options.highWaterMark ?? 16384,
      rejectNonStandardBodyWrites: !!options.rejectNonStandardBodyWrites,
    };
    this[kSockets] = new SafeMap();
    this[kRequests] = new SafeMap();
    this[kBatch] = new ResponseBatch();
    this[kShared] = Buffer.allocUnsafeSlow(128 * 1024);
    this[kHandle] = null;
    this[kTimeouts] = {
      keepAliveTimeout: options.keepAliveTimeout ?? 5000,
      headersTimeout: options.headersTimeout ?? 60000,
      maxHeaderSize: options.maxHeaderSize ?? 0,
    };
    this[kUniqueHeaders] = parseUniqueHeadersOption(options.uniqueHeaders);
    this.requireHostHeader = options.requireHostHeader ?? true;
    this.joinDuplicateHeaders = options.joinDuplicateHeaders;
    this.maxHeadersCount = null;
    this.timeout = 0;
    // Accepted for compatibility; the batched transport only enforces the
    // headers and keep-alive timeouts.
    this.requestTimeout = options.requestTimeout ?? 300000;
    this.maxRequestsPerSocket = 0;
    this.connectionsCheckingInterval =
      options.connectionsCheckingInterval ?? 30000;
    this.listening = false;
  }

  get keepAliveTimeout() { return this[kTimeouts].keepAliveTimeout; }
  set keepAliveTimeout(ms) {
    this[kTimeouts].keepAliveTimeout = ms;
    this.#updateTimeouts();
  }

  get headersTimeout() { return this[kTimeouts].headersTimeout; }
  set headersTimeout(ms) {
    this[kTimeouts].headersTimeout = ms;
    this.#updateTimeouts();
  }

  #updateTimeouts() {
    if (this[kHandle] !== null) applyTimeouts(this, this[kHandle]);
  }

  listen(...args) {
    return listenBatched(this, args);
  }

  address() {
    const handle = this[kHandle];
    if (handle === null) return null;
    const out = {};
    return handle.getsockname(out) === 0 ? out : null;
  }

  close(cb) {
    const handle = this[kHandle];
    if (typeof cb === 'function') {
      if (handle === null || !this.listening) {
        this.once('close', () => cb(new ERR_SERVER_NOT_RUNNING()));
      } else {
        this.once('close', cb);
      }
    }
    if (handle !== null && this.listening) {
      this.listening = false;
      this[kBatch].flush();
      handle.close();
    } else if (handle === null) {
      process.nextTick(() => this.emit('close'));
    }
    return this;
  }

  closeAllConnections() {
    this[kHandle]?.closeAllConnections();
  }

  closeIdleConnections() {
    this[kHandle]?.closeIdleConnections();
  }

  setTimeout(msecs, callback) {
    this.timeout = msecs;
    if (typeof callback === 'function') this.on('timeout', callback);
    return this;
  }

  ref() {
    this[kUnref] = false;
    this[kHandle]?.ref();
    return this;
  }

  async [SymbolAsyncDispose]() {
    if (!this.listening) return;
    await new Promise((resolve, reject) => {
      this.close((err) => (err ? reject(err) : resolve()));
    });
  }

  unref() {
    this[kUnref] = true;
    this[kHandle]?.unref();
    return this;
  }

  [kOnClose]() {
    this[kRequests].clear();
    this[kSockets].clear();
    this.emit('close');
  }

  [kOnBatch](headsLength, heads, bodies) {
    const batch = this[kBatch];
    batch.dispatching = true;
    try {
      if (heads !== null) {
        this.#parseHeads(heads, heads.length);
      } else if (headsLength > 0) {
        this.#parseHeads(this[kShared], headsLength);
      }
      if (bodies !== null) this.#parseBodies(bodies);
    } finally {
      batch.dispatching = false;
    }
    batch.flush();
  }

  #parseHeads(buf, length) {
    let o = 0;
    while (o < length) {
      const id = readU32(buf, o);
      const flags = buf[o + 4];
      const method = methods[buf[o + 5]];
      const major = buf[o + 6];
      const minor = buf[o + 7];
      const urlLength = readU32(buf, o + 8);
      const count = buf[o + 12] | (buf[o + 13] << 8);
      const connectionId = readU32(buf, o + 16);
      o += kHeadPrefix;
      const url = latin1Slice(buf, o, o + urlLength);
      o += urlLength;
      const raw = new Array(count * 2);
      o = readFields(buf, o, raw, count);
      try {
        this.#startRequest(id, flags, method, url, raw, major, minor,
                           connectionId);
      } catch (err) {
        // Same outcome as a throwing 'request' listener in node:http, without
        // dropping the rest of the batch when it is handled.
        triggerUncaughtException(err, false);
      }
    }
  }

  #newRequest(socket, method, url, raw, major, minor) {
    const req = new this[kIncomingMessage](socket);
    req.httpVersionMajor = major;
    req.httpVersionMinor = minor;
    req.httpVersion = major === 1 && minor === 1 ? '1.1' : `${major}.${minor}`;
    req.joinDuplicateHeaders = this.joinDuplicateHeaders;
    req.url = url;
    req.upgrade = false;
    let n = raw.length;
    if (this.maxHeadersCount > 0 && n > this.maxHeadersCount * 2) {
      n = this.maxHeadersCount * 2;
    }
    req._addHeaderLines(raw, n);
    req.method = method;
    return req;
  }

  #startRequest(id, flags, method, url, raw, major, minor, connectionId) {
    const sockets = this[kSockets];
    let socket = sockets.get(connectionId);
    if (socket === undefined) {
      socket = new BatchedSocket(this, connectionId);
      sockets.set(connectionId, socket);
      if (this._events.connection !== undefined) {
        this.emit('connection', socket);
      }
    }

    if ((flags & kUpgrade) !== 0) {
      const event = method === 'CONNECT' ? 'connect' : 'upgrade';
      if (this.listenerCount(event) > 0) {
        this.#handOver(event, socket, method, url, raw, major, minor);
        return;
      }
      if (event === 'connect') {
        socket.destroy();
        return;
      }
      // Without an 'upgrade' listener the request is served as an ordinary
      // one; native code closes the connection after the response.
    }

    const req = this.#newRequest(socket, method, url, raw, major, minor);
    const hasBody = (flags & kHasBody) !== 0;
    if (hasBody) this[kRequests].set(id, req);

    const res = new this[kServerResponse](req, this[kResponseOptions]);
    res._keepAliveTimeout = this[kTimeouts].keepAliveTimeout;
    res._maxRequestsPerSocket = 0;
    res.shouldKeepAlive = (flags & kKeepAlive) !== 0;
    res[kUniqueHeaders] = this[kUniqueHeaders];
    socket[kRequestId] = id;
    res.assignSocket(socket);
    res.on('finish', onResponseFinish);

    if (major === 1 && minor === 1 && this.requireHostHeader &&
        !hasHostHeader(raw)) {
      res.writeHead(400, ['Connection', 'close']);
      res.end();
    } else {
      this.emit('request', req, res);
    }

    // As in node:http, a bodyless request ends after the 'request' handler.
    if (!hasBody && !req.complete) {
      req.complete = true;
      req.push(null);
    }
  }

  // Detaches the connection from the batched transport and emits 'upgrade'
  // or 'connect' with a net.Socket for the same descriptor.
  #handOver(event, socket, method, url, raw, major, minor) {
    const connectionId = socket[kConnectionId];
    this[kSockets].delete(connectionId);
    socket.destroyed = true;
    const result = this[kHandle].detach(connectionId);
    if (typeof result === 'number') {
      // Not detachable (writes still queued, or no descriptor to share).
      this[kHandle].closeConnection(connectionId);
      return;
    }
    const { 0: fd, 1: head } = result;
    const netSocket = new net.Socket({ fd, readable: true, writable: true });
    netSocket.server = this;
    const req = this.#newRequest(netSocket, method, url, raw, major, minor);
    req.upgrade = true;
    req.complete = true;
    req.push(null);
    this.emit(event, req, netSocket, head);
  }

  #parseBodies(buf) {
    const requests = this[kRequests];
    const length = buf.length;
    let o = 0;
    while (o < length) {
      const id = readU32(buf, o);
      const len = readU32(buf, o + 4);
      o += 8;
      if (len === kConnectionClosed) {
        this.#connectionClosed(id);
        continue;
      }
      if (len === kTrailers) {
        const fieldsLength = readU32(buf, o);
        const req = requests.get(id);
        if (req !== undefined) {
          const count = buf[o + 4] | (buf[o + 5] << 8);
          const raw = new Array(count * 2);
          readFields(buf, o + 6, raw, count);
          // As in node:http, trailers arrive once the request is complete.
          req.complete = true;
          req._addHeaderLines(raw, raw.length);
        }
        o += 4 + fieldsLength;
        continue;
      }
      const req = requests.get(id);
      if (len === 0) {
        if (req !== undefined) {
          requests.delete(id);
          req.complete = true;
          req.push(null);
          // As parserOnMessageComplete() does: backpressure may have paused
          // the connection, and the next request has to be read.
          readStart(req.socket);
        }
      } else if (len === kBodyAbort) {
        if (req !== undefined) {
          requests.delete(id);
          if (!req.complete) req.destroy(new ConnResetException('aborted'));
        }
      } else {
        if (req !== undefined && !req._dumped &&
            !req.push(buf.subarray(o, o + len))) {
          req.socket.pause();
        }
        o += len;
      }
    }
  }

  #connectionClosed(connectionId) {
    const sockets = this[kSockets];
    const socket = sockets.get(connectionId);
    if (socket === undefined) return;
    sockets.delete(connectionId);
    socket.destroyed = true;
    socket.readable = false;
    socket.writable = false;
    socket[kRequestId] = 0;
    // Like abortIncoming() in node:http.
    const res = socket._httpMessage;
    if (res !== null && !res.req.destroyed) {
      res.req.destroy(new ConnResetException('aborted'));
    }
    socket.emit('close', false);
  }
}

module.exports = {
  BatchedHttpServer,
  BatchedSocket,
};
