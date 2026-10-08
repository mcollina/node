'use strict';

// http.createServer({ batched: true }) and https.createServer({ batched:
// true }): the node:http request and response classes on top of the
// http_batch transport (src/node_http_batch.cc). Native code owns the
// sockets, TLS and the parser, and delivers every request parsed during one
// event loop iteration in one call. ServerResponse frames its own output,
// which goes back as raw bytes in one call per batch.
//
// Every connection gets a BatchedSocket, a stand-in for net.Socket (or
// tls.TLSSocket). Upgrade and CONNECT requests take the connection out of
// HTTP processing: listeners get a real net.Socket for the same descriptor
// when it can be handed over, or a BatchedUpgradeSocket stream fed by the
// transport otherwise (TLS, Windows, upgrade requests with a body).

const {
  Array,
  ArrayPrototypeIndexOf,
  ArrayPrototypePush,
  ArrayPrototypeShift,
  Error,
  FunctionPrototypeCall,
  ObjectDefineProperty,
  ObjectGetOwnPropertyDescriptors,
  ObjectSetPrototypeOf,
  Promise,
  ReflectOwnKeys,
  RegExpPrototypeExec,
  SafeMap,
  StringPrototypeReplaceAll,
  StringPrototypeSlice,
  StringPrototypeSplit,
  StringPrototypeToLowerCase,
  Symbol,
  SymbolAsyncDispose,
} = primordials;

const EventEmitter = require('events');
const net = require('net');
const { Duplex } = require('stream');
const { Buffer } = require('buffer');
const { latin1Slice } = internalBinding('buffer');
const { triggerUncaughtException } = internalBinding('errors');
const {
  kDetachAbortSignal,
  getRawHeader,
  readStart,
} = require('_http_incoming');
const {
  continueExpression,
  calculateLenientFlags,
  kIncomingMessage,
} = require('_http_common');
const {
  Server: HttpServer,
  STATUS_CODES,
  storeHTTPOptions,
  setupConnectionsTracking,
  httpServerPreClose,
  _connectionListener: classicConnectionListener,
  kServerResponse,
} = require('_http_server');
const {
  kUniqueHeaders,
  parseUniqueHeadersOption,
} = require('_http_outgoing');
const { kNeedDrain } = require('internal/http');
const { getDefaultHighWaterMark } = require('internal/streams/state');
const {
  ConnResetException,
  codes: {
    ERR_HTTP_REQUEST_TIMEOUT,
    ERR_HTTP_SOCKET_ENCODING,
    ERR_SERVER_NOT_RUNNING,
    ERR_TLS_ALPN_CALLBACK_INVALID_RESULT,
    ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS,
    ERR_TLS_HANDSHAKE_TIMEOUT,
    ERR_TLS_SESSION_ATTACK,
  },
} = require('internal/errors');
const {
  validateFunction,
  validateNumber,
  validateObject,
} = require('internal/validators');
const dc = require('diagnostics_channel');
const {
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
    kConfigureHandle,
    kClusterHandle,
  },
  constants: {
    kHasBody,
    kUpgrade,
    kKeepAlive,
    kHasExpect,
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
    kKnownHeader,
    kOpEnd,
    kOpRaw,
    kOpShutdown,
    kOpConnectionRaw,
    kUserConnectionClose,
  },
} = require('internal/http/batched');

const onRequestStartChannel = dc.channel('http.server.request.start');
const onResponseFinishChannel = dc.channel('http.server.response.finish');

// configure() flags, see ServerFlags in node_http_batch.cc.
const kDelegateContinue = 1 << 0;
const kDelegateErrors = 1 << 1;
const kForwardBodyAfterResponse = 1 << 2;
const kAnnounceConnections = 1 << 3;
const kNoDelay = 1 << 4;
const kTcpKeepAlive = 1 << 5;
const kAnnounceSecure = 1 << 6;

const kConnectionId = Symbol('kConnectionId');
const kRequestId = Symbol('kRequestId');
const kRemote = Symbol('kRemote');
const kLocal = Symbol('kLocal');
const kReadPaused = Symbol('kReadPaused');
const kIncoming = Symbol('kIncoming');
const kOutgoing = Symbol('kOutgoing');
const kRequestsCount = Symbol('kRequestsCount');
const kBatchBytes = Symbol('kBatchBytes');
const kSockets = Symbol('kSockets');
const kUpgradeSockets = Symbol('kUpgradeSockets');
const kRequests = Symbol('kRequests');
const kResponseOptions = Symbol('kResponseOptions');
const kListening = Symbol('kListening');
const kMaxConnections = Symbol('kMaxConnections');
const kNetOptions = Symbol('kNetOptions');
const kTlsInfo = Symbol('kTlsInfo');
const kSNICallback = Symbol('kSNICallback');
const kSecure = Symbol('kSecure');
const kOnRawData = Symbol('kOnRawData');
const kState = Symbol('kState');
const kBatchGeneration = Symbol('kBatchGeneration');
const kSocketError = Symbol('kSocketError');
const kMaxHeadersCount = Symbol('kMaxHeadersCount');
const kKeepAliveTimeout = Symbol('kKeepAliveTimeout');
const kKeepAliveTimeoutSet = Symbol('kKeepAliveTimeoutSet');
const kKeepAliveTimeoutBuffer = Symbol('kKeepAliveTimeoutBuffer');


const badRequestResponse = Buffer.from(
  `HTTP/1.1 400 ${STATUS_CODES[400]}\r\nConnection: close\r\n\r\n`, 'ascii');
const requestTimeoutResponse = Buffer.from(
  `HTTP/1.1 408 ${STATUS_CODES[408]}\r\nConnection: close\r\n\r\n`, 'ascii');
const requestHeaderFieldsTooLargeResponse = Buffer.from(
  `HTTP/1.1 431 ${STATUS_CODES[431]}\r\nConnection: close\r\n\r\n`, 'ascii');
const requestChunkExtensionsTooLargeResponse = Buffer.from(
  `HTTP/1.1 413 ${STATUS_CODES[413]}\r\nConnection: close\r\n\r\n`, 'ascii');

function noop() {}

// The parts of net.Socket (and tls.TLSSocket for HTTPS) that node:http and
// request handlers use, backed by a connection of the batched transport.
// Instances pass instanceof net.Socket; the stream state of net.Socket is
// replaced by the accessors below.
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
    this[kTlsInfo] = null;
    this[kIncoming] = [];
    this[kOutgoing] = [];
    this[kRequestsCount] = 0;
    this[kBatchBytes] = 0;
    this[kBatchGeneration] = 0;
    this[kKeepAliveTimeoutSet] = false;
    this[kState] = {
      destroyed: false,
      readable: true,
      writable: true,
      ended: false,
      bytesWritten: 0,
      bytesRead: 0,
      readableHighWaterMark: server[kNetOptions].highWaterMark,
    };
    this._httpMessage = null;
    this._paused = false;
    this.parser = null;
    this.timeout = server.timeout;
    this.allowHalfOpen = true;
    // OutgoingMessage and some users reach into these.
    this._writableState = {
      corked: 0,
      errored: null,
      needDrain: false,
      highWaterMark: server[kNetOptions].highWaterMark,
    };
    if (server[kSecure]) {
      this.encrypted = true;
      this.servername = undefined;
    }
    // Like socketOnError() for errors emitted on the socket.
    this.on('error', onSocketError);
  }

  get [kHandle]() {
    return this.server[kHandle];
  }

  get _handle() { return null; }
  set _handle(value) {}

  get destroyed() { return this[kState].destroyed; }
  set destroyed(value) { this[kState].destroyed = value; }

  get closed() { return this[kState].destroyed; }

  get readable() { return this[kState].readable; }
  set readable(value) { this[kState].readable = value; }

  get writable() { return this[kState].writable; }
  set writable(value) { this[kState].writable = value; }

  get writableEnded() { return this[kState].ended; }
  get writableFinished() { return this[kState].ended; }
  get readableEnded() { return !this[kState].readable; }
  get readableFlowing() { return !this[kReadPaused]; }
  get readableLength() { return 0; }
  get errored() { return null; }

  get bytesWritten() { return this[kState].bytesWritten; }
  set bytesWritten(value) { this[kState].bytesWritten = value; }

  get bytesRead() { return this[kState].bytesRead; }
  set bytesRead(value) { this[kState].bytesRead = value; }

  get readableHighWaterMark() { return this[kState].readableHighWaterMark; }
  get writableHighWaterMark() { return this._writableState.highWaterMark; }

  get writableNeedDrain() { return this._writableState.needDrain; }

  get bufferSize() { return this.writableLength; }

  #address(remote) {
    const key = remote ? kRemote : kLocal;
    let address = this[key];
    if (address === null) {
      address = {};
      const handle = this[kHandle];
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

  // Like net.Socket, where small writes reach the kernel right away: bytes
  // waiting for the end of the batch only count under backpressure.
  get writableLength() {
    if (!this._writableState.needDrain) return 0;
    return this[kBatchGeneration] === this.server[kBatch].generation ?
      this[kBatchBytes] : 0;
  }

  get writableCorked() {
    return this._writableState.corked;
  }

  get pending() {
    return false;
  }

  get connecting() {
    return false;
  }

  get _connecting() {
    return false;
  }

  get readyState() {
    if (this.destroyed) return 'closed';
    return this.writable ? 'open' : 'readOnly';
  }

  // Plain EventEmitter listeners: there is no readable state to update.
  on(event, listener) {
    return FunctionPrototypeCall(EventEmitter.prototype.on, this, event,
                                 listener);
  }

  addListener(event, listener) {
    return this.on(event, listener);
  }

  prependListener(event, listener) {
    return FunctionPrototypeCall(EventEmitter.prototype.prependListener, this,
                                 event, listener);
  }

  removeListener(event, listener) {
    return FunctionPrototypeCall(EventEmitter.prototype.removeListener, this,
                                 event, listener);
  }

  off(event, listener) {
    return this.removeListener(event, listener);
  }

  // Like node:http, which owns the data of the socket.
  setEncoding() {
    throw new ERR_HTTP_SOCKET_ENCODING();
  }

  // TLS, like tls.TLSSocket.

  #tlsInfo() {
    let info = this[kTlsInfo];
    if (info === null) {
      info = {};
      this[kHandle]?.tlsInfo(this[kConnectionId], info);
      if (info.secureEstablished) this[kTlsInfo] = info;
    }
    return info;
  }

  get _secureEstablished() {
    return this.server[kSecure] ? !!this.#tlsInfo().secureEstablished :
      undefined;
  }

  get alpnProtocol() {
    if (!this.server[kSecure]) return undefined;
    return this.#tlsInfo().alpnProtocol;
  }

  get authorized() {
    return this.server[kSecure] === true && this.server.requestCert &&
      this.authorizationError === null;
  }

  get authorizationError() {
    if (!this.server[kSecure] || !this.server.requestCert) return undefined;
    return this[kHandle]?.peerVerifyError(this[kConnectionId]) ?? null;
  }

  getPeerCertificate(detailed) {
    if (!this.server[kSecure]) return undefined;
    return this[kHandle]?.peerCertificate(this[kConnectionId], !!detailed) ??
      {};
  }

  getProtocol() {
    return this.server[kSecure] ? this.#tlsInfo().protocol : undefined;
  }

  getCipher() {
    if (!this.server[kSecure]) return undefined;
    const info = this.#tlsInfo();
    return { name: info.cipher, standardName: info.cipher,
             version: info.protocol };
  }

  isSessionReused() {
    return this.server[kSecure] ? !!this.#tlsInfo().sessionReused : false;
  }

  write(data, encoding, cb) {
    if (typeof encoding === 'function') {
      cb = encoding;
      encoding = undefined;
    }
    if (this.destroyed || !this.writable) {
      if (typeof cb === 'function') process.nextTick(cb);
      return false;
    }
    const server = this.server;
    const id = this[kRequestId];
    const length = data.length;
    let ret = true;
    if (length !== 0) {
      let latin1 = false;
      if (typeof data === 'string' && encoding !== undefined &&
          encoding !== 'utf8' && encoding !== 'utf-8') {
        if (encoding === 'latin1' || encoding === 'binary') {
          latin1 = true;
        } else {
          data = Buffer.from(data, encoding);
        }
      }
      const batch = server[kBatch];
      // Between requests (error replies) bytes go to the connection.
      if (id !== 0) {
        batch.record(kOpRaw, 0, 0, id, null, data, latin1);
      } else {
        batch.record(kOpConnectionRaw, 0, 0, this[kConnectionId], null, data,
                     latin1);
      }
      this[kState].bytesWritten += typeof data === 'string' ?
        Buffer.byteLength(data, latin1 ? 'latin1' : 'utf8') : data.length;
      if (this[kBatchGeneration] !== batch.generation) {
        this[kBatchGeneration] = batch.generation;
        this[kBatchBytes] = 0;
      }
      this[kBatchBytes] += length;
      if (this[kBatchBytes] >= this.writableHighWaterMark) {
        if (this._writableState.corked > 0) {
          // Corked: the bytes wait, like in a corked net.Socket.
          this._writableState.needDrain = true;
          ret = false;
        } else {
          ret = this.#flushAndCheck();
        }
      }
    }
    if (typeof cb === 'function') process.nextTick(cb);
    return ret;
  }

  // Hands the bytes of this batch over, and reports whether the kernel
  // keeps up; 'drain' follows when it does not.
  #flushAndCheck() {
    this.server[kBatch].flush();
    this[kBatchBytes] = 0;
    const handle = this[kHandle];
    const queued = handle?.writeQueueSize(this[kConnectionId]) ?? 0;
    if (queued >= this.writableHighWaterMark) {
      this._writableState.needDrain = true;
      handle.watchDrain(this[kConnectionId]);
      return false;
    }
    if (this._writableState.needDrain) {
      handle?.watchDrain(this[kConnectionId]);
    }
    return true;
  }

  cork() {
    this._writableState.corked++;
  }

  uncork() {
    const state = this._writableState;
    if (state.corked > 0 && --state.corked === 0 && state.needDrain) {
      this.#flushAndCheck();
    }
  }

  pause() {
    if (!this[kReadPaused]) {
      this[kReadPaused] = true;
      this[kHandle]?.pauseConnection(this[kConnectionId]);
      this.emit('pause');
    }
    return this;
  }

  resume() {
    if (this[kReadPaused]) {
      this[kReadPaused] = false;
      this[kHandle]?.resumeConnection(this[kConnectionId]);
      this.emit('resume');
    }
    return this;
  }

  isPaused() {
    return this[kReadPaused];
  }

  setTimeout(msecs, callback) {
    validateNumber(msecs, 'msecs', 0);
    this.timeout = msecs;
    this[kHandle]?.setConnectionTimeout(this[kConnectionId], msecs);
    if (typeof callback === 'function') {
      if (msecs === 0) {
        this.removeListener('timeout', callback);
      } else {
        this.once('timeout', callback);
      }
    }
    return this;
  }

  _unrefTimer() {}

  setNoDelay(noDelay = true) {
    this[kHandle]?.setNoDelay(this[kConnectionId], !!noDelay);
    return this;
  }

  setKeepAlive(enable = false, initialDelay = 0) {
    this[kHandle]?.setKeepAlive(this[kConnectionId], !!enable,
                                ~~(initialDelay / 1000) * 1000);
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
    } else if (typeof encoding === 'function') {
      cb = encoding;
      encoding = undefined;
    }
    if (data != null) this.write(data, encoding);
    if (!this.destroyed && this.writable) {
      this.writable = false;
      this[kState].ended = true;
      this.server[kBatch].record(kOpShutdown, 0, 0, this[kConnectionId],
                                 null, null, false);
    }
    if (typeof cb === 'function') process.nextTick(cb);
    return this;
  }

  destroy(err) {
    return this.#close(err, false);
  }

  resetAndDestroy() {
    return this.#close(null, true);
  }

  #close(err, reset) {
    if (this.destroyed) return this;
    this.destroyed = true;
    this.readable = false;
    this.writable = false;
    // Bytes written before destroy() are sent, as with net.Socket.
    this.server[kBatch].flush();
    this[kHandle]?.closeConnection(this[kConnectionId], reset);
    if (err && this.listenerCount('error') > 0) {
      process.nextTick(emitErrorNT, this, err);
    }
    return this;
  }
}

// 'error' listener of every BatchedSocket.
function onSocketError(err) {
  this.server[kSocketError](this, err);
}

function emitErrorNT(emitter, err) {
  emitter.emit('error', err);
}

// The stream handed to 'upgrade' and 'connect' listeners when the
// connection cannot be handed over as a net.Socket: bytes flow through the
// batched transport.
class BatchedUpgradeSocket extends Duplex {
  constructor(server, connectionId, socket) {
    super({ allowHalfOpen: true });
    this.server = server;
    this[kConnectionId] = connectionId;
    this[kReadPaused] = false;
    this.bytesWritten = 0;
    this.bytesRead = 0;
    this.encrypted = socket.encrypted;
    this.remoteAddress = socket.remoteAddress;
    this.remotePort = socket.remotePort;
    this.remoteFamily = socket.remoteFamily;
    this.localAddress = socket.localAddress;
    this.localPort = socket.localPort;
    this.alpnProtocol = socket.alpnProtocol;
    this.servername = socket.servername;
  }

  get [kHandle]() {
    return this.server[kHandle];
  }

  address() {
    return { address: this.localAddress, port: this.localPort };
  }

  _read() {
    if (this[kReadPaused]) {
      this[kReadPaused] = false;
      this[kHandle]?.resumeConnection(this[kConnectionId]);
    }
  }

  _write(chunk, encoding, callback) {
    this.bytesWritten += chunk.length;
    this.server[kBatch].record(kOpConnectionRaw, 0, 0, this[kConnectionId],
                               null, chunk, false);
    process.nextTick(callback);
  }

  _final(callback) {
    this.server[kBatch].record(kOpShutdown, 0, 0, this[kConnectionId], null,
                               null, false);
    process.nextTick(callback);
  }

  _destroy(err, callback) {
    this.server[kBatch].flush();
    this[kHandle]?.closeConnection(this[kConnectionId]);
    callback(err);
  }

  setTimeout(msecs, callback) {
    this[kHandle]?.setConnectionTimeout(this[kConnectionId], msecs);
    if (typeof callback === 'function') this.once('timeout', callback);
    return this;
  }

  setNoDelay(noDelay = true) {
    this[kHandle]?.setNoDelay(this[kConnectionId], !!noDelay);
    return this;
  }

  setKeepAlive(enable = false, initialDelay = 0) {
    this[kHandle]?.setKeepAlive(this[kConnectionId], !!enable,
                                ~~(initialDelay / 1000) * 1000);
    return this;
  }

  ref() {
    return this;
  }

  unref() {
    return this;
  }

  [kOnRawData](data) {
    this.bytesRead += data.length;
    if (!this.push(data) && !this[kReadPaused]) {
      this[kReadPaused] = true;
      this[kHandle]?.pauseConnection(this[kConnectionId]);
    }
  }
}

function emitCloseNT(res) {
  if (!res._closed) {
    res.destroyed = true;
    res._closed = true;
    res.emit('close');
  }
}

// 'finish' listener of every ServerResponse, like resOnFinish().
function onResponseFinish() {
  const res = this;
  const req = res.req;
  const socket = res.socket;
  const server = socket.server;
  if (onResponseFinishChannel.hasSubscribers) {
    onResponseFinishChannel.publish({ request: req, response: res, socket,
                                      server });
  }
  const incoming = socket[kIncoming];
  if (incoming[0] === req) ArrayPrototypeShift(incoming);
  req[kDetachAbortSignal]();
  if (!req._consuming && !req._readableState.resumeScheduled) req._dump();
  server[kBatch].record(kOpEnd, res._last ? kUserConnectionClose : 0, 0,
                        res[kRequestId], null, null, false);
  socket[kRequestId] = 0;
  res.detachSocket(socket);
  process.nextTick(emitCloseNT, res);
  if (res._last) {
    // Native code ends the connection after this response.
    socket.writable = false;
    socket[kState].ended = true;
    return;
  }
  // The next pipelined response gets the socket.
  const next = ArrayPrototypeShift(socket[kOutgoing]);
  if (next !== undefined) {
    socket[kRequestId] = next[kRequestId];
    next.assignSocket(socket);
  } else if (socket.timeout > 0 && server.keepAliveTimeout > 0 &&
             server[kHandle]?.writeQueueSize(socket[kConnectionId]) === 0) {
    // Like resOnFinish(): an idle connection waits for the keep-alive
    // timeout rather than the socket timeout. A connection whose client
    // does not read is not idle; node:http would not finish its responses.
    socket[kKeepAliveTimeoutSet] = true;
    socket.setTimeout(server.keepAliveTimeout +
                      (server.keepAliveTimeoutBuffer ?? 1000));
  }
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

function hasBodyHeaders(raw) {
  for (let i = 0; i < raw.length; i += 2) {
    const length = raw[i].length;
    if (length !== 14 && length !== 17) continue;
    const name = StringPrototypeToLowerCase(raw[i]);
    if (name === 'content-length' || name === 'transfer-encoding') return true;
  }
  return false;
}

// Like abortIncoming() and abortOutgoing() when the socket closes.
function abortRequests(socket) {
  const incoming = socket[kIncoming];
  while (incoming.length > 0) {
    const req = ArrayPrototypeShift(incoming);
    if (!req.destroyed) req.destroy(new ConnResetException('aborted'));
  }
  const outgoing = socket[kOutgoing];
  while (outgoing.length > 0) {
    const res = ArrayPrototypeShift(outgoing);
    res.destroy(new ConnResetException('aborted'));
  }
}

// 'connection' listener of every server: streams that users emit as
// 'connection' (any Duplex) go through node:http's own connection handling.
function onInjectedConnection(socket) {
  if (socket instanceof BatchedSocket) return;
  if (!this.listening) FunctionPrototypeCall(setupConnectionsTracking, this);
  FunctionPrototypeCall(classicConnectionListener, this, socket);
}

// Instances pass instanceof net.Socket.
ObjectSetPrototypeOf(BatchedSocket.prototype, net.Socket.prototype);

let BatchedTLSSocket;

// The socket class of HTTPS servers: a BatchedSocket that passes instanceof
// tls.TLSSocket.
function getBatchedTLSSocket() {
  if (BatchedTLSSocket === undefined) {
    const tls = require('tls');
    BatchedTLSSocket = class BatchedTLSSocket extends BatchedSocket {};
    copyPrototype(BatchedSocket.prototype, BatchedTLSSocket.prototype);
    ObjectSetPrototypeOf(BatchedTLSSocket.prototype, tls.TLSSocket.prototype);
  }
  return BatchedTLSSocket;
}

// Defines the own properties of `from` on `to`, but the constructor.
function copyPrototype(from, to) {
  const descriptors = ObjectGetOwnPropertyDescriptors(from);
  const keys = ReflectOwnKeys(descriptors);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === 'constructor') continue;
    ObjectDefineProperty(to, keys[i], descriptors[keys[i]]);
  }
}

class BatchedHttpServer extends EventEmitter {
  #wantConnections = false;
  #wantSecureConnections = false;

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
    this[kSecure] = false;
    this[kHandle] = null;
    this[kListening] = false;
    this[kMaxConnections] = undefined;
    this[kKeepAliveTimeout] = 5000;
    this[kKeepAliveTimeoutBuffer] = 1000;
    this[kTimeouts] = {
      keepAliveTimeout: 5000,
      headersTimeout: 60000,
      maxHeaderSize: 0,
      requestTimeout: 300000,
      connectionsCheckingInterval: 30000,
      timeout: 0,
      handshakeTimeout: 0,
    };
    // Validated and stored like node:http, through the accessors below.
    storeHTTPOptions.call(this, options);
    this[kNetOptions] = {
      noDelay: options.noDelay ?? true,
      keepAlive: !!options.keepAlive,
      keepAliveInitialDelay: options.keepAliveInitialDelay ?? 0,
      highWaterMark: options.highWaterMark ?? getDefaultHighWaterMark(),
    };
    this.optimizeEmptyRequests = options.optimizeEmptyRequests === true;
    this[kResponseOptions] = {
      highWaterMark: this[kNetOptions].highWaterMark,
      rejectNonStandardBodyWrites: this.rejectNonStandardBodyWrites,
    };
    this[kSockets] = new SafeMap();
    this[kUpgradeSockets] = new SafeMap();
    this[kRequests] = new SafeMap();
    this[kBatch] = new ResponseBatch();
    this[kShared] = Buffer.allocUnsafeSlow(128 * 1024);
    // Like net.Server.
    this.noDelay = this[kNetOptions].noDelay;
    this.keepAlive = this[kNetOptions].keepAlive;
    this.keepAliveInitialDelay = this[kNetOptions].keepAliveInitialDelay;
    this.highWaterMark = this[kNetOptions].highWaterMark;
    this.allowHalfOpen = true;
    this.pauseOnConnect = false;
    this.httpAllowHalfOpen = false;
    this[kMaxHeadersCount] = null;
    this.maxRequestsPerSocket = 0;
    this[kUniqueHeaders] = parseUniqueHeadersOption(options.uniqueHeaders);
    if (requestListener) this.on('request', requestListener);
    // Some events need the transport to report more.
    this.on('newListener', (event, listener) => {
      if (event === 'connection' && listener !== onInjectedConnection &&
          !this.#wantConnections) {
        this.#wantConnections = true;
        this.#configure();
      } else if (event === 'secureConnection' &&
                 !this.#wantSecureConnections) {
        this.#wantSecureConnections = true;
        this.#configure();
      } else if (event === 'keylog') {
        this[kHandle]?.enableKeylog();
      }
    });
    // Streams emitted as 'connection' by users are served the classic way,
    // with node:http's own connection tracking.
    this.on('connection', onInjectedConnection);
    this.on('listening', setupConnectionsTracking);
  }

  // net.Server and http.Server state, synchronized with the binding.

  get listening() { return this[kListening]; }
  set listening(value) { this[kListening] = value; }

  // Idle connections close keepAliveTimeoutBuffer after the advertised
  // keep-alive timeout, like node:http.
  get keepAliveTimeout() { return this[kKeepAliveTimeout]; }
  set keepAliveTimeout(ms) {
    this[kKeepAliveTimeout] = ms;
    this.#updateKeepAlive();
  }

  get keepAliveTimeoutBuffer() { return this[kKeepAliveTimeoutBuffer]; }
  set keepAliveTimeoutBuffer(ms) {
    this[kKeepAliveTimeoutBuffer] = ms;
    this.#updateKeepAlive();
  }

  #updateKeepAlive() {
    const timeout = this[kKeepAliveTimeout];
    const buffer = this[kKeepAliveTimeoutBuffer];
    this.#setTimeout('keepAliveTimeout',
                     typeof timeout === 'number' && timeout > 0 ?
                       timeout + (typeof buffer === 'number' && buffer >= 0 ?
                         buffer : 1000) :
                       0);
  }

  get headersTimeout() { return this[kTimeouts].headersTimeout; }
  set headersTimeout(ms) { this.#setTimeout('headersTimeout', ms); }

  get requestTimeout() { return this[kTimeouts].requestTimeout; }
  set requestTimeout(ms) { this.#setTimeout('requestTimeout', ms); }

  get connectionsCheckingInterval() {
    return this[kTimeouts].connectionsCheckingInterval;
  }
  set connectionsCheckingInterval(ms) {
    this.#setTimeout('connectionsCheckingInterval', ms);
  }

  get timeout() { return this[kTimeouts].timeout; }
  set timeout(ms) { this.#setTimeout('timeout', ms); }

  get maxHeaderSize() { return this[kTimeouts].maxHeaderSize || undefined; }
  set maxHeaderSize(size) { this.#setTimeout('maxHeaderSize', size ?? 0); }

  get maxHeadersCount() { return this[kMaxHeadersCount]; }
  set maxHeadersCount(value) {
    this[kMaxHeadersCount] = value;
    this.#configure();
  }

  get maxConnections() { return this[kMaxConnections]; }
  set maxConnections(value) {
    this[kMaxConnections] = value;
    this.#configure();
  }

  #setTimeout(key, value) {
    this[kTimeouts][key] = value;
    if (this[kHandle] !== null) applyTimeouts(this, this[kHandle]);
  }

  #configure(handle = this[kHandle]) {
    if (handle === null) return;
    const net = this[kNetOptions];
    let flags = kDelegateContinue | kDelegateErrors |
      kForwardBodyAfterResponse;
    if (this.#wantConnections) flags |= kAnnounceConnections;
    if (this.#wantSecureConnections) flags |= kAnnounceSecure;
    if (net.noDelay) flags |= kNoDelay;
    if (net.keepAlive) flags |= kTcpKeepAlive;
    const max = this[kMaxConnections];
    handle.configure(flags,
                     calculateLenientFlags(this.httpValidation,
                                           this.insecureHTTPParser) >>> 0,
                     typeof max === 'number' && max >= 0 ? max : -1,
                     net.keepAliveInitialDelay,
                     this[kMaxHeadersCount] > 0 ? this[kMaxHeadersCount] : 0);
  }

  [kConfigureHandle](handle) {
    this.#configure(handle);
    applyTimeouts(this, handle);
  }

  listen(...args) {
    return listenBatched(this, args);
  }

  address() {
    return addressBatched(this);
  }

  getConnections(cb) {
    const count = this[kHandle]?.connectionCount() ?? 0;
    if (typeof cb === 'function') process.nextTick(cb, null, count);
    return this;
  }

  close(cb) {
    const handle = this[kHandle];
    httpServerPreClose(this);
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
      this[kClusterHandle]?.close?.();
      this[kClusterHandle] = null;
    } else if (handle === null) {
      process.nextTick(() => this.emit('close'));
    }
    return this;
  }

  async [SymbolAsyncDispose]() {
    if (!this.listening) return;
    await new Promise((resolve, reject) => {
      this.close((err) => (err ? reject(err) : resolve()));
    });
  }

  closeAllConnections() {
    this[kHandle]?.closeAllConnections();
  }

  // Like node:http, a connection whose response has ended counts as idle,
  // even before that response reaches native code.
  closeIdleConnections() {
    this[kHandle]?.closeIdleConnections();
    for (const { 1: socket } of this[kSockets]) {
      const res = socket._httpMessage;
      if (res?.finished && socket[kOutgoing].length === 0 &&
          socket[kIncoming].length <= 1) {
        socket.end();
      }
    }
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

  unref() {
    this[kUnref] = true;
    this[kHandle]?.unref();
    return this;
  }

  [kOnClose]() {
    this[kRequests].clear();
    this[kSockets].clear();
    this[kHandle] = null;
    this[kBatch].handle = null;
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

  #socket(connectionId) {
    const sockets = this[kSockets];
    let socket = sockets.get(connectionId);
    if (socket === undefined) {
      socket = this[kSecure] ?
        new (getBatchedTLSSocket())(this, connectionId) :
        new BatchedSocket(this, connectionId);
      sockets.set(connectionId, socket);
      if (this.#wantConnections) this.emit('connection', socket);
    }
    return socket;
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
    const socket = this.#socket(connectionId);
    if (socket[kKeepAliveTimeoutSet]) {
      // Like resetSocketTimeout().
      socket[kKeepAliveTimeoutSet] = false;
      socket.setTimeout(this.timeout || 0);
    }
    const req = this.#newRequest(socket, method, url, raw, major, minor);
    const hasBody = (flags & kHasBody) !== 0;

    if ((flags & kUpgrade) !== 0) {
      req.upgrade = method === 'CONNECT' ||
        !!FunctionPrototypeCall(this.shouldUpgradeCallback, this, req);
      if (req.upgrade) {
        this.#handOver(id, req, socket, hasBody);
        return;
      }
    }

    if (hasBody) this[kRequests].set(id, req);
    ArrayPrototypePush(socket[kIncoming], req);

    const res = new this[kServerResponse](req, this[kResponseOptions]);
    res[kRequestId] = id;
    res._keepAliveTimeout = this.keepAliveTimeout;
    res._maxRequestsPerSocket = this.maxRequestsPerSocket;
    res.shouldKeepAlive = (flags & kKeepAlive) !== 0;
    res[kUniqueHeaders] = this[kUniqueHeaders];

    if (onRequestStartChannel.hasSubscribers) {
      onRequestStartChannel.publish({ request: req, response: res, socket,
                                      server: this });
    }

    if (this.optimizeEmptyRequests && !hasBody && !hasBodyHeaders(raw)) {
      req._dumpAndCloseReadable();
      req._read();
    }

    if (socket._httpMessage) {
      // A pipelined request: its response waits for the earlier ones.
      ArrayPrototypePush(socket[kOutgoing], res);
    } else {
      socket[kRequestId] = id;
      res.assignSocket(socket);
    }
    res.on('finish', onResponseFinish);

    let handled = false;
    if (major === 1 && minor === 1) {
      if (this.requireHostHeader && !hasHostHeader(raw)) {
        res.writeHead(400, ['Connection', 'close']);
        res.end();
        handled = true;
      } else {
        const max = this.maxRequestsPerSocket;
        const limited = typeof max === 'number' && max > 0;
        if (limited) {
          socket[kRequestsCount]++;
          res.maxRequestsOnConnectionReached = max <= socket[kRequestsCount];
        }
        if (limited && max < socket[kRequestsCount]) {
          handled = true;
          this.emit('dropRequest', req, socket);
          res.writeHead(503);
          res.end();
        } else if ((flags & kHasExpect) !== 0) {
          handled = true;
          const expect = getRawHeader(req, 'expect', true);
          if (RegExpPrototypeExec(continueExpression, expect) !== null) {
            res._expect_continue = true;
            if (this.listenerCount('checkContinue') > 0) {
              this.emit('checkContinue', req, res);
            } else {
              res.writeContinue();
              this.emit('request', req, res);
            }
          } else if (this.listenerCount('checkExpectation') > 0) {
            this.emit('checkExpectation', req, res);
          } else {
            res.writeHead(417);
            res.end();
          }
        }
      }
    }
    if (!handled) this.emit('request', req, res);

    // As in node:http, a bodyless request ends after the 'request' handler.
    if (!hasBody && !req.complete) {
      req.complete = true;
      req.push(null);
    }
  }

  // Emits 'upgrade' or 'connect' with the connection taken out of HTTP
  // processing: a net.Socket for the same descriptor when it can be handed
  // over, or a stream fed by the transport.
  #handOver(id, req, socket, hasBody) {
    const event = req.method === 'CONNECT' ? 'connect' : 'upgrade';
    const connectionId = socket[kConnectionId];
    if (this.listenerCount(event) === 0) {
      // Like node:http: no handler, no connection.
      socket.destroy();
      return;
    }
    const handle = this[kHandle];
    let result = null;
    if (!hasBody && !this[kSecure]) result = handle.detach(connectionId);
    if (result !== null && typeof result !== 'number') {
      this[kSockets].delete(connectionId);
      socket.destroyed = true;
      const { 0: fd, 1: head } = result;
      const netSocket = new net.Socket({ fd, readable: true, writable: true });
      netSocket.server = this;
      req.socket = req.client = netSocket;
      req.complete = true;
      req.push(null);
      this.emit(event, req, netSocket, head);
      return;
    }
    // Raw mode: the request body, if any, still goes to `req`, then the
    // bytes that follow go to the stream.
    const stream = new BatchedUpgradeSocket(this, connectionId, socket);
    this[kSockets].delete(connectionId);
    socket.destroyed = true;
    this[kUpgradeSockets].set(connectionId, stream);
    req.socket = req.client = stream;
    if (hasBody) {
      this[kRequests].set(id, req);
    } else {
      req.complete = true;
      req.push(null);
    }
    handle.upgrade(connectionId);
    this.emit(event, req, stream, Buffer.alloc(0));
  }

  #parseBodies(buf) {
    const requests = this[kRequests];
    const length = buf.length;
    let o = 0;
    while (o < length) {
      const id = readU32(buf, o);
      const len = readU32(buf, o + 4);
      o += 8;
      if (len === 0) {
        const req = requests.get(id);
        if (req !== undefined) {
          requests.delete(id);
          req.complete = true;
          req.push(null);
          // As parserOnMessageComplete() does: backpressure may have paused
          // the connection, and the next request has to be read.
          if (!req.upgrade) readStart(req.socket);
        }
      } else if (len === kBodyAbort) {
        const req = requests.get(id);
        if (req !== undefined) {
          requests.delete(id);
          if (!req.complete && !req.destroyed) {
            req.destroy(new ConnResetException('aborted'));
          }
        }
      } else if (len < kFirstMarker) {
        const req = requests.get(id);
        if (req !== undefined && !req._dumped) {
          req.socket.bytesRead += len;
          if (!req.push(buf.subarray(o, o + len))) req.socket.pause();
          // What IncomingMessage#_read() records once someone reads, which
          // a body and its end in the same batch would skip.
          if (req.readableFlowing) req._consuming = true;
        }
        o += len;
      } else {
        let payload = null;
        if (len === kTrailers || len === kClientError || len === kRawData ||
            len === kServername || len === kKeylog || len === kTlsError ||
            len === kDrop) {
          const payloadLength = readU32(buf, o);
          payload = buf.subarray(o + 4, o + 4 + payloadLength);
          o += 4 + payloadLength;
        }
        try {
          this.#onMarker(id, len, payload);
        } catch (err) {
          triggerUncaughtException(err, false);
        }
      }
    }
  }

  #onMarker(id, marker, payload) {
    switch (marker) {
      case kConnectionClosed:
        this.#connectionClosed(id);
        break;
      case kTrailers: {
        const req = this[kRequests].get(id);
        if (req !== undefined) {
          const count = payload[0] | (payload[1] << 8);
          const raw = new Array(count * 2);
          readFields(payload, 2, raw, count);
          // As in node:http, trailers arrive once the request is complete.
          req.complete = true;
          req._addHeaderLines(raw, raw.length);
        }
        break;
      }
      case kConnectionOpen:
        this.#socket(id);
        break;
      case kSecureConnection:
        this.emit('secureConnection', this.#socket(id));
        break;
      case kDrain:
        this.#drain(id);
        break;
      case kTimeout:
        this.#timeout(id);
        break;
      case kClientError:
        this.#clientError(id, payload);
        break;
      case kRawData:
        this[kUpgradeSockets].get(id)?.[kOnRawData](Buffer.from(payload));
        break;
      case kRawEnd:
        this[kUpgradeSockets].get(id)?.push(null);
        break;
      case kServername:
        this.#servername(id, latin1Slice(payload, 0, payload.length));
        break;
      case kKeylog:
        this.emit('keylog', Buffer.from(payload), this.#socket(id));
        break;
      case kTlsError:
        this.#tlsError(id, payload);
        break;
      case kDrop: {
        const parts = StringPrototypeSplit(
          latin1Slice(payload, 0, payload.length), '\0');
        if (parts.length >= 4) {
          this.emit('drop', {
            localAddress: parts[0],
            localPort: +parts[1],
            remoteAddress: parts[2],
            remotePort: +parts[3],
          });
        } else {
          this.emit('drop');
        }
        break;
      }
    }
  }

  #connectionClosed(connectionId) {
    const upgraded = this[kUpgradeSockets].get(connectionId);
    if (upgraded !== undefined) {
      this[kUpgradeSockets].delete(connectionId);
      if (!upgraded.readableEnded) upgraded.push(null);
      upgraded.destroy();
      return;
    }
    const sockets = this[kSockets];
    const socket = sockets.get(connectionId);
    if (socket === undefined) return;
    sockets.delete(connectionId);
    socket.destroyed = true;
    socket.readable = false;
    socket.writable = false;
    socket[kRequestId] = 0;
    // Like socketOnClose(): what is still in flight is aborted.
    abortRequests(socket);
    socket.emit('close', false);
  }

  #drain(connectionId) {
    const socket = this[kSockets].get(connectionId);
    if (socket === undefined) return;
    socket._writableState.needDrain = false;
    socket.emit('drain');
    // Like socketOnDrain().
    const res = socket._httpMessage;
    if (res && !res.finished && res[kNeedDrain] && res.writableLength === 0) {
      res[kNeedDrain] = false;
      res.emit('drain');
    }
  }

  // Like socketOnTimeout().
  #timeout(connectionId) {
    const upgraded = this[kUpgradeSockets].get(connectionId);
    if (upgraded !== undefined) {
      upgraded.emit('timeout');
      return;
    }
    const socket = this[kSockets].get(connectionId);
    if (socket === undefined || socket.destroyed) return;
    const req = socket[kIncoming][0];
    const reqTimeout = req && !req.complete && req.emit('timeout', socket);
    const res = socket._httpMessage;
    const resTimeout = res && res.emit('timeout', socket);
    const serverTimeout = this.emit('timeout', socket);
    socket.emit('timeout');
    if (!reqTimeout && !resTimeout && !serverTimeout) socket.destroy();
  }

  // Like socketOnError() for parser errors and request timeouts.
  #clientError(connectionId, payload) {
    const socket = this.#socket(connectionId);
    const bytesParsed = readU32(payload, 0);
    let end = 4;
    while (payload[end] !== 0) end++;
    const code = latin1Slice(payload, 4, end);
    let reasonEnd = end + 1;
    while (payload[reasonEnd] !== 0) reasonEnd++;
    const reason = latin1Slice(payload, end + 1, reasonEnd);
    let err;
    if (code === 'ERR_HTTP_REQUEST_TIMEOUT') {
      err = new ERR_HTTP_REQUEST_TIMEOUT();
    } else {
      // Like the errors of node_http_parser.cc.
      // eslint-disable-next-line no-restricted-syntax
      err = new Error(`Parse Error: ${reason}`);
      err.code = code;
      err.reason = reason;
      err.bytesParsed = bytesParsed;
      err.rawPacket = Buffer.from(payload.subarray(reasonEnd + 1));
    }
    this[kSocketError](socket, err);
  }

  // Like socketOnError(): 'clientError', or a default reply and destroy().
  [kSocketError](socket, err) {
    socket.removeListener('error', onSocketError);
    if (socket.listenerCount('error') === 0) socket.on('error', noop);
    if (!this.emit('clientError', err, socket)) {
      // Reply only when nothing of a response went out yet.
      if (socket.writable &&
          (!socket._httpMessage || !socket._httpMessage._headerSent)) {
        let response;
        switch (err.code) {
          case 'HPE_HEADER_OVERFLOW':
            response = requestHeaderFieldsTooLargeResponse;
            break;
          case 'HPE_CHUNK_EXTENSIONS_OVERFLOW':
            response = requestChunkExtensionsTooLargeResponse;
            break;
          case 'ERR_HTTP_REQUEST_TIMEOUT':
            response = requestTimeoutResponse;
            break;
          default:
            response = badRequestResponse;
            break;
        }
        // The reply goes to the connection, not to a response in flight.
        const id = socket[kRequestId];
        socket[kRequestId] = 0;
        socket.write(response);
        socket[kRequestId] = id;
      }
      socket.destroy(err);
    }
  }

  #servername(connectionId, servername) {
    const socket = this.#socket(connectionId);
    socket.servername = servername;
    const done = (err, context) => {
      if (err) {
        this.#emitTlsError(socket, err);
        socket.destroy();
        return;
      }
      this[kHandle]?.sniDone(connectionId, context?.context ?? context);
    };
    const callback = this[kSNICallback];
    if (typeof callback === 'function') {
      FunctionPrototypeCall(callback, socket, servername, done);
      return;
    }
    const contexts = this._contexts ?? [];
    for (let i = contexts.length - 1; i >= 0; --i) {
      if (RegExpPrototypeExec(contexts[i][0], servername) !== null) {
        done(null, contexts[i][1]);
        return;
      }
    }
    done(null, undefined);
  }

  #emitTlsError(socket, err) {
    this.emit('tlsClientError', err, socket);
  }

  #tlsError(connectionId, payload) {
    const socket = this.#socket(connectionId);
    const parts = StringPrototypeSplit(
      latin1Slice(payload, 0, payload.length), '\0');
    const code = parts[0];
    let err;
    if (code === 'ERR_TLS_SESSION_ATTACK') {
      err = new ERR_TLS_SESSION_ATTACK();
      if (socket.listenerCount('error') > 0) socket.emit('error', err);
    } else if (code === 'ERR_TLS_HANDSHAKE_TIMEOUT') {
      err = new ERR_TLS_HANDSHAKE_TIMEOUT();
    } else if (code === 'ECONNRESET') {
      err = new ConnResetException(parts[1]);
    } else {
      // Like the OpenSSL errors of TLSWrap.
      // eslint-disable-next-line no-restricted-syntax
      err = new Error(parts[1]);
      err.code = code;
      err.library = 'SSL routines';
      err.reason = StringPrototypeReplaceAll(
        StringPrototypeToLowerCase(StringPrototypeSlice(code, 8)), '_', ' ');
    }
    this.#emitTlsError(socket, err);
  }
}

// Instances pass instanceof http.Server, while the class methods above
// replace the net.Server ones.
ObjectSetPrototypeOf(BatchedHttpServer.prototype, HttpServer.prototype);

let BatchedHttpsServer;

// Runs ALPNCallback like callALPNCallback() of tls: returns the offset of
// the chosen protocol in the offered wire format list.
function selectAlpn(server, connectionId, offered) {
  const protocols = [];
  let offset = 0;
  while (offset < offered.length) {
    const length = offered[offset];
    ArrayPrototypePush(protocols,
                       latin1Slice(offered, offset + 1, offset + 1 + length));
    offset += 1 + length;
  }
  const info = {};
  server[kHandle]?.tlsInfo(connectionId, info);
  const selected = server.ALPNCallback({
    servername: info.servername || undefined,
    protocols,
  });
  if (selected === undefined) return undefined;
  const index = ArrayPrototypeIndexOf(protocols, selected);
  if (index === -1) {
    throw new ERR_TLS_ALPN_CALLBACK_INVALID_RESULT(selected, protocols);
  }
  let position = 0;
  for (let i = 0; i < index; i++) position += 1 + protocols[i].length;
  return position;
}

// https.createServer({ batched: true }): tls.Server's option handling, with
// TLS running in the batched transport.
function createBatchedHttpsServer(options, requestListener) {
  if (BatchedHttpsServer === undefined) {
    const tls = require('tls');
    const { Server: HttpsServer } = require('https');
    const httpConfigureHandle = BatchedHttpServer.prototype[kConfigureHandle];

    BatchedHttpsServer = class BatchedHttpsServer extends BatchedHttpServer {
      constructor(options, requestListener) {
        if (typeof options === 'function') {
          requestListener = options;
          options = {};
        }
        options = { ...options };
        if (!options.ALPNProtocols && !options.ALPNCallback) {
          options.ALPNProtocols = ['http/1.1'];
        }
        super(options, requestListener);
        this[kSecure] = true;
        // Like the tls.Server constructor.
        this._contexts = [];
        this.requestCert = options.requestCert === true;
        this.rejectUnauthorized = options.rejectUnauthorized !== false;
        if (options.sessionTimeout)
          this.sessionTimeout = options.sessionTimeout;
        if (options.ticketKeys) this.ticketKeys = options.ticketKeys;
        this.ALPNCallback = options.ALPNCallback;
        if (this.ALPNCallback && options.ALPNProtocols) {
          throw new ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS();
        }
        if (options.ALPNProtocols) {
          tls.convertALPNProtocols(options.ALPNProtocols, this);
        }
        this[kSNICallback] = options.SNICallback;
        if (this[kSNICallback]) {
          validateFunction(this[kSNICallback], 'options.SNICallback');
        }
        const handshakeTimeout = options.handshakeTimeout || 120 * 1000;
        validateNumber(handshakeTimeout, 'options.handshakeTimeout');
        this[kTimeouts].handshakeTimeout = handshakeTimeout;
        FunctionPrototypeCall(tls.Server.prototype.setSecureContext, this,
                              options);
        // Like https.Server.
        this.addListener('tlsClientError', function onTlsClientError(err,
                                                                     conn) {
          if (!this.emit('clientError', err, conn)) conn.destroy(err);
        });
      }

      // No `super` below: the prototype chain changes after the class is
      // defined.
      [kConfigureHandle](handle) {
        FunctionPrototypeCall(httpConfigureHandle, this, handle);
        handle.setSecureContext(this._sharedCreds.context, this.requestCert,
                                this.rejectUnauthorized,
                                this.ALPNProtocols);
        if (this[kSNICallback] || this._contexts.length > 0) {
          handle.enableSni();
        }
        if (this.listenerCount('keylog') > 0) handle.enableKeylog();
        if (typeof this.ALPNCallback === 'function') {
          handle.setAlpnCallback((connectionId, offered) =>
            selectAlpn(this, connectionId, offered));
        }
        handle.setRenegotiationLimit(tls.CLIENT_RENEG_LIMIT,
                                     tls.CLIENT_RENEG_WINDOW);
      }

      // New connections use the new context.
      setSecureContext(options) {
        FunctionPrototypeCall(tls.Server.prototype.setSecureContext, this,
                              options);
        this[kHandle]?.setSecureContext(this._sharedCreds.context,
                                        this.requestCert,
                                        this.rejectUnauthorized,
                                        this.ALPNProtocols);
      }

      addContext(servername, context) {
        FunctionPrototypeCall(tls.Server.prototype.addContext, this,
                              servername, context);
        this[kHandle]?.enableSni();
      }
    };

    // Instances pass instanceof https.Server and tls.Server: the methods of
    // both batched classes sit in front of https.Server.prototype.
    const own = ObjectGetOwnPropertyDescriptors(BatchedHttpsServer.prototype);
    copyPrototype(BatchedHttpServer.prototype, BatchedHttpsServer.prototype);
    // The HTTPS overrides win over the copied HTTP methods.
    const keys = ReflectOwnKeys(own);
    for (let i = 0; i < keys.length; i++) {
      ObjectDefineProperty(BatchedHttpsServer.prototype, keys[i], own[keys[i]]);
    }
    ObjectSetPrototypeOf(BatchedHttpsServer.prototype, HttpsServer.prototype);
  }
  return new BatchedHttpsServer(options, requestListener);
}

module.exports = {
  BatchedHttpServer,
  BatchedSocket,
  BatchedUpgradeSocket,
  createBatchedHttpsServer,
};
