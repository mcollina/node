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
  ArrayPrototypePush,
  FunctionPrototypeCall,
  MathMax,
  NumberIsFinite,
  NumberIsInteger,
  ObjectDefineProperty,
  ObjectKeys,
  ObjectSetPrototypeOf,
  RegExpPrototypeExec,
  SafeMap,
  StringPrototypeToLowerCase,
  Symbol,
  SymbolDispose,
} = primordials;

const EventEmitter = require('events');
const {
  defaultTriggerAsyncIdScope,
  symbols: { async_id_symbol },
} = require('internal/async_hooks');
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
    ERR_INVALID_ARG_VALUE,
    ERR_INVALID_CHAR,
    ERR_SERVER_ALREADY_LISTEN,
    ERR_SERVER_NOT_RUNNING,
    ERR_STREAM_WRITE_AFTER_END,
  },
} = require('internal/errors');
const {
  validateFunction,
  validateAbortSignal,
  validateObject,
  validatePort,
  validateString,
} = require('internal/validators');
const { isIP } = require('internal/net');
const { isWindows } = require('internal/util');
const dns = require('dns');
const { addAbortListener } = require('internal/events/abort_listener');
const { UV_EADDRINUSE } = internalBinding('uv');
let cluster;
const { setImmediate } = require('timers');

const kHasBody = 1;
const kUpgrade = 2;
const kKeepAlive = 4;
const kExpectContinue = 8;
const kHasExpect = 16;

const kOpHead = 1;
const kOpData = 2;
const kOpEnd = 3;
const kOpComplete = 4;
const kOpDestroy = 5;
const kOpRaw = 6;
const kOpShutdown = 7;
const kOpConnectionRaw = 8;

const kUserContentLength = 1 << 0;
const kUserTransferEncoding = 1 << 1;
const kUserDate = 1 << 2;
const kUserConnection = 1 << 3;
const kUserConnectionClose = 1 << 4;

const kListenIPv6Only = 1 << 0;
const kListenReusePort = 1 << 1;
const kListenReadableAll = 1 << 2;
const kListenWritableAll = 1 << 3;

const kBodyAbort = 0xFFFFFFFF;
const kConnectionClosed = 0xFFFFFFFE;
const kTrailers = 0xFFFFFFFD;
const kDrain = 0xFFFFFFFC;
const kTimeout = 0xFFFFFFFB;
const kConnectionOpen = 0xFFFFFFFA;
const kClientError = 0xFFFFFFF9;
const kRawData = 0xFFFFFFF8;
const kRawEnd = 0xFFFFFFF7;
const kServername = 0xFFFFFFF6;
const kKeylog = 0xFFFFFFF5;
const kTlsError = 0xFFFFFFF4;
const kDrop = 0xFFFFFFF3;
const kSecureConnection = 0xFFFFFFF2;
// The lowest marker; lengths from here up are not data.
const kFirstMarker = kSecureConnection;
// Markers followed by u32 length and a payload.
function hasPayload(marker) {
  return marker === kTrailers || marker === kClientError ||
    marker === kRawData || marker === kServername || marker === kKeylog ||
    marker === kTlsError || marker === kDrop;
}
const kKnownHeader = 0x8000;

const kHeadPrefix = 20;
const kRecordPrefix = 16;
const kInitialOutSize = 64 * 1024;
// Responses bigger than this are written right away instead of waiting for
// the end of the batch, which bounds the size of the output buffer.
const kEagerFlushSize = 1024 * 1024;
// Bodies from this size on are written from their own memory rather than
// copied into the batch.
const kExternalBodySize = 16 * 1024;
const kOpExternalBody = 0x80;
const kOpLatin1Body = 0x40;

const kId = Symbol('kId');
const kServer = Symbol('kServer');
const kHeaders = Symbol('kHeaders');
const kHeaderList = Symbol('kHeaderList');
const kHeadSent = Symbol('kHeadSent');
const kResponse = Symbol('kResponse');
const kHandle = Symbol('kHandle');
const kRequests = Symbol('kRequests');
const kBatch = Symbol('kBatch');
const kShared = Symbol('kShared');
const kHandler = Symbol('kHandler');
const kTimeouts = Symbol('kTimeouts');
const kUnref = Symbol('kUnref');
const kSecureContext = Symbol('kSecureContext');
const kConfigureHandle = Symbol('kConfigureHandle');
const kClusterHandle = Symbol('kClusterHandle');

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
const kParseHeads = Symbol('kParseHeads');
const kParseBodies = Symbol('kParseBodies');
const kStartRequest = Symbol('kStartRequest');
const kHandlerError = Symbol('kHandlerError');
const kAfterFlush = Symbol('kAfterFlush');

// Collects the response records produced while JavaScript runs, and hands
// them to native code in one writeResponses() call: at the end of a batch,
// or from setImmediate() for responses produced outside of one.
class ResponseBatch {
  constructor() {
    this.handle = null;
    this.dispatching = false;
    // Incremented by every flush, so writers can tell their bytes left.
    this.generation = 0;
    this.out = Buffer.allocUnsafeSlow(kInitialOutSize);
    this.length = 0;
    this.flushScheduled = false;
    // Large bodies, written by native code from their own memory.
    this.externals = [];
    this.externalLength = 0;
    // Sockets whose write callbacks wait for this flush.
    this.waiting = [];
  }

  // socket[kAfterFlush](handle) runs after the next flush.
  waitForFlush(socket) {
    ArrayPrototypePush(this.waiting, socket);
    if (!this.dispatching && !this.flushScheduled) {
      this.flushScheduled = true;
      setImmediate(flushImmediate, this);
    }
  }

  #checkWaiting(handle) {
    const waiting = this.waiting;
    this.waiting = [];
    for (let i = 0; i < waiting.length; i++) waiting[i][kAfterFlush](handle);
  }

  // `head` is latin1. A string `body` is UTF-8, or latin1 when
  // `latin1Body` is true. Returns true when native code keeps a reference
  // to `body`, whose bytes must not change until they are written.
  record(op, flags, status, id, head, body, latin1Body) {
    const headLength = head === null ? 0 : head.length;
    let bodyMax = 0;
    let held = false;
    if (body !== null) {
      if (typeof body !== 'string') {
        bodyMax = body.byteLength;
        held = bodyMax >= kExternalBodySize && !isResizableView(body);
      } else if (body.length >= kExternalBodySize) {
        // Native code encodes it once, where it is written from.
        op |= kOpExternalBody | (latin1Body ? kOpLatin1Body : 0);
      } else {
        bodyMax = latin1Body ? body.length : body.length * 3;
      }
      if (held) op |= kOpExternalBody;
    }
    const external = (op & kOpExternalBody) !== 0;
    let buf = this.out;
    let o = this.length;
    const needed = o + kRecordPrefix + headLength +
      (external ? 4 : bodyMax) + 3;
    if (needed > buf.length) {
      const grown = Buffer.allocUnsafeSlow(MathMax(buf.length * 2, needed));
      buf.copy(grown, 0, 0, o);
      buf = this.out = grown;
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
    let recordLength = 0;
    if (external) {
      // The body bytes of the record are the index of the body.
      const index = this.externals.length;
      ArrayPrototypePush(this.externals, body);
      // Native code measures strings.
      if (typeof body === 'string') {
        this.externalLength += body.length;
      } else {
        bodyLength = body.byteLength;
        this.externalLength += bodyLength;
      }
      buf[p] = index & 0xff;
      buf[p + 1] = (index >>> 8) & 0xff;
      buf[p + 2] = (index >>> 16) & 0xff;
      buf[p + 3] = index >>> 24;
      recordLength = 4;
    } else if (body !== null) {
      if (typeof body !== 'string') {
        buf.set(body, p);
        bodyLength = body.byteLength;
      } else if (latin1Body) {
        bodyLength = latin1Write(buf, body, p, bodyMax);
      } else {
        bodyLength = utf8Write(buf, body, p, bodyMax);
      }
      recordLength = bodyLength;
    }
    buf[o + 8] = headLength & 0xff;
    buf[o + 9] = (headLength >>> 8) & 0xff;
    buf[o + 10] = (headLength >>> 16) & 0xff;
    buf[o + 11] = headLength >>> 24;
    buf[o + 12] = bodyLength & 0xff;
    buf[o + 13] = (bodyLength >>> 8) & 0xff;
    buf[o + 14] = (bodyLength >>> 16) & 0xff;
    buf[o + 15] = bodyLength >>> 24;
    o = (p + recordLength + 3) & ~3;
    this.length = o;
    if (o + this.externalLength >= kEagerFlushSize) {
      this.flush();
    } else if (!this.dispatching && !this.flushScheduled) {
      this.flushScheduled = true;
      setImmediate(flushImmediate, this);
    }
    return held;
  }

  flush() {
    const length = this.length;
    if (length === 0) {
      if (this.waiting.length !== 0) this.#checkWaiting(this.handle);
      return;
    }
    this.length = 0;
    this.generation++;
    const externals = this.externals;
    if (externals.length !== 0) {
      this.externals = [];
      this.externalLength = 0;
    }
    const handle = this.handle;
    if (handle !== null) handle.writeResponses(this.out, length, externals);
    if (this.waiting.length !== 0) this.#checkWaiting(handle);
    if (this.out.length > kEagerFlushSize) {
      this.out = Buffer.allocUnsafeSlow(kInitialOutSize);
    }
  }
}

// Memory that can shrink under native code cannot be written from.
function isResizableView(view) {
  const buffer = view.buffer;
  return buffer.resizable === true || buffer.growable === true;
}

function flushImmediate(batch) {
  batch.flushScheduled = false;
  batch.flush();
}

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
    this[kBatch] = new ResponseBatch();
    this[kShared] = Buffer.allocUnsafeSlow(
      options.requestHeadsBufferSize ?? 128 * 1024);
    this[kHandle] = null;
    this[kTimeouts] = {
      keepAliveTimeout: options.keepAliveTimeout ?? 5000,
      headersTimeout: options.headersTimeout ?? 60000,
      maxHeaderSize: options.maxHeaderSize ?? 0,
      requestTimeout: 0,
      connectionsCheckingInterval: 1000,
      timeout: 0,
      handshakeTimeout: 0,
    };
    this._connectionKey = null;
    this.listening = false;
  }

  get keepAliveTimeout() { return this[kTimeouts].keepAliveTimeout; }
  set keepAliveTimeout(ms) {
    this[kTimeouts].keepAliveTimeout = ms;
    if (this[kHandle] !== null) applyTimeouts(this, this[kHandle]);
  }

  get headersTimeout() { return this[kTimeouts].headersTimeout; }
  set headersTimeout(ms) {
    this[kTimeouts].headersTimeout = ms;
    if (this[kHandle] !== null) applyTimeouts(this, this[kHandle]);
  }

  // listen([port[, host[, backlog]]][, callback]) or listen(options[, cb])
  listen(...args) {
    return listenBatched(this, args);
  }

  address() {
    return addressBatched(this);
  }

  [kConfigureHandle](handle) {
    handle.configure(0, 0, -1, 0);
    applyTimeouts(this, handle);
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

  ref() {
    this[kUnref] = false;
    this[kHandle]?.ref();
    return this;
  }

  unref() {
    this[kUnref] = true;
    this[kHandle]?.unref();
    return this;
  }

  [kOnClose]() {
    this[kRequests].clear();
    this.emit('close');
  }

  [kOnBatch](headsLength, heads, bodies) {
    const batch = this[kBatch];
    batch.dispatching = true;
    try {
      if (heads !== null) {
        this[kParseHeads](heads, heads.length);
      } else if (headsLength > 0) {
        this[kParseHeads](this[kShared], headsLength);
      }
      if (bodies !== null) this[kParseBodies](bodies);
    } finally {
      batch.dispatching = false;
    }
    batch.flush();
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
      o += kHeadPrefix;
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
      if (len !== kBodyAbort && len >= kFirstMarker) {
        // Not used by this API.
        if (hasPayload(len)) o += 4 + readU32(buf, o);
        continue;
      }
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
    this[kBatch].record(op, flags, status, id, head, body, false);
  }
}


// listen() for servers built on the http_batch binding, with the argument
// forms of net.Server#listen(). The server keeps its binding in
// server[kHandle], configures new bindings in server[kConfigureHandle] and
// receives batches through server[kOnBatch].
function listenBatched(server, args) {
  if (server.listening) throw new ERR_SERVER_ALREADY_LISTEN();
  let cb = args[args.length - 1];
  if (typeof cb === 'function') {
    args.length--;
  } else {
    cb = undefined;
  }
  let options;
  if (args[0] !== null && typeof args[0] === 'object') {
    options = args[0];
  } else if (typeof args[0] === 'string' &&
             RegExpPrototypeExec(/^\d+$/, args[0]) === null) {
    options = { path: args[0], backlog: args[1] };
  } else {
    options = { port: args[0], host: args[1], backlog: args[2] };
  }
  if (cb !== undefined) server.once('listening', cb);
  const backlog = options.backlog ?? 511;

  const signal = options.signal;
  if (signal !== undefined) {
    validateAbortSignal(signal, 'options.signal');
    if (signal.aborted) {
      process.nextTick(() => server.close());
      return server;
    }
    const disposable = addAbortListener(signal, () => server.close());
    server.once('close', () => disposable[SymbolDispose]());
  }

  // An existing listening handle or descriptor.
  const handleOrFd = options.handle ?? options._handle;
  let fd = options.fd;
  if (handleOrFd != null) fd = handleOrFd.fd ?? handleOrFd._handle?.fd;
  if (handleOrFd != null || fd != null) {
    if (!NumberIsInteger(fd) || fd < 0) {
      throw new ERR_INVALID_ARG_VALUE('options', options,
                                      'must have a descriptor to listen on');
    }
    // A handle is taken over, like net.Server does.
    const owned = handleOrFd != null;
    if (bindBatched(server, (handle) => handle.listenFd(fd, backlog, owned),
                    'listen', fd, undefined) && owned) {
      (handleOrFd._handle ?? handleOrFd).close?.();
    }
    return server;
  }

  if (options.path != null) {
    validateString(options.path, 'options.path');
    let flags = 0;
    if (options.readableAll) flags |= kListenReadableAll;
    if (options.writableAll) flags |= kListenWritableAll;
    listenMaybeCluster(server, options, -1, backlog, options.path,
                       (handle) => handle.listenPipe(options.path, backlog,
                                                     flags));
    return server;
  }

  const port = options.port == null ? 0 :
    validatePort(options.port, 'options.port');
  let flags = 0;
  if (options.ipv6Only) flags |= kListenIPv6Only;
  if (options.reusePort) flags |= kListenReusePort;

  // Like net, IP addresses are bound synchronously so address() works right
  // after listen(); 'listening' and errors are emitted asynchronously.
  const host = options.host;
  const bindTo = (address, quiet) => listenMaybeCluster(
    server, options, port, backlog, address,
    (handle) => handle.listen(address, port, backlog, flags), quiet);
  if (host == null) {
    // Same default as net: dual stack when available.
    if (!bindTo('::', true)) bindTo('0.0.0.0', false);
  } else if (isIP(host) !== 0) {
    bindTo(host, false);
  } else {
    dns.lookup(host, (err, address) => {
      if (err) {
        server.emit('error', err);
        return;
      }
      bindTo(address, false);
    });
  }
  return server;
}

// In a cluster worker, net servers share the primary's listening socket.
// Batched servers do the same through cluster._getServer(): the connections
// it hands over, accepted by the primary (round robin) or by this worker
// (shared handle), are adopted by the binding.
function listenMaybeCluster(server, options, port, backlog, address, listen,
                            quiet = false) {
  if (cluster === undefined) cluster = require('cluster');
  if (cluster.isPrimary || options.exclusive || isWindows) {
    return bindBatched(server, listen, 'listen', address, port, quiet);
  }
  const isPipe = port === -1;
  const query = {
    address: isPipe ? null : address,
    port: isPipe ? -1 : port,
    addressType: isPipe ? -1 : isIP(address),
    fd: isPipe ? undefined : -1,
    flags: 0,
    backlog,
    ...options,
  };
  if (isPipe) query.address = address;
  cluster._getServer(server, query, (err, clusterHandle) => {
    if (err === 0 && typeof clusterHandle?.listen !== 'function') {
      err = UV_EADDRINUSE;
    }
    if (err) {
      server.emit('error',
                  new ExceptionWithHostPort(err, 'bind', address, port));
      return;
    }
    bindBatched(server, (handle) => {
      clusterHandle.onconnection = (err, clientHandle) => {
        if (err || clientHandle == null) return;
        const fd = clientHandle.fd;
        if (NumberIsInteger(fd) && fd >= 0) handle.adopt(fd);
        clientHandle.close();
      };
      server[kClusterHandle] = clusterHandle;
      return clusterHandle.listen(backlog);
    }, 'listen', address, port);
  });
  return true;
}

// Like node:http, a timeout that is not a finite non-negative number
// disables the corresponding check.
function timeoutValue(value) {
  return NumberIsFinite(value) && value >= 0 ? value : 0;
}

function applyTimeouts(server, handle) {
  const t = server[kTimeouts];
  handle.setTimeouts(timeoutValue(t.keepAliveTimeout),
                     timeoutValue(t.headersTimeout),
                     timeoutValue(t.maxHeaderSize),
                     timeoutValue(t.requestTimeout),
                     timeoutValue(t.connectionsCheckingInterval),
                     timeoutValue(t.timeout),
                     timeoutValue(t.handshakeTimeout));
}

function createHandle(server) {
  const handle = new BatchServerBinding(
    (headsLength, heads, bodies) =>
      server[kOnBatch](headsLength, heads, bodies),
    () => {
      // A handle that failed to bind closes without the server.
      if (server[kHandle] === handle) server[kOnClose]();
    },
    server[kShared]);
  server[kConfigureHandle](handle);
  return handle;
}

function bindBatched(server, listen, syscall, address, port, quiet = false) {
  const handle = createHandle(server);
  const err = listen(handle);
  if (err !== 0) {
    handle.close();
    if (quiet) return false;
    process.nextTick(emitListenError, server,
                     new ExceptionWithHostPort(err, syscall, address, port));
    return false;
  }
  if (server[kUnref] === true) handle.unref();
  server[kHandle] = handle;
  server[kBatch].handle = handle;
  server.listening = true;
  server[async_id_symbol] = handle.getAsyncId();
  // As in net, what 'listening' starts is triggered by the server.
  defaultTriggerAsyncIdScope(server[async_id_symbol], process.nextTick,
                             emitListening, server);
  return true;
}

function emitListening(server) {
  if (server.listening) server.emit('listening');
}

function emitListenError(server, err) {
  server.emit('error', err);
}

// address() for servers built on the http_batch binding.
function addressBatched(server) {
  const clusterHandle = server[kClusterHandle];
  if (clusterHandle != null) {
    const out = {};
    return clusterHandle.getsockname?.(out) === 0 ? out : null;
  }
  const handle = server[kHandle];
  if (handle === null || !server.listening) return null;
  const out = {};
  const ret = handle.getsockname(out);
  if (typeof ret === 'string') return ret;
  return ret === 0 ? out : null;
}

function createBatchedServer(options, requestListener) {
  return new BatchedServer(options, requestListener);
}

module.exports = {
  ResponseBatch,
  listenBatched,
  addressBatched,
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
    kSecureContext,
    kConfigureHandle,
    kClusterHandle,
    kAfterFlush,
  },
  constants: {
    kHasBody,
    kUpgrade,
    kKeepAlive,
    kHeadPrefix,
    kBodyAbort,
    kConnectionClosed,
    kTrailers,
    kDrain,
    kTimeout,
    kConnectionOpen,
    kClientError,
    kRawData,
    kRawEnd,
    kServername,
    kKeylog,
    kTlsError,
    kDrop,
    kSecureConnection,
    kFirstMarker,
    kExpectContinue,
    kHasExpect,
    kOpConnectionRaw,
    kKnownHeader,
    kOpEnd,
    kOpRaw,
    kOpShutdown,
    kUserConnectionClose,
  },
  BatchedServer,
  BatchedIncomingMessage,
  BatchedServerResponse,
  createBatchedServer,
};
