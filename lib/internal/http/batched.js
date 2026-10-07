'use strict';

// An HTTP/1.1 server whose JavaScript layer is fed in batches. Sockets and
// llhttp live in src/node_http_batch.cc. Every request head and body chunk
// parsed during one event loop iteration reaches JavaScript through a single
// onBatch() call, and every response produced while dispatching it goes back
// through a single apply() call. The record formats are documented at the
// top of src/node_http_batch.cc.

const {
  Array,
  ArrayIsArray,
  FunctionPrototypeCall,
  MathMax,
  NumberIsInteger,
  ObjectDefineProperty,
  ObjectKeys,
  ObjectSetPrototypeOf,
  RegExpPrototypeExec,
  SafeMap,
  StringPrototypeToLowerCase,
  Symbol,
} = primordials;

const EventEmitter = require('events');
const { Buffer } = require('buffer');
const { latin1Slice } = internalBinding('buffer');
const { latin1Write, utf8Write } = require('internal/buffer');
const {
  BatchServer: BatchServerBinding,
  knownHeaders,
  methods,
} = internalBinding('http_batch');
const { IncomingMessage } = require('_http_incoming');
const {
  _checkInvalidHeaderChar: checkInvalidHeaderChar,
} = require('_http_common');
const {
  validateHeaderName,
  validateHeaderValue,
} = require('_http_outgoing');
const { STATUS_CODES } = require('_http_server');
const {
  ExceptionWithHostPort,
  codes: {
    ERR_HTTP_HEADERS_SENT,
    ERR_HTTP_INVALID_STATUS_CODE,
    ERR_INVALID_CHAR,
    ERR_SERVER_ALREADY_LISTEN,
    ERR_SERVER_NOT_RUNNING,
    ERR_STREAM_WRITE_AFTER_END,
  },
} = require('internal/errors');
const {
  validateFunction,
  validateObject,
  validatePort,
} = require('internal/validators');
const { isIP } = require('internal/net');
const dns = require('dns');
const { setImmediate } = require('timers');

const kHasBody = 1;

const kOpHead = 1;
const kOpData = 2;
const kOpEnd = 3;
const kOpComplete = 4;
const kOpDestroy = 5;

const kUserContentLength = 1 << 0;
const kUserTransferEncoding = 1 << 1;
const kUserDate = 1 << 2;
const kUserConnection = 1 << 3;
const kUserConnectionClose = 1 << 4;

const kListenIPv6Only = 1 << 0;
const kListenReusePort = 1 << 1;

const kBodyAbort = 0xFFFFFFFF;
const kKnownHeader = 0x8000;

const kRecordPrefix = 16;
const kInitialOutSize = 64 * 1024;
// Responses bigger than this are written right away instead of waiting for
// the end of the batch, which bounds the size of the output buffer.
const kEagerFlushSize = 1024 * 1024;

const kId = Symbol('kId');
const kServer = Symbol('kServer');
const kHeaders = Symbol('kHeaders');
const kHeaderList = Symbol('kHeaderList');
const kHeadSent = Symbol('kHeadSent');
const kResponse = Symbol('kResponse');
const kHandle = Symbol('kHandle');
const kRequests = Symbol('kRequests');
const kOut = Symbol('kOut');
const kOutLength = Symbol('kOutLength');
const kDispatching = Symbol('kDispatching');
const kFlushScheduled = Symbol('kFlushScheduled');
const kShared = Symbol('kShared');
const kHandler = Symbol('kHandler');
const kTimeouts = Symbol('kTimeouts');

const RE_CONN_CLOSE = /(?:^|\W)close(?:$|\W)/i;

const statusLines = [];
function statusLine(statusCode) {
  let line = statusLines[statusCode];
  if (line === undefined) {
    line = `HTTP/1.1 ${statusCode} ${STATUS_CODES[statusCode] || 'unknown'}\r\n`;
    statusLines[statusCode] = line;
  }
  return line;
}

function readU32(buf, o) {
  return (buf[o] | (buf[o + 1] << 8) | (buf[o + 2] << 16)) +
    buf[o + 3] * 0x1000000;
}

// Request.

function BatchedIncomingMessage(server, id, method, url, rawHeaders,
                                major, minor) {
  this._events = undefined;
  this._eventsCount = 0;
  this._maxListeners = undefined;
  this[kServer] = server;
  this[kId] = id;
  this[kHeaders] = null;
  this[kResponse] = null;
  this.method = method;
  this.url = url;
  this.rawHeaders = rawHeaders;
  this.httpVersionMajor = major;
  this.httpVersionMinor = minor;
  this.httpVersion = major === 1 && minor === 1 ? '1.1' : `${major}.${minor}`;
  this.complete = false;
  this.aborted = false;
  this.joinDuplicateHeaders = false;
}
ObjectSetPrototypeOf(BatchedIncomingMessage.prototype, EventEmitter.prototype);
ObjectSetPrototypeOf(BatchedIncomingMessage, EventEmitter);

const addHeaderLine = IncomingMessage.prototype._addHeaderLine;

ObjectDefineProperty(BatchedIncomingMessage.prototype, 'headers', {
  __proto__: null,
  configurable: true,
  enumerable: true,
  get() {
    let headers = this[kHeaders];
    if (headers === null) {
      headers = {};
      const raw = this.rawHeaders;
      for (let i = 0; i < raw.length; i += 2) {
        FunctionPrototypeCall(addHeaderLine, this, raw[i], raw[i + 1], headers);
      }
      this[kHeaders] = headers;
    }
    return headers;
  },
  set(value) {
    this[kHeaders] = value;
  },
});

// Response.

function BatchedServerResponse(server, id, req) {
  this._events = undefined;
  this._eventsCount = 0;
  this._maxListeners = undefined;
  this[kServer] = server;
  this[kId] = id;
  // Flat [lowercased name, name, value] triples.
  this[kHeaderList] = [];
  this[kHeadSent] = false;
  this.req = req;
  this.statusCode = 200;
  this.statusMessage = undefined;
  this.sendDate = true;
  this.headersSent = false;
  this.writableEnded = false;
  this.writableFinished = false;
  this.destroyed = false;
}
ObjectSetPrototypeOf(BatchedServerResponse.prototype, EventEmitter.prototype);
ObjectSetPrototypeOf(BatchedServerResponse, EventEmitter);

function findHeader(list, key) {
  for (let i = 0; i < list.length; i += 3) {
    if (list[i] === key) return i;
  }
  return -1;
}

BatchedServerResponse.prototype.setHeader = function setHeader(name, value) {
  if (this.headersSent) throw new ERR_HTTP_HEADERS_SENT('set');
  validateHeaderName(name);
  validateHeaderValue(name, value);
  const list = this[kHeaderList];
  const key = StringPrototypeToLowerCase(name);
  const i = findHeader(list, key);
  if (i === -1) {
    list.push(key, name, value);
  } else {
    list[i + 1] = name;
    list[i + 2] = value;
  }
  return this;
};

BatchedServerResponse.prototype.appendHeader = function appendHeader(name,
                                                                     value) {
  if (this.headersSent) throw new ERR_HTTP_HEADERS_SENT('append');
  validateHeaderName(name);
  validateHeaderValue(name, value);
  const list = this[kHeaderList];
  const key = StringPrototypeToLowerCase(name);
  const i = findHeader(list, key);
  if (i === -1) {
    list.push(key, name, value);
  } else {
    const existing = list[i + 2];
    const values = ArrayIsArray(existing) ? existing : [existing];
    if (ArrayIsArray(value)) {
      for (let j = 0; j < value.length; j++) values.push(value[j]);
    } else {
      values.push(value);
    }
    list[i + 2] = values;
  }
  return this;
};

BatchedServerResponse.prototype.getHeader = function getHeader(name) {
  const list = this[kHeaderList];
  const i = findHeader(list, StringPrototypeToLowerCase(name));
  return i === -1 ? undefined : list[i + 2];
};

BatchedServerResponse.prototype.hasHeader = function hasHeader(name) {
  return findHeader(this[kHeaderList], StringPrototypeToLowerCase(name)) !== -1;
};

BatchedServerResponse.prototype.removeHeader = function removeHeader(name) {
  if (this.headersSent) throw new ERR_HTTP_HEADERS_SENT('remove');
  const list = this[kHeaderList];
  const i = findHeader(list, StringPrototypeToLowerCase(name));
  if (i !== -1) list.splice(i, 3);
};

BatchedServerResponse.prototype.getHeaderNames = function getHeaderNames() {
  const list = this[kHeaderList];
  const names = [];
  for (let i = 0; i < list.length; i += 3) names.push(list[i]);
  return names;
};

BatchedServerResponse.prototype.getHeaders = function getHeaders() {
  const list = this[kHeaderList];
  const headers = { __proto__: null };
  for (let i = 0; i < list.length; i += 3) headers[list[i]] = list[i + 2];
  return headers;
};

BatchedServerResponse.prototype.writeHead = function writeHead(statusCode,
                                                               reason,
                                                               obj) {
  if (this.headersSent) throw new ERR_HTTP_HEADERS_SENT('render');
  if (typeof reason !== 'string') {
    obj = reason;
    reason = undefined;
  }
  if (!NumberIsInteger(statusCode) || statusCode < 100 || statusCode > 999) {
    throw new ERR_HTTP_INVALID_STATUS_CODE(statusCode);
  }
  this.statusCode = statusCode;
  if (reason !== undefined) this.statusMessage = reason;
  if (obj != null) {
    if (ArrayIsArray(obj)) {
      for (let i = 0; i < obj.length; i += 2) {
        this.appendHeader(obj[i], obj[i + 1]);
      }
    } else {
      const keys = ObjectKeys(obj);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (k) this.setHeader(k, obj[k]);
      }
    }
  }
  this.headersSent = true;
  return this;
};

// Builds the status line and header block, and the flags telling native
// code which framing headers the user already set.
function renderHead(res) {
  const statusCode = res.statusCode;
  if (!NumberIsInteger(statusCode) || statusCode < 100 || statusCode > 999) {
    throw new ERR_HTTP_INVALID_STATUS_CODE(statusCode);
  }
  let head;
  const message = res.statusMessage;
  if (message === undefined) {
    head = statusLine(statusCode);
  } else {
    if (checkInvalidHeaderChar(message)) {
      throw new ERR_INVALID_CHAR('statusMessage');
    }
    head = `HTTP/1.1 ${statusCode} ${message}\r\n`;
  }
  let flags = res.sendDate ? 0 : kUserDate;
  const list = res[kHeaderList];
  for (let i = 0; i < list.length; i += 3) {
    const key = list[i];
    const name = list[i + 1];
    const value = list[i + 2];
    switch (key.length) {
      case 4:
        if (key === 'date') flags |= kUserDate;
        break;
      case 10:
        if (key === 'connection') {
          flags |= kUserConnection;
          if (RegExpPrototypeExec(RE_CONN_CLOSE, value) !== null) {
            flags |= kUserConnectionClose;
          }
        }
        break;
      case 14:
        if (key === 'content-length') flags |= kUserContentLength;
        break;
      case 17:
        if (key === 'transfer-encoding') flags |= kUserTransferEncoding;
        break;
    }
    if (ArrayIsArray(value)) {
      for (let j = 0; j < value.length; j++) {
        head += `${name}: ${value[j]}\r\n`;
      }
    } else {
      head += `${name}: ${value}\r\n`;
    }
  }
  res[kHeadSent] = true;
  res.headersSent = true;
  return { head, flags };
}

function toBody(chunk, encoding) {
  if (chunk == null) return null;
  if (typeof chunk === 'string') {
    if (encoding === undefined || encoding === 'utf8' || encoding === 'utf-8') {
      return chunk;
    }
    return Buffer.from(chunk, encoding);
  }
  return chunk;
}

BatchedServerResponse.prototype.flushHeaders = function flushHeaders() {
  if (this[kHeadSent] || this.writableEnded) return;
  const { head, flags } = renderHead(this);
  this[kServer][kWriteRecord](kOpHead, flags, this.statusCode, this[kId],
                              head, null);
};

BatchedServerResponse.prototype.write = function write(chunk, encoding, cb) {
  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = undefined;
  }
  if (this.writableEnded) {
    const err = new ERR_STREAM_WRITE_AFTER_END();
    process.nextTick(emitWriteError, this, err, cb);
    return false;
  }
  if (!this[kHeadSent]) this.flushHeaders();
  const body = toBody(chunk, encoding);
  if (body !== null && body.length > 0 && !this.destroyed) {
    this[kServer][kWriteRecord](kOpData, 0, 0, this[kId], null, body);
  }
  if (typeof cb === 'function') process.nextTick(cb);
  return true;
};

function emitWriteError(res, err, cb) {
  if (typeof cb === 'function') cb(err);
  res.emit('error', err);
}

BatchedServerResponse.prototype.end = function end(chunk, encoding, cb) {
  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = undefined;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = undefined;
  }
  if (this.writableEnded || this.destroyed) {
    this.writableEnded = true;
    if (typeof cb === 'function') process.nextTick(cb);
    return this;
  }
  const server = this[kServer];
  const id = this[kId];
  const body = toBody(chunk, encoding);
  if (!this[kHeadSent]) {
    const { head, flags } = renderHead(this);
    this.writableEnded = true;
    server[kWriteRecord](kOpComplete, flags, this.statusCode, id, head, body);
  } else {
    this.writableEnded = true;
    if (body !== null && body.length > 0) {
      server[kWriteRecord](kOpData, 0, 0, id, null, body);
    }
    server[kWriteRecord](kOpEnd, 0, 0, id, null, null);
  }
  server[kRequests].delete(id);
  this.writableFinished = true;
  if (typeof cb === 'function' || this._events !== undefined ||
      this.req._events !== undefined) {
    process.nextTick(emitFinish, this, cb);
  }
  return this;
};

function emitFinish(res, cb) {
  res.emit('finish');
  if (typeof cb === 'function') cb();
  res.emit('close');
  res.req.emit('close');
}

BatchedServerResponse.prototype.destroy = function destroy(err) {
  if (this.destroyed) return this;
  this.destroyed = true;
  const server = this[kServer];
  if (!this.writableEnded) {
    server[kWriteRecord](kOpDestroy, 0, 0, this[kId], null, null);
    server[kRequests].delete(this[kId]);
  }
  process.nextTick(emitDestroy, this, err);
  return this;
};

function emitDestroy(res, err) {
  if (err) res.emit('error', err);
  res.emit('close');
}

// Server.

const kWriteRecord = Symbol('kWriteRecord');
const kOnBatch = Symbol('kOnBatch');
const kOnClose = Symbol('kOnClose');
const kFlush = Symbol('kFlush');
const kParseHeads = Symbol('kParseHeads');
const kParseBodies = Symbol('kParseBodies');
const kStartRequest = Symbol('kStartRequest');
const kHandlerError = Symbol('kHandlerError');

class BatchedServer extends EventEmitter {
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
    }
    this[kHandler] = requestListener;
    this[kRequests] = new SafeMap();
    this[kOut] = Buffer.allocUnsafeSlow(kInitialOutSize);
    this[kOutLength] = 0;
    this[kDispatching] = false;
    this[kFlushScheduled] = false;
    this[kShared] = Buffer.allocUnsafeSlow(
      options.requestHeadsBufferSize ?? 128 * 1024);
    this[kHandle] = null;
    this[kTimeouts] = {
      keepAliveTimeout: options.keepAliveTimeout ?? 5000,
      headersTimeout: options.headersTimeout ?? 60000,
      maxHeaderSize: options.maxHeaderSize ?? 0,
    };
    this._connectionKey = null;
    this.listening = false;
  }

  get keepAliveTimeout() { return this[kTimeouts].keepAliveTimeout; }
  set keepAliveTimeout(ms) {
    this[kTimeouts].keepAliveTimeout = ms;
    this[kHandle]?.setTimeouts(ms, this[kTimeouts].headersTimeout,
                               this[kTimeouts].maxHeaderSize);
  }

  get headersTimeout() { return this[kTimeouts].headersTimeout; }
  set headersTimeout(ms) {
    this[kTimeouts].headersTimeout = ms;
    this[kHandle]?.setTimeouts(this[kTimeouts].keepAliveTimeout, ms,
                               this[kTimeouts].maxHeaderSize);
  }

  // listen([port[, host[, backlog]]][, callback]) or listen(options[, cb])
  listen(...args) {
    if (this.listening) throw new ERR_SERVER_ALREADY_LISTEN();
    let cb = args[args.length - 1];
    if (typeof cb === 'function') {
      args.length--;
    } else {
      cb = undefined;
    }
    let options;
    if (args[0] !== null && typeof args[0] === 'object') {
      options = args[0];
    } else {
      options = { port: args[0], host: args[1], backlog: args[2] };
    }
    const port = options.port === undefined ? 0 :
      validatePort(options.port, 'options.port');
    const backlog = options.backlog ?? 511;
    let flags = 0;
    if (options.ipv6Only) flags |= kListenIPv6Only;
    if (options.reusePort) flags |= kListenReusePort;
    if (cb !== undefined) this.once('listening', cb);

    const host = options.host;
    if (host == null) {
      // Same default as net: dual stack when available.
      process.nextTick(() => {
        if (this.#bind('::', port, backlog, flags, true)) return;
        this.#bind('0.0.0.0', port, backlog, flags, false);
      });
    } else if (isIP(host) !== 0) {
      process.nextTick(() => this.#bind(host, port, backlog, flags, false));
    } else {
      dns.lookup(host, (err, address) => {
        if (err) {
          this.emit('error', err);
          return;
        }
        this.#bind(address, port, backlog, flags, false);
      });
    }
    return this;
  }

  #bind(host, port, backlog, flags, quiet) {
    const handle = new BatchServerBinding(
      (headsLength, heads, bodies) =>
        this[kOnBatch](headsLength, heads, bodies),
      () => {
        // A handle that failed to bind closes without the server.
        if (this[kHandle] === handle) this[kOnClose]();
      },
      this[kShared]);
    const t = this[kTimeouts];
    handle.setTimeouts(t.keepAliveTimeout, t.headersTimeout, t.maxHeaderSize);
    const err = handle.listen(host, port, backlog, flags);
    if (err !== 0) {
      handle.close();
      if (quiet) return false;
      this.emit('error', new ExceptionWithHostPort(err, 'listen', host, port));
      return false;
    }
    this[kHandle] = handle;
    this.listening = true;
    this.emit('listening');
    return true;
  }

  address() {
    const handle = this[kHandle];
    if (handle === null) return null;
    const out = {};
    const err = handle.getsockname(out);
    return err === 0 ? out : null;
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
      this[kFlush]();
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

  ref() {
    this[kHandle]?.ref();
    return this;
  }

  unref() {
    this[kHandle]?.unref();
    return this;
  }

  [kOnClose]() {
    this[kRequests].clear();
    this.emit('close');
  }

  [kOnBatch](headsLength, heads, bodies) {
    this[kDispatching] = true;
    try {
      if (heads !== null) {
        this[kParseHeads](heads, heads.length);
      } else if (headsLength > 0) {
        this[kParseHeads](this[kShared], headsLength);
      }
      if (bodies !== null) this[kParseBodies](bodies);
    } finally {
      this[kDispatching] = false;
    }
    this[kFlush]();
  }

  [kParseHeads](buf, length) {
    let o = 0;
    while (o < length) {
      const id = readU32(buf, o);
      const flags = buf[o + 4];
      const method = methods[buf[o + 5]];
      const major = buf[o + 6];
      const minor = buf[o + 7];
      const urlLength = readU32(buf, o + 8);
      const count = buf[o + 12] | (buf[o + 13] << 8);
      o += kRecordPrefix;
      const url = latin1Slice(buf, o, o + urlLength);
      o += urlLength;
      const raw = new Array(count * 2);
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
      this[kStartRequest](id, flags, method, url, raw, major, minor);
    }
  }

  [kStartRequest](id, flags, method, url, raw, major, minor) {
    const req = new BatchedIncomingMessage(this, id, method, url, raw,
                                           major, minor);
    const res = new BatchedServerResponse(this, id, req);
    req[kResponse] = res;
    try {
      const handler = this[kHandler];
      if (handler !== undefined) {
        const ret = handler(req, res);
        if (ret != null && typeof ret.then === 'function') {
          ret.then(undefined, (err) => this[kHandlerError](res, err));
        }
      }
      if (this._events.request !== undefined) this.emit('request', req, res);
      if ((flags & kHasBody) === 0) {
        req.complete = true;
        if (req._events !== undefined) req.emit('end');
      }
    } catch (err) {
      this[kHandlerError](res, err);
    }
    // Once the response is done native code drops the rest of the request
    // body, so the request never needs to be found again.
    if (!res.writableEnded && !res.destroyed) this[kRequests].set(id, req);
  }

  [kParseBodies](buf) {
    const requests = this[kRequests];
    const length = buf.length;
    let o = 0;
    while (o < length) {
      const id = readU32(buf, o);
      const len = readU32(buf, o + 4);
      o += 8;
      const req = requests.get(id);
      if (len === 0) {
        if (req !== undefined) {
          if (req[kResponse].writableEnded) requests.delete(id);
          req.complete = true;
          try {
            req.emit('end');
          } catch (err) {
            this[kHandlerError](req[kResponse], err);
          }
        }
      } else if (len === kBodyAbort) {
        if (req !== undefined) {
          requests.delete(id);
          const res = req[kResponse];
          req.aborted = true;
          res.destroyed = true;
          try {
            req.emit('aborted');
            req.emit('close');
            res.emit('close');
          } catch (err) {
            process.nextTick(() => { throw err; });
          }
        }
      } else {
        if (req !== undefined && !req[kResponse].writableEnded) {
          try {
            req.emit('data', buf.subarray(o, o + len));
          } catch (err) {
            this[kHandlerError](req[kResponse], err);
          }
        }
        o += len;
      }
    }
  }

  [kHandlerError](res, err) {
    if (!res.writableEnded && !res.destroyed) {
      if (!res.headersSent) {
        res[kHeaderList] = [];
        res.statusCode = 500;
        res.statusMessage = undefined;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');
      } else {
        res.destroy();
      }
    }
    if (this._events.error !== undefined) this.emit('error', err);
  }

  [kWriteRecord](op, flags, status, id, head, body) {
    const headLength = head === null ? 0 : head.length;
    let bodyMax = 0;
    if (body !== null) {
      bodyMax = typeof body === 'string' ? body.length * 3 : body.byteLength;
    }
    let buf = this[kOut];
    let o = this[kOutLength];
    const needed = o + kRecordPrefix + headLength + bodyMax + 3;
    if (needed > buf.length) {
      const grown = Buffer.allocUnsafeSlow(MathMax(buf.length * 2, needed));
      buf.copy(grown, 0, 0, o);
      buf = this[kOut] = grown;
    }
    buf[o] = op;
    buf[o + 1] = flags;
    buf[o + 2] = status & 0xff;
    buf[o + 3] = status >>> 8;
    buf[o + 4] = id & 0xff;
    buf[o + 5] = (id >>> 8) & 0xff;
    buf[o + 6] = (id >>> 16) & 0xff;
    buf[o + 7] = id >>> 24;
    let p = o + kRecordPrefix;
    if (headLength !== 0) p += latin1Write(buf, head, p, headLength);
    let bodyLength = 0;
    if (body !== null) {
      if (typeof body === 'string') {
        bodyLength = utf8Write(buf, body, p, bodyMax);
      } else {
        buf.set(body, p);
        bodyLength = body.byteLength;
      }
    }
    buf[o + 8] = headLength & 0xff;
    buf[o + 9] = (headLength >>> 8) & 0xff;
    buf[o + 10] = (headLength >>> 16) & 0xff;
    buf[o + 11] = headLength >>> 24;
    buf[o + 12] = bodyLength & 0xff;
    buf[o + 13] = (bodyLength >>> 8) & 0xff;
    buf[o + 14] = (bodyLength >>> 16) & 0xff;
    buf[o + 15] = bodyLength >>> 24;
    o = (p + bodyLength + 3) & ~3;
    this[kOutLength] = o;
    if (o >= kEagerFlushSize) {
      this[kFlush]();
    } else if (!this[kDispatching] && !this[kFlushScheduled]) {
      this[kFlushScheduled] = true;
      setImmediate(flushImmediate, this);
    }
  }

  [kFlush]() {
    const length = this[kOutLength];
    if (length === 0) return;
    this[kOutLength] = 0;
    const handle = this[kHandle];
    if (handle !== null) handle.writeResponses(this[kOut], length);
    if (this[kOut].length > kEagerFlushSize) {
      this[kOut] = Buffer.allocUnsafeSlow(kInitialOutSize);
    }
  }
}

function flushImmediate(server) {
  server[kFlushScheduled] = false;
  server[kFlush]();
}

function createBatchedServer(options, requestListener) {
  return new BatchedServer(options, requestListener);
}

module.exports = {
  BatchedServer,
  BatchedIncomingMessage,
  BatchedServerResponse,
  createBatchedServer,
};
