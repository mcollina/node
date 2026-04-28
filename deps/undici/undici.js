"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// lib/core/errors.js
var require_errors = __commonJS({
  "lib/core/errors.js"(exports2, module2) {
    "use strict";
    var kUndiciError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR");
    var UndiciError = class extends Error {
      static {
        __name(this, "UndiciError");
      }
      constructor(message, options) {
        super(message, options);
        this.name = "UndiciError";
        this.code = "UND_ERR";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kUndiciError] === true;
      }
      get [kUndiciError]() {
        return true;
      }
    };
    var kConnectTimeoutError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_CONNECT_TIMEOUT");
    var ConnectTimeoutError = class extends UndiciError {
      static {
        __name(this, "ConnectTimeoutError");
      }
      constructor(message) {
        super(message);
        this.name = "ConnectTimeoutError";
        this.message = message || "Connect Timeout Error";
        this.code = "UND_ERR_CONNECT_TIMEOUT";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kConnectTimeoutError] === true;
      }
      get [kConnectTimeoutError]() {
        return true;
      }
    };
    var kHeadersTimeoutError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_HEADERS_TIMEOUT");
    var HeadersTimeoutError = class extends UndiciError {
      static {
        __name(this, "HeadersTimeoutError");
      }
      constructor(message) {
        super(message);
        this.name = "HeadersTimeoutError";
        this.message = message || "Headers Timeout Error";
        this.code = "UND_ERR_HEADERS_TIMEOUT";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kHeadersTimeoutError] === true;
      }
      get [kHeadersTimeoutError]() {
        return true;
      }
    };
    var kHeadersOverflowError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_HEADERS_OVERFLOW");
    var HeadersOverflowError = class extends UndiciError {
      static {
        __name(this, "HeadersOverflowError");
      }
      constructor(message) {
        super(message);
        this.name = "HeadersOverflowError";
        this.message = message || "Headers Overflow Error";
        this.code = "UND_ERR_HEADERS_OVERFLOW";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kHeadersOverflowError] === true;
      }
      get [kHeadersOverflowError]() {
        return true;
      }
    };
    var kBodyTimeoutError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_BODY_TIMEOUT");
    var BodyTimeoutError = class extends UndiciError {
      static {
        __name(this, "BodyTimeoutError");
      }
      constructor(message) {
        super(message);
        this.name = "BodyTimeoutError";
        this.message = message || "Body Timeout Error";
        this.code = "UND_ERR_BODY_TIMEOUT";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kBodyTimeoutError] === true;
      }
      get [kBodyTimeoutError]() {
        return true;
      }
    };
    var kInvalidArgumentError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_INVALID_ARG");
    var InvalidArgumentError = class extends UndiciError {
      static {
        __name(this, "InvalidArgumentError");
      }
      constructor(message) {
        super(message);
        this.name = "InvalidArgumentError";
        this.message = message || "Invalid Argument Error";
        this.code = "UND_ERR_INVALID_ARG";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kInvalidArgumentError] === true;
      }
      get [kInvalidArgumentError]() {
        return true;
      }
    };
    var kInvalidReturnValueError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_INVALID_RETURN_VALUE");
    var InvalidReturnValueError = class extends UndiciError {
      static {
        __name(this, "InvalidReturnValueError");
      }
      constructor(message) {
        super(message);
        this.name = "InvalidReturnValueError";
        this.message = message || "Invalid Return Value Error";
        this.code = "UND_ERR_INVALID_RETURN_VALUE";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kInvalidReturnValueError] === true;
      }
      get [kInvalidReturnValueError]() {
        return true;
      }
    };
    var kAbortError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_ABORT");
    var AbortError = class extends UndiciError {
      static {
        __name(this, "AbortError");
      }
      constructor(message) {
        super(message);
        this.name = "AbortError";
        this.message = message || "The operation was aborted";
        this.code = "UND_ERR_ABORT";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kAbortError] === true;
      }
      get [kAbortError]() {
        return true;
      }
    };
    var kRequestAbortedError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_ABORTED");
    var RequestAbortedError = class extends AbortError {
      static {
        __name(this, "RequestAbortedError");
      }
      constructor(message) {
        super(message);
        this.name = "AbortError";
        this.message = message || "Request aborted";
        this.code = "UND_ERR_ABORTED";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kRequestAbortedError] === true;
      }
      get [kRequestAbortedError]() {
        return true;
      }
    };
    var kInformationalError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_INFO");
    var InformationalError = class extends UndiciError {
      static {
        __name(this, "InformationalError");
      }
      constructor(message) {
        super(message);
        this.name = "InformationalError";
        this.message = message || "Request information";
        this.code = "UND_ERR_INFO";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kInformationalError] === true;
      }
      get [kInformationalError]() {
        return true;
      }
    };
    var kRequestContentLengthMismatchError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_REQ_CONTENT_LENGTH_MISMATCH");
    var RequestContentLengthMismatchError = class extends UndiciError {
      static {
        __name(this, "RequestContentLengthMismatchError");
      }
      constructor(message) {
        super(message);
        this.name = "RequestContentLengthMismatchError";
        this.message = message || "Request body length does not match content-length header";
        this.code = "UND_ERR_REQ_CONTENT_LENGTH_MISMATCH";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kRequestContentLengthMismatchError] === true;
      }
      get [kRequestContentLengthMismatchError]() {
        return true;
      }
    };
    var kResponseContentLengthMismatchError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_RES_CONTENT_LENGTH_MISMATCH");
    var ResponseContentLengthMismatchError = class extends UndiciError {
      static {
        __name(this, "ResponseContentLengthMismatchError");
      }
      constructor(message) {
        super(message);
        this.name = "ResponseContentLengthMismatchError";
        this.message = message || "Response body length does not match content-length header";
        this.code = "UND_ERR_RES_CONTENT_LENGTH_MISMATCH";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kResponseContentLengthMismatchError] === true;
      }
      get [kResponseContentLengthMismatchError]() {
        return true;
      }
    };
    var kClientDestroyedError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_DESTROYED");
    var ClientDestroyedError = class extends UndiciError {
      static {
        __name(this, "ClientDestroyedError");
      }
      constructor(message) {
        super(message);
        this.name = "ClientDestroyedError";
        this.message = message || "The client is destroyed";
        this.code = "UND_ERR_DESTROYED";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kClientDestroyedError] === true;
      }
      get [kClientDestroyedError]() {
        return true;
      }
    };
    var kClientClosedError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_CLOSED");
    var ClientClosedError = class extends UndiciError {
      static {
        __name(this, "ClientClosedError");
      }
      constructor(message) {
        super(message);
        this.name = "ClientClosedError";
        this.message = message || "The client is closed";
        this.code = "UND_ERR_CLOSED";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kClientClosedError] === true;
      }
      get [kClientClosedError]() {
        return true;
      }
    };
    var kSocketError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_SOCKET");
    var SocketError = class extends UndiciError {
      static {
        __name(this, "SocketError");
      }
      constructor(message, socket) {
        super(message);
        this.name = "SocketError";
        this.message = message || "Socket error";
        this.code = "UND_ERR_SOCKET";
        this.socket = socket;
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kSocketError] === true;
      }
      get [kSocketError]() {
        return true;
      }
    };
    var kNotSupportedError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_NOT_SUPPORTED");
    var NotSupportedError = class extends UndiciError {
      static {
        __name(this, "NotSupportedError");
      }
      constructor(message) {
        super(message);
        this.name = "NotSupportedError";
        this.message = message || "Not supported error";
        this.code = "UND_ERR_NOT_SUPPORTED";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kNotSupportedError] === true;
      }
      get [kNotSupportedError]() {
        return true;
      }
    };
    var kBalancedPoolMissingUpstreamError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_BPL_MISSING_UPSTREAM");
    var BalancedPoolMissingUpstreamError = class extends UndiciError {
      static {
        __name(this, "BalancedPoolMissingUpstreamError");
      }
      constructor(message) {
        super(message);
        this.name = "MissingUpstreamError";
        this.message = message || "No upstream has been added to the BalancedPool";
        this.code = "UND_ERR_BPL_MISSING_UPSTREAM";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kBalancedPoolMissingUpstreamError] === true;
      }
      get [kBalancedPoolMissingUpstreamError]() {
        return true;
      }
    };
    var kHTTPParserError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_HTTP_PARSER");
    var HTTPParserError = class extends Error {
      static {
        __name(this, "HTTPParserError");
      }
      constructor(message, code, data) {
        super(message);
        this.name = "HTTPParserError";
        this.code = code ? `HPE_${code}` : void 0;
        this.data = data ? data.toString() : void 0;
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kHTTPParserError] === true;
      }
      get [kHTTPParserError]() {
        return true;
      }
    };
    var kResponseExceededMaxSizeError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_RES_EXCEEDED_MAX_SIZE");
    var ResponseExceededMaxSizeError = class extends UndiciError {
      static {
        __name(this, "ResponseExceededMaxSizeError");
      }
      constructor(message) {
        super(message);
        this.name = "ResponseExceededMaxSizeError";
        this.message = message || "Response content exceeded max size";
        this.code = "UND_ERR_RES_EXCEEDED_MAX_SIZE";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kResponseExceededMaxSizeError] === true;
      }
      get [kResponseExceededMaxSizeError]() {
        return true;
      }
    };
    var kRequestRetryError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_REQ_RETRY");
    var RequestRetryError = class extends UndiciError {
      static {
        __name(this, "RequestRetryError");
      }
      constructor(message, code, { headers, data }) {
        super(message);
        this.name = "RequestRetryError";
        this.message = message || "Request retry error";
        this.code = "UND_ERR_REQ_RETRY";
        this.statusCode = code;
        this.data = data;
        this.headers = headers;
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kRequestRetryError] === true;
      }
      get [kRequestRetryError]() {
        return true;
      }
    };
    var kResponseError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_RESPONSE");
    var ResponseError = class extends UndiciError {
      static {
        __name(this, "ResponseError");
      }
      constructor(message, code, { headers, body }) {
        super(message);
        this.name = "ResponseError";
        this.message = message || "Response error";
        this.code = "UND_ERR_RESPONSE";
        this.statusCode = code;
        this.body = body;
        this.headers = headers;
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kResponseError] === true;
      }
      get [kResponseError]() {
        return true;
      }
    };
    var kSecureProxyConnectionError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_PRX_TLS");
    var SecureProxyConnectionError = class extends UndiciError {
      static {
        __name(this, "SecureProxyConnectionError");
      }
      constructor(cause, message, options = {}) {
        super(message, { cause, ...options });
        this.name = "SecureProxyConnectionError";
        this.message = message || "Secure Proxy Connection failed";
        this.code = "UND_ERR_PRX_TLS";
        this.cause = cause;
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kSecureProxyConnectionError] === true;
      }
      get [kSecureProxyConnectionError]() {
        return true;
      }
    };
    var kMaxOriginsReachedError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_MAX_ORIGINS_REACHED");
    var MaxOriginsReachedError = class extends UndiciError {
      static {
        __name(this, "MaxOriginsReachedError");
      }
      constructor(message) {
        super(message);
        this.name = "MaxOriginsReachedError";
        this.message = message || "Maximum allowed origins reached";
        this.code = "UND_ERR_MAX_ORIGINS_REACHED";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kMaxOriginsReachedError] === true;
      }
      get [kMaxOriginsReachedError]() {
        return true;
      }
    };
    var Socks5ProxyError = class extends UndiciError {
      static {
        __name(this, "Socks5ProxyError");
      }
      constructor(message, code) {
        super(message);
        this.name = "Socks5ProxyError";
        this.message = message || "SOCKS5 proxy error";
        this.code = code || "UND_ERR_SOCKS5";
      }
    };
    var kMessageSizeExceededError = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_WS_MESSAGE_SIZE_EXCEEDED");
    var MessageSizeExceededError = class extends UndiciError {
      static {
        __name(this, "MessageSizeExceededError");
      }
      constructor(message) {
        super(message);
        this.name = "MessageSizeExceededError";
        this.message = message || "Max decompressed message size exceeded";
        this.code = "UND_ERR_WS_MESSAGE_SIZE_EXCEEDED";
      }
      static [Symbol.hasInstance](instance) {
        return instance && instance[kMessageSizeExceededError] === true;
      }
      get [kMessageSizeExceededError]() {
        return true;
      }
    };
    module2.exports = {
      AbortError,
      HTTPParserError,
      UndiciError,
      HeadersTimeoutError,
      HeadersOverflowError,
      BodyTimeoutError,
      RequestContentLengthMismatchError,
      ConnectTimeoutError,
      InvalidArgumentError,
      InvalidReturnValueError,
      RequestAbortedError,
      ClientDestroyedError,
      ClientClosedError,
      InformationalError,
      SocketError,
      NotSupportedError,
      ResponseContentLengthMismatchError,
      BalancedPoolMissingUpstreamError,
      ResponseExceededMaxSizeError,
      RequestRetryError,
      ResponseError,
      SecureProxyConnectionError,
      MaxOriginsReachedError,
      Socks5ProxyError,
      MessageSizeExceededError
    };
  }
});

// lib/core/symbols.js
var require_symbols = __commonJS({
  "lib/core/symbols.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      kClose: /* @__PURE__ */ Symbol("close"),
      kDestroy: /* @__PURE__ */ Symbol("destroy"),
      kDispatch: /* @__PURE__ */ Symbol("dispatch"),
      kUrl: /* @__PURE__ */ Symbol("url"),
      kWriting: /* @__PURE__ */ Symbol("writing"),
      kResuming: /* @__PURE__ */ Symbol("resuming"),
      kQueue: /* @__PURE__ */ Symbol("queue"),
      kConnect: /* @__PURE__ */ Symbol("connect"),
      kConnecting: /* @__PURE__ */ Symbol("connecting"),
      kKeepAliveDefaultTimeout: /* @__PURE__ */ Symbol("default keep alive timeout"),
      kKeepAliveMaxTimeout: /* @__PURE__ */ Symbol("max keep alive timeout"),
      kKeepAliveTimeoutThreshold: /* @__PURE__ */ Symbol("keep alive timeout threshold"),
      kKeepAliveTimeoutValue: /* @__PURE__ */ Symbol("keep alive timeout"),
      kKeepAlive: /* @__PURE__ */ Symbol("keep alive"),
      kHeadersTimeout: /* @__PURE__ */ Symbol("headers timeout"),
      kBodyTimeout: /* @__PURE__ */ Symbol("body timeout"),
      kServerName: /* @__PURE__ */ Symbol("server name"),
      kLocalAddress: /* @__PURE__ */ Symbol("local address"),
      kHost: /* @__PURE__ */ Symbol("host"),
      kNoRef: /* @__PURE__ */ Symbol("no ref"),
      kBodyUsed: /* @__PURE__ */ Symbol("used"),
      kBody: /* @__PURE__ */ Symbol("abstracted request body"),
      kRunning: /* @__PURE__ */ Symbol("running"),
      kBlocking: /* @__PURE__ */ Symbol("blocking"),
      kPending: /* @__PURE__ */ Symbol("pending"),
      kSize: /* @__PURE__ */ Symbol("size"),
      kBusy: /* @__PURE__ */ Symbol("busy"),
      kQueued: /* @__PURE__ */ Symbol("queued"),
      kFree: /* @__PURE__ */ Symbol("free"),
      kConnected: /* @__PURE__ */ Symbol("connected"),
      kClosed: /* @__PURE__ */ Symbol("closed"),
      kNeedDrain: /* @__PURE__ */ Symbol("need drain"),
      kReset: /* @__PURE__ */ Symbol("reset"),
      kDestroyed: /* @__PURE__ */ Symbol.for("nodejs.stream.destroyed"),
      kResume: /* @__PURE__ */ Symbol("resume"),
      kOnError: /* @__PURE__ */ Symbol("on error"),
      kMaxHeadersSize: /* @__PURE__ */ Symbol("max headers size"),
      kRunningIdx: /* @__PURE__ */ Symbol("running index"),
      kPendingIdx: /* @__PURE__ */ Symbol("pending index"),
      kError: /* @__PURE__ */ Symbol("error"),
      kClients: /* @__PURE__ */ Symbol("clients"),
      kClient: /* @__PURE__ */ Symbol("client"),
      kParser: /* @__PURE__ */ Symbol("parser"),
      kOnDestroyed: /* @__PURE__ */ Symbol("destroy callbacks"),
      kPipelining: /* @__PURE__ */ Symbol("pipelining"),
      kSocket: /* @__PURE__ */ Symbol("socket"),
      kHostHeader: /* @__PURE__ */ Symbol("host header"),
      kConnector: /* @__PURE__ */ Symbol("connector"),
      kStrictContentLength: /* @__PURE__ */ Symbol("strict content length"),
      kMaxRedirections: /* @__PURE__ */ Symbol("maxRedirections"),
      kMaxRequests: /* @__PURE__ */ Symbol("maxRequestsPerClient"),
      kProxy: /* @__PURE__ */ Symbol("proxy agent options"),
      kCounter: /* @__PURE__ */ Symbol("socket request counter"),
      kMaxResponseSize: /* @__PURE__ */ Symbol("max response size"),
      kHTTP2Session: /* @__PURE__ */ Symbol("http2Session"),
      kHTTP2SessionState: /* @__PURE__ */ Symbol("http2Session state"),
      kRetryHandlerDefaultRetry: /* @__PURE__ */ Symbol("retry agent default retry"),
      kConstruct: /* @__PURE__ */ Symbol("constructable"),
      kListeners: /* @__PURE__ */ Symbol("listeners"),
      kHTTPContext: /* @__PURE__ */ Symbol("http context"),
      kMaxConcurrentStreams: /* @__PURE__ */ Symbol("max concurrent streams"),
      kHTTP2InitialWindowSize: /* @__PURE__ */ Symbol("http2 initial window size"),
      kHTTP2ConnectionWindowSize: /* @__PURE__ */ Symbol("http2 connection window size"),
      kEnableConnectProtocol: /* @__PURE__ */ Symbol("http2session connect protocol"),
      kRemoteSettings: /* @__PURE__ */ Symbol("http2session remote settings"),
      kHTTP2Stream: /* @__PURE__ */ Symbol("http2session client stream"),
      kPingInterval: /* @__PURE__ */ Symbol("ping interval"),
      kNoProxyAgent: /* @__PURE__ */ Symbol("no proxy agent"),
      kHttpProxyAgent: /* @__PURE__ */ Symbol("http proxy agent"),
      kHttpsProxyAgent: /* @__PURE__ */ Symbol("https proxy agent"),
      kSocks5ProxyAgent: /* @__PURE__ */ Symbol("socks5 proxy agent")
    };
  }
});

// lib/handler/wrap-handler.js
var require_wrap_handler = __commonJS({
  "lib/handler/wrap-handler.js"(exports2, module2) {
    "use strict";
    var { InvalidArgumentError } = require_errors();
    module2.exports = class WrapHandler {
      static {
        __name(this, "WrapHandler");
      }
      #handler;
      constructor(handler) {
        this.#handler = handler;
      }
      static wrap(handler) {
        return handler.onRequestStart ? handler : new WrapHandler(handler);
      }
      // Unwrap Interface
      onConnect(abort, context) {
        return this.#handler.onConnect?.(abort, context);
      }
      onResponseStarted() {
        return this.#handler.onResponseStarted?.();
      }
      onHeaders(statusCode, rawHeaders, resume, statusMessage) {
        return this.#handler.onHeaders?.(statusCode, rawHeaders, resume, statusMessage);
      }
      onUpgrade(statusCode, rawHeaders, socket) {
        return this.#handler.onUpgrade?.(statusCode, rawHeaders, socket);
      }
      onData(data) {
        return this.#handler.onData?.(data);
      }
      onComplete(trailers) {
        return this.#handler.onComplete?.(trailers);
      }
      onError(err) {
        if (!this.#handler.onError) {
          throw err;
        }
        return this.#handler.onError?.(err);
      }
      // Wrap Interface
      onRequestStart(controller, context) {
        this.#handler.onConnect?.((reason) => controller.abort(reason), context);
      }
      onRequestUpgrade(controller, statusCode, headers, socket) {
        const rawHeaders = [];
        for (const [key, val] of Object.entries(headers)) {
          rawHeaders.push(Buffer.from(key, "latin1"), toRawHeaderValue(val));
        }
        this.#handler.onUpgrade?.(statusCode, rawHeaders, socket);
      }
      onResponseStart(controller, statusCode, headers, statusMessage) {
        const rawHeaders = [];
        for (const [key, val] of Object.entries(headers)) {
          rawHeaders.push(Buffer.from(key, "latin1"), toRawHeaderValue(val));
        }
        if (this.#handler.onHeaders?.(statusCode, rawHeaders, () => controller.resume(), statusMessage) === false) {
          controller.pause();
        }
      }
      onResponseData(controller, data) {
        if (this.#handler.onData?.(data) === false) {
          controller.pause();
        }
      }
      onResponseEnd(controller, trailers) {
        const rawTrailers = [];
        for (const [key, val] of Object.entries(trailers)) {
          rawTrailers.push(Buffer.from(key, "latin1"), toRawHeaderValue(val));
        }
        this.#handler.onComplete?.(rawTrailers);
      }
      onResponseError(controller, err) {
        if (!this.#handler.onError) {
          throw new InvalidArgumentError("invalid onError method");
        }
        this.#handler.onError?.(err);
      }
    };
    function toRawHeaderValue(value) {
      return Array.isArray(value) ? value.map((item) => Buffer.from(item, "latin1")) : Buffer.from(value, "latin1");
    }
    __name(toRawHeaderValue, "toRawHeaderValue");
  }
});

// lib/dispatcher/dispatcher.js
var require_dispatcher = __commonJS({
  "lib/dispatcher/dispatcher.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("node:events");
    var WrapHandler = require_wrap_handler();
    var wrapInterceptor = /* @__PURE__ */ __name((dispatch) => (opts, handler) => dispatch(opts, WrapHandler.wrap(handler)), "wrapInterceptor");
    var Dispatcher2 = class extends EventEmitter {
      static {
        __name(this, "Dispatcher");
      }
      dispatch() {
        throw new Error("not implemented");
      }
      close() {
        throw new Error("not implemented");
      }
      destroy() {
        throw new Error("not implemented");
      }
      compose(...args) {
        const interceptors = Array.isArray(args[0]) ? args[0] : args;
        let dispatch = this.dispatch.bind(this);
        for (const interceptor of interceptors) {
          if (interceptor == null) {
            continue;
          }
          if (typeof interceptor !== "function") {
            throw new TypeError(`invalid interceptor, expected function received ${typeof interceptor}`);
          }
          dispatch = interceptor(dispatch);
          dispatch = wrapInterceptor(dispatch);
          if (dispatch == null || typeof dispatch !== "function" || dispatch.length !== 2) {
            throw new TypeError("invalid interceptor");
          }
        }
        return new Proxy(this, {
          get: /* @__PURE__ */ __name((target, key) => key === "dispatch" ? dispatch : target[key], "get")
        });
      }
    };
    module2.exports = Dispatcher2;
  }
});

// lib/util/timers.js
var require_timers = __commonJS({
  "lib/util/timers.js"(exports2, module2) {
    "use strict";
    var fastNow = 0;
    var RESOLUTION_MS = 1e3;
    var TICK_MS = (RESOLUTION_MS >> 1) - 1;
    var fastNowTimeout;
    var kFastTimer = /* @__PURE__ */ Symbol("kFastTimer");
    var fastTimers = [];
    var NOT_IN_LIST = -2;
    var TO_BE_CLEARED = -1;
    var PENDING = 0;
    var ACTIVE = 1;
    function onTick() {
      fastNow += TICK_MS;
      let idx = 0;
      let len = fastTimers.length;
      while (idx < len) {
        const timer = fastTimers[idx];
        if (timer._state === PENDING) {
          timer._idleStart = fastNow - TICK_MS;
          timer._state = ACTIVE;
        } else if (timer._state === ACTIVE && fastNow >= timer._idleStart + timer._idleTimeout) {
          timer._state = TO_BE_CLEARED;
          timer._idleStart = -1;
          timer._onTimeout(timer._timerArg);
        }
        if (timer._state === TO_BE_CLEARED) {
          timer._state = NOT_IN_LIST;
          if (--len !== 0) {
            fastTimers[idx] = fastTimers[len];
          }
        } else {
          ++idx;
        }
      }
      fastTimers.length = len;
      if (fastTimers.length !== 0) {
        refreshTimeout();
      }
    }
    __name(onTick, "onTick");
    function refreshTimeout() {
      if (fastNowTimeout?.refresh) {
        fastNowTimeout.refresh();
      } else {
        clearTimeout(fastNowTimeout);
        fastNowTimeout = setTimeout(onTick, TICK_MS);
        fastNowTimeout?.unref();
      }
    }
    __name(refreshTimeout, "refreshTimeout");
    var FastTimer = class {
      static {
        __name(this, "FastTimer");
      }
      [kFastTimer] = true;
      /**
       * The state of the timer, which can be one of the following:
       * - NOT_IN_LIST (-2)
       * - TO_BE_CLEARED (-1)
       * - PENDING (0)
       * - ACTIVE (1)
       *
       * @type {-2|-1|0|1}
       * @private
       */
      _state = NOT_IN_LIST;
      /**
       * The number of milliseconds to wait before calling the callback.
       *
       * @type {number}
       * @private
       */
      _idleTimeout = -1;
      /**
       * The time in milliseconds when the timer was started. This value is used to
       * calculate when the timer should expire.
       *
       * @type {number}
       * @default -1
       * @private
       */
      _idleStart = -1;
      /**
       * The function to be executed when the timer expires.
       * @type {Function}
       * @private
       */
      _onTimeout;
      /**
       * The argument to be passed to the callback when the timer expires.
       *
       * @type {*}
       * @private
       */
      _timerArg;
      /**
       * @constructor
       * @param {Function} callback A function to be executed after the timer
       * expires.
       * @param {number} delay The time, in milliseconds that the timer should wait
       * before the specified function or code is executed.
       * @param {*} arg
       */
      constructor(callback, delay, arg) {
        this._onTimeout = callback;
        this._idleTimeout = delay;
        this._timerArg = arg;
        this.refresh();
      }
      /**
       * Sets the timer's start time to the current time, and reschedules the timer
       * to call its callback at the previously specified duration adjusted to the
       * current time.
       * Using this on a timer that has already called its callback will reactivate
       * the timer.
       *
       * @returns {void}
       */
      refresh() {
        if (this._state === NOT_IN_LIST) {
          fastTimers.push(this);
        }
        if (!fastNowTimeout || fastTimers.length === 1) {
          refreshTimeout();
        }
        this._state = PENDING;
      }
      /**
       * The `clear` method cancels the timer, preventing it from executing.
       *
       * @returns {void}
       * @private
       */
      clear() {
        this._state = TO_BE_CLEARED;
        this._idleStart = -1;
      }
    };
    module2.exports = {
      /**
       * The setTimeout() method sets a timer which executes a function once the
       * timer expires.
       * @param {Function} callback A function to be executed after the timer
       * expires.
       * @param {number} delay The time, in milliseconds that the timer should
       * wait before the specified function or code is executed.
       * @param {*} [arg] An optional argument to be passed to the callback function
       * when the timer expires.
       * @returns {NodeJS.Timeout|FastTimer}
       */
      setTimeout(callback, delay, arg) {
        return delay <= RESOLUTION_MS ? setTimeout(callback, delay, arg) : new FastTimer(callback, delay, arg);
      },
      /**
       * The clearTimeout method cancels an instantiated Timer previously created
       * by calling setTimeout.
       *
       * @param {NodeJS.Timeout|FastTimer} timeout
       */
      clearTimeout(timeout) {
        if (timeout[kFastTimer]) {
          timeout.clear();
        } else {
          clearTimeout(timeout);
        }
      },
      /**
       * The setFastTimeout() method sets a fastTimer which executes a function once
       * the timer expires.
       * @param {Function} callback A function to be executed after the timer
       * expires.
       * @param {number} delay The time, in milliseconds that the timer should
       * wait before the specified function or code is executed.
       * @param {*} [arg] An optional argument to be passed to the callback function
       * when the timer expires.
       * @returns {FastTimer}
       */
      setFastTimeout(callback, delay, arg) {
        return new FastTimer(callback, delay, arg);
      },
      /**
       * The clearTimeout method cancels an instantiated FastTimer previously
       * created by calling setFastTimeout.
       *
       * @param {FastTimer} timeout
       */
      clearFastTimeout(timeout) {
        timeout.clear();
      },
      /**
       * The now method returns the value of the internal fast timer clock.
       *
       * @returns {number}
       */
      now() {
        return fastNow;
      },
      /**
       * Trigger the onTick function to process the fastTimers array.
       * Exported for testing purposes only.
       * Marking as deprecated to discourage any use outside of testing.
       * @deprecated
       * @param {number} [delay=0] The delay in milliseconds to add to the now value.
       */
      tick(delay = 0) {
        fastNow += delay - RESOLUTION_MS + 1;
        onTick();
        onTick();
      },
      /**
       * Reset FastTimers.
       * Exported for testing purposes only.
       * Marking as deprecated to discourage any use outside of testing.
       * @deprecated
       */
      reset() {
        fastNow = 0;
        fastTimers.length = 0;
        clearTimeout(fastNowTimeout);
        fastNowTimeout = null;
      },
      /**
       * Exporting for testing purposes only.
       * Marking as deprecated to discourage any use outside of testing.
       * @deprecated
       */
      kFastTimer
    };
  }
});

// lib/core/constants.js
var require_constants = __commonJS({
  "lib/core/constants.js"(exports2, module2) {
    "use strict";
    var wellknownHeaderNames = (
      /** @type {const} */
      [
        "Accept",
        "Accept-Encoding",
        "Accept-Language",
        "Accept-Ranges",
        "Access-Control-Allow-Credentials",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Origin",
        "Access-Control-Expose-Headers",
        "Access-Control-Max-Age",
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
        "Age",
        "Allow",
        "Alt-Svc",
        "Alt-Used",
        "Authorization",
        "Cache-Control",
        "Clear-Site-Data",
        "Connection",
        "Content-Disposition",
        "Content-Encoding",
        "Content-Language",
        "Content-Length",
        "Content-Location",
        "Content-Range",
        "Content-Security-Policy",
        "Content-Security-Policy-Report-Only",
        "Content-Type",
        "Cookie",
        "Cross-Origin-Embedder-Policy",
        "Cross-Origin-Opener-Policy",
        "Cross-Origin-Resource-Policy",
        "Date",
        "Device-Memory",
        "Downlink",
        "ECT",
        "ETag",
        "Expect",
        "Expect-CT",
        "Expires",
        "Forwarded",
        "From",
        "Host",
        "If-Match",
        "If-Modified-Since",
        "If-None-Match",
        "If-Range",
        "If-Unmodified-Since",
        "Keep-Alive",
        "Last-Modified",
        "Link",
        "Location",
        "Max-Forwards",
        "Origin",
        "Permissions-Policy",
        "Pragma",
        "Proxy-Authenticate",
        "Proxy-Authorization",
        "RTT",
        "Range",
        "Referer",
        "Referrer-Policy",
        "Refresh",
        "Retry-After",
        "Sec-WebSocket-Accept",
        "Sec-WebSocket-Extensions",
        "Sec-WebSocket-Key",
        "Sec-WebSocket-Protocol",
        "Sec-WebSocket-Version",
        "Server",
        "Server-Timing",
        "Service-Worker-Allowed",
        "Service-Worker-Navigation-Preload",
        "Set-Cookie",
        "SourceMap",
        "Strict-Transport-Security",
        "Supports-Loading-Mode",
        "TE",
        "Timing-Allow-Origin",
        "Trailer",
        "Transfer-Encoding",
        "Upgrade",
        "Upgrade-Insecure-Requests",
        "User-Agent",
        "Vary",
        "Via",
        "WWW-Authenticate",
        "X-Content-Type-Options",
        "X-DNS-Prefetch-Control",
        "X-Frame-Options",
        "X-Permitted-Cross-Domain-Policies",
        "X-Powered-By",
        "X-Requested-With",
        "X-XSS-Protection"
      ]
    );
    var headerNameLowerCasedRecord = {};
    Object.setPrototypeOf(headerNameLowerCasedRecord, null);
    var wellknownHeaderNameBuffers = {};
    Object.setPrototypeOf(wellknownHeaderNameBuffers, null);
    function getHeaderNameAsBuffer(header) {
      let buffer = wellknownHeaderNameBuffers[header];
      if (buffer === void 0) {
        buffer = Buffer.from(header);
      }
      return buffer;
    }
    __name(getHeaderNameAsBuffer, "getHeaderNameAsBuffer");
    for (let i = 0; i < wellknownHeaderNames.length; ++i) {
      const key = wellknownHeaderNames[i];
      const lowerCasedKey = key.toLowerCase();
      headerNameLowerCasedRecord[key] = headerNameLowerCasedRecord[lowerCasedKey] = lowerCasedKey;
    }
    module2.exports = {
      wellknownHeaderNames,
      headerNameLowerCasedRecord,
      getHeaderNameAsBuffer
    };
  }
});

// lib/core/tree.js
var require_tree = __commonJS({
  "lib/core/tree.js"(exports2, module2) {
    "use strict";
    var {
      wellknownHeaderNames,
      headerNameLowerCasedRecord
    } = require_constants();
    var TstNode = class _TstNode {
      static {
        __name(this, "TstNode");
      }
      /** @type {any} */
      value = null;
      /** @type {null | TstNode} */
      left = null;
      /** @type {null | TstNode} */
      middle = null;
      /** @type {null | TstNode} */
      right = null;
      /** @type {number} */
      code;
      /**
       * @param {string} key
       * @param {any} value
       * @param {number} index
       */
      constructor(key, value, index) {
        if (index === void 0 || index >= key.length) {
          throw new TypeError("Unreachable");
        }
        const code = this.code = key.charCodeAt(index);
        if (code > 127) {
          throw new TypeError("key must be ascii string");
        }
        if (key.length !== ++index) {
          this.middle = new _TstNode(key, value, index);
        } else {
          this.value = value;
        }
      }
      /**
       * @param {string} key
       * @param {any} value
       * @returns {void}
       */
      add(key, value) {
        const length = key.length;
        if (length === 0) {
          throw new TypeError("Unreachable");
        }
        let index = 0;
        let node = this;
        while (true) {
          const code = key.charCodeAt(index);
          if (code > 127) {
            throw new TypeError("key must be ascii string");
          }
          if (node.code === code) {
            if (length === ++index) {
              node.value = value;
              break;
            } else if (node.middle !== null) {
              node = node.middle;
            } else {
              node.middle = new _TstNode(key, value, index);
              break;
            }
          } else if (node.code < code) {
            if (node.left !== null) {
              node = node.left;
            } else {
              node.left = new _TstNode(key, value, index);
              break;
            }
          } else if (node.right !== null) {
            node = node.right;
          } else {
            node.right = new _TstNode(key, value, index);
            break;
          }
        }
      }
      /**
       * @param {Uint8Array} key
       * @returns {TstNode | null}
       */
      search(key) {
        const keylength = key.length;
        let index = 0;
        let node = this;
        while (node !== null && index < keylength) {
          let code = key[index];
          if (code <= 90 && code >= 65) {
            code |= 32;
          }
          while (node !== null) {
            if (code === node.code) {
              if (keylength === ++index) {
                return node;
              }
              node = node.middle;
              break;
            }
            node = node.code < code ? node.left : node.right;
          }
        }
        return null;
      }
    };
    var TernarySearchTree = class {
      static {
        __name(this, "TernarySearchTree");
      }
      /** @type {TstNode | null} */
      node = null;
      /**
       * @param {string} key
       * @param {any} value
       * @returns {void}
       * */
      insert(key, value) {
        if (this.node === null) {
          this.node = new TstNode(key, value, 0);
        } else {
          this.node.add(key, value);
        }
      }
      /**
       * @param {Uint8Array} key
       * @returns {any}
       */
      lookup(key) {
        return this.node?.search(key)?.value ?? null;
      }
    };
    var tree = new TernarySearchTree();
    for (let i = 0; i < wellknownHeaderNames.length; ++i) {
      const key = headerNameLowerCasedRecord[wellknownHeaderNames[i]];
      tree.insert(key, key);
    }
    module2.exports = {
      TernarySearchTree,
      tree
    };
  }
});

// lib/core/util.js
var require_util = __commonJS({
  "lib/core/util.js"(exports2, module2) {
    "use strict";
    var assert = require("node:assert");
    var { kDestroyed, kBodyUsed, kListeners, kBody } = require_symbols();
    var { IncomingMessage } = require("node:http");
    var stream = require("node:stream");
    var net = require("node:net");
    var { stringify } = require("node:querystring");
    var { EventEmitter: EE } = require("node:events");
    var timers = require_timers();
    var { InvalidArgumentError, ConnectTimeoutError } = require_errors();
    var { headerNameLowerCasedRecord } = require_constants();
    var { tree } = require_tree();
    var [nodeMajor, nodeMinor] = process.versions.node.split(".", 2).map((v) => Number(v));
    var BodyAsyncIterable = class {
      static {
        __name(this, "BodyAsyncIterable");
      }
      constructor(body) {
        this[kBody] = body;
        this[kBodyUsed] = false;
      }
      async *[Symbol.asyncIterator]() {
        assert(!this[kBodyUsed], "disturbed");
        this[kBodyUsed] = true;
        yield* this[kBody];
      }
    };
    function noop() {
    }
    __name(noop, "noop");
    function wrapRequestBody(body) {
      if (isStream(body)) {
        if (bodyLength(body) === 0) {
          body.on("data", function() {
            assert(false);
          });
        }
        if (typeof body.readableDidRead !== "boolean") {
          body[kBodyUsed] = false;
          EE.prototype.on.call(body, "data", function() {
            this[kBodyUsed] = true;
          });
        }
        return body;
      } else if (body && typeof body.pipeTo === "function") {
        return new BodyAsyncIterable(body);
      } else if (body && isFormDataLike(body)) {
        return body;
      } else if (body && typeof body !== "string" && !ArrayBuffer.isView(body) && isIterable(body)) {
        return new BodyAsyncIterable(body);
      } else {
        return body;
      }
    }
    __name(wrapRequestBody, "wrapRequestBody");
    function isStream(obj) {
      return obj && typeof obj === "object" && typeof obj.pipe === "function" && typeof obj.on === "function";
    }
    __name(isStream, "isStream");
    function isBlobLike(object) {
      if (object === null) {
        return false;
      } else if (object instanceof Blob) {
        return true;
      } else if (typeof object !== "object") {
        return false;
      } else {
        const sTag = object[Symbol.toStringTag];
        return (sTag === "Blob" || sTag === "File") && ("stream" in object && typeof object.stream === "function" || "arrayBuffer" in object && typeof object.arrayBuffer === "function");
      }
    }
    __name(isBlobLike, "isBlobLike");
    function pathHasQueryOrFragment(url) {
      return url.includes("?") || url.includes("#");
    }
    __name(pathHasQueryOrFragment, "pathHasQueryOrFragment");
    function serializePathWithQuery(url, queryParams) {
      if (pathHasQueryOrFragment(url)) {
        throw new Error('Query params cannot be passed when url already contains "?" or "#".');
      }
      const stringified = stringify(queryParams);
      if (stringified) {
        url += "?" + stringified;
      }
      return url;
    }
    __name(serializePathWithQuery, "serializePathWithQuery");
    function isValidPort(port) {
      const value = parseInt(port, 10);
      return value === Number(port) && value >= 0 && value <= 65535;
    }
    __name(isValidPort, "isValidPort");
    function isHttpOrHttpsPrefixed(value) {
      return value != null && value[0] === "h" && value[1] === "t" && value[2] === "t" && value[3] === "p" && (value[4] === ":" || value[4] === "s" && value[5] === ":");
    }
    __name(isHttpOrHttpsPrefixed, "isHttpOrHttpsPrefixed");
    function parseURL(url) {
      if (typeof url === "string") {
        url = new URL(url);
        if (!isHttpOrHttpsPrefixed(url.origin || url.protocol)) {
          throw new InvalidArgumentError("Invalid URL protocol: the URL must start with `http:` or `https:`.");
        }
        return url;
      }
      if (!url || typeof url !== "object") {
        throw new InvalidArgumentError("Invalid URL: The URL argument must be a non-null object.");
      }
      if (!(url instanceof URL)) {
        if (url.port != null && url.port !== "" && isValidPort(url.port) === false) {
          throw new InvalidArgumentError("Invalid URL: port must be a valid integer or a string representation of an integer.");
        }
        if (url.path != null && typeof url.path !== "string") {
          throw new InvalidArgumentError("Invalid URL path: the path must be a string or null/undefined.");
        }
        if (url.pathname != null && typeof url.pathname !== "string") {
          throw new InvalidArgumentError("Invalid URL pathname: the pathname must be a string or null/undefined.");
        }
        if (url.hostname != null && typeof url.hostname !== "string") {
          throw new InvalidArgumentError("Invalid URL hostname: the hostname must be a string or null/undefined.");
        }
        if (url.origin != null && typeof url.origin !== "string") {
          throw new InvalidArgumentError("Invalid URL origin: the origin must be a string or null/undefined.");
        }
        if (!isHttpOrHttpsPrefixed(url.origin || url.protocol)) {
          throw new InvalidArgumentError("Invalid URL protocol: the URL must start with `http:` or `https:`.");
        }
        const port = url.port != null ? url.port : url.protocol === "https:" ? 443 : 80;
        let origin = url.origin != null ? url.origin : `${url.protocol || ""}//${url.hostname || ""}:${port}`;
        let path = url.path != null ? url.path : `${url.pathname || ""}${url.search || ""}`;
        if (origin[origin.length - 1] === "/") {
          origin = origin.slice(0, origin.length - 1);
        }
        if (path && path[0] !== "/") {
          path = `/${path}`;
        }
        return new URL(`${origin}${path}`);
      }
      if (!isHttpOrHttpsPrefixed(url.origin || url.protocol)) {
        throw new InvalidArgumentError("Invalid URL protocol: the URL must start with `http:` or `https:`.");
      }
      return url;
    }
    __name(parseURL, "parseURL");
    function parseOrigin(url) {
      url = parseURL(url);
      if (url.pathname !== "/" || url.search || url.hash) {
        throw new InvalidArgumentError("invalid url");
      }
      return url;
    }
    __name(parseOrigin, "parseOrigin");
    function getHostname(host) {
      if (host[0] === "[") {
        const idx2 = host.indexOf("]");
        assert(idx2 !== -1);
        return host.substring(1, idx2);
      }
      const idx = host.indexOf(":");
      if (idx === -1) return host;
      return host.substring(0, idx);
    }
    __name(getHostname, "getHostname");
    function getServerName(host) {
      if (!host) {
        return null;
      }
      assert(typeof host === "string");
      const servername = getHostname(host);
      if (net.isIP(servername)) {
        return "";
      }
      return servername;
    }
    __name(getServerName, "getServerName");
    function deepClone(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
    __name(deepClone, "deepClone");
    function isAsyncIterable(obj) {
      return !!(obj != null && typeof obj[Symbol.asyncIterator] === "function");
    }
    __name(isAsyncIterable, "isAsyncIterable");
    function isIterable(obj) {
      return !!(obj != null && (typeof obj[Symbol.iterator] === "function" || typeof obj[Symbol.asyncIterator] === "function"));
    }
    __name(isIterable, "isIterable");
    function hasSafeIterator(obj) {
      const prototype = Object.getPrototypeOf(obj);
      const ownIterator = Object.prototype.hasOwnProperty.call(obj, Symbol.iterator);
      return ownIterator || prototype != null && prototype !== Object.prototype && typeof obj[Symbol.iterator] === "function";
    }
    __name(hasSafeIterator, "hasSafeIterator");
    function bodyLength(body) {
      if (body == null) {
        return 0;
      } else if (isStream(body)) {
        const state = body._readableState;
        return state && state.objectMode === false && state.ended === true && Number.isFinite(state.length) ? state.length : null;
      } else if (isBlobLike(body)) {
        return body.size != null ? body.size : null;
      } else if (isBuffer(body)) {
        return body.byteLength;
      }
      return null;
    }
    __name(bodyLength, "bodyLength");
    function isDestroyed(body) {
      return body && !!(body.destroyed || body[kDestroyed] || stream.isDestroyed?.(body));
    }
    __name(isDestroyed, "isDestroyed");
    function destroy(stream2, err) {
      if (stream2 == null || !isStream(stream2) || isDestroyed(stream2)) {
        return;
      }
      if (typeof stream2.destroy === "function") {
        if (Object.getPrototypeOf(stream2).constructor === IncomingMessage) {
          stream2.socket = null;
        }
        stream2.destroy(err);
      } else if (err) {
        queueMicrotask(() => {
          stream2.emit("error", err);
        });
      }
      if (stream2.destroyed !== true) {
        stream2[kDestroyed] = true;
      }
    }
    __name(destroy, "destroy");
    var KEEPALIVE_TIMEOUT_EXPR = /timeout=(\d+)/;
    function parseKeepAliveTimeout(val) {
      const m = val.match(KEEPALIVE_TIMEOUT_EXPR);
      return m ? parseInt(m[1], 10) * 1e3 : null;
    }
    __name(parseKeepAliveTimeout, "parseKeepAliveTimeout");
    function headerNameToString(value) {
      return typeof value === "string" ? headerNameLowerCasedRecord[value] ?? value.toLowerCase() : tree.lookup(value) ?? value.toString("latin1").toLowerCase();
    }
    __name(headerNameToString, "headerNameToString");
    function bufferToLowerCasedHeaderName(value) {
      return tree.lookup(value) ?? value.toString("latin1").toLowerCase();
    }
    __name(bufferToLowerCasedHeaderName, "bufferToLowerCasedHeaderName");
    function parseHeaders(headers, obj) {
      if (obj === void 0) obj = {};
      for (let i = 0; i < headers.length; i += 2) {
        const key = headerNameToString(headers[i]);
        let val = obj[key];
        if (val !== void 0) {
          if (!Object.hasOwn(obj, key)) {
            const headersValue = typeof headers[i + 1] === "string" ? headers[i + 1] : Array.isArray(headers[i + 1]) ? headers[i + 1].map((x) => x.toString("latin1")) : headers[i + 1].toString("latin1");
            if (key === "__proto__") {
              Object.defineProperty(obj, key, {
                value: headersValue,
                enumerable: true,
                configurable: true,
                writable: true
              });
            } else {
              obj[key] = headersValue;
            }
          } else {
            if (typeof val === "string") {
              val = [val];
              obj[key] = val;
            }
            val.push(headers[i + 1].toString("latin1"));
          }
        } else {
          const headersValue = typeof headers[i + 1] === "string" ? headers[i + 1] : Array.isArray(headers[i + 1]) ? headers[i + 1].map((x) => x.toString("latin1")) : headers[i + 1].toString("latin1");
          obj[key] = headersValue;
        }
      }
      return obj;
    }
    __name(parseHeaders, "parseHeaders");
    function parseRawHeaders(headers) {
      const headersLength = headers.length;
      const ret = new Array(headersLength);
      let key;
      let val;
      for (let n = 0; n < headersLength; n += 2) {
        key = headers[n];
        val = headers[n + 1];
        typeof key !== "string" && (key = key.toString());
        typeof val !== "string" && (val = val.toString("latin1"));
        ret[n] = key;
        ret[n + 1] = val;
      }
      return ret;
    }
    __name(parseRawHeaders, "parseRawHeaders");
    function encodeRawHeaders(headers) {
      if (!Array.isArray(headers)) {
        throw new TypeError("expected headers to be an array");
      }
      return headers.map((x) => Buffer.from(x));
    }
    __name(encodeRawHeaders, "encodeRawHeaders");
    function isBuffer(buffer) {
      return buffer instanceof Uint8Array || Buffer.isBuffer(buffer);
    }
    __name(isBuffer, "isBuffer");
    function assertRequestHandler(handler, method, upgrade) {
      if (!handler || typeof handler !== "object") {
        throw new InvalidArgumentError("handler must be an object");
      }
      if (typeof handler.onRequestStart === "function") {
        return;
      }
      if (typeof handler.onConnect !== "function") {
        throw new InvalidArgumentError("invalid onConnect method");
      }
      if (typeof handler.onError !== "function") {
        throw new InvalidArgumentError("invalid onError method");
      }
      if (typeof handler.onBodySent !== "function" && handler.onBodySent !== void 0) {
        throw new InvalidArgumentError("invalid onBodySent method");
      }
      if (upgrade || method === "CONNECT") {
        if (typeof handler.onUpgrade !== "function") {
          throw new InvalidArgumentError("invalid onUpgrade method");
        }
      } else {
        if (typeof handler.onHeaders !== "function") {
          throw new InvalidArgumentError("invalid onHeaders method");
        }
        if (typeof handler.onData !== "function") {
          throw new InvalidArgumentError("invalid onData method");
        }
        if (typeof handler.onComplete !== "function") {
          throw new InvalidArgumentError("invalid onComplete method");
        }
      }
    }
    __name(assertRequestHandler, "assertRequestHandler");
    function isDisturbed(body) {
      return !!(body && (stream.isDisturbed(body) || body[kBodyUsed]));
    }
    __name(isDisturbed, "isDisturbed");
    function getSocketInfo(socket) {
      return {
        localAddress: socket.localAddress,
        localPort: socket.localPort,
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
        remoteFamily: socket.remoteFamily,
        timeout: socket.timeout,
        bytesWritten: socket.bytesWritten,
        bytesRead: socket.bytesRead
      };
    }
    __name(getSocketInfo, "getSocketInfo");
    function ReadableStreamFrom(iterable) {
      let iterator;
      return new ReadableStream(
        {
          start() {
            iterator = iterable[Symbol.asyncIterator]();
          },
          pull(controller) {
            return iterator.next().then(({ done, value }) => {
              if (done) {
                return queueMicrotask(() => {
                  controller.close();
                  controller.byobRequest?.respond(0);
                });
              } else {
                const buf = Buffer.isBuffer(value) ? value : Buffer.from(value);
                if (buf.byteLength) {
                  return controller.enqueue(new Uint8Array(buf));
                } else {
                  return this.pull(controller);
                }
              }
            });
          },
          cancel() {
            return iterator.return();
          },
          type: "bytes"
        }
      );
    }
    __name(ReadableStreamFrom, "ReadableStreamFrom");
    function isFormDataLike(object) {
      return object && typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && object[Symbol.toStringTag] === "FormData";
    }
    __name(isFormDataLike, "isFormDataLike");
    function addAbortListener(signal, listener) {
      if ("addEventListener" in signal) {
        signal.addEventListener("abort", listener, { once: true });
        return () => signal.removeEventListener("abort", listener);
      }
      signal.once("abort", listener);
      return () => signal.removeListener("abort", listener);
    }
    __name(addAbortListener, "addAbortListener");
    var validTokenChars = new Uint8Array([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0-15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16-31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32-47 (!"#$%&'()*+,-./)
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48-63 (0-9:;<=>?)
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64-79 (@A-O)
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80-95 (P-Z[\]^_)
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96-111 (`a-o)
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0,
      // 112-127 (p-z{|}~)
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 128-143
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 144-159
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 160-175
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 176-191
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 192-207
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 208-223
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 224-239
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
      // 240-255
    ]);
    function isTokenCharCode(c) {
      return validTokenChars[c] === 1;
    }
    __name(isTokenCharCode, "isTokenCharCode");
    var tokenRegExp = /^[\^_`a-zA-Z\-0-9!#$%&'*+.|~]+$/;
    function isValidHTTPToken(characters) {
      if (characters.length >= 12) return tokenRegExp.test(characters);
      if (characters.length === 0) return false;
      for (let i = 0; i < characters.length; i++) {
        if (validTokenChars[characters.charCodeAt(i)] !== 1) {
          return false;
        }
      }
      return true;
    }
    __name(isValidHTTPToken, "isValidHTTPToken");
    var headerCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
    function isValidHeaderValue(characters) {
      return !headerCharRegex.test(characters);
    }
    __name(isValidHeaderValue, "isValidHeaderValue");
    var rangeHeaderRegex = /^bytes (\d+)-(\d+)\/(\d+)?$/;
    function parseRangeHeader(range) {
      if (range == null || range === "") return { start: 0, end: null, size: null };
      const m = range ? range.match(rangeHeaderRegex) : null;
      return m ? {
        start: parseInt(m[1]),
        end: m[2] ? parseInt(m[2]) : null,
        size: m[3] ? parseInt(m[3]) : null
      } : null;
    }
    __name(parseRangeHeader, "parseRangeHeader");
    function addListener(obj, name, listener) {
      const listeners = obj[kListeners] ??= [];
      listeners.push([name, listener]);
      obj.on(name, listener);
      return obj;
    }
    __name(addListener, "addListener");
    function removeAllListeners(obj) {
      if (obj[kListeners] != null) {
        for (const [name, listener] of obj[kListeners]) {
          obj.removeListener(name, listener);
        }
        obj[kListeners] = null;
      }
      return obj;
    }
    __name(removeAllListeners, "removeAllListeners");
    function errorRequest(client, request, err) {
      try {
        request.onError(err);
        assert(request.aborted);
      } catch (err2) {
        client.emit("error", err2);
      }
    }
    __name(errorRequest, "errorRequest");
    var setupConnectTimeout = process.platform === "win32" ? (socketWeakRef, opts) => {
      if (!opts.timeout) {
        return noop;
      }
      let s1 = null;
      let s2 = null;
      const fastTimer = timers.setFastTimeout(() => {
        s1 = setImmediate(() => {
          s2 = setImmediate(() => onConnectTimeout(socketWeakRef.deref(), opts));
        });
      }, opts.timeout);
      return () => {
        timers.clearFastTimeout(fastTimer);
        clearImmediate(s1);
        clearImmediate(s2);
      };
    } : (socketWeakRef, opts) => {
      if (!opts.timeout) {
        return noop;
      }
      let s1 = null;
      const fastTimer = timers.setFastTimeout(() => {
        s1 = setImmediate(() => {
          onConnectTimeout(socketWeakRef.deref(), opts);
        });
      }, opts.timeout);
      return () => {
        timers.clearFastTimeout(fastTimer);
        clearImmediate(s1);
      };
    };
    function onConnectTimeout(socket, opts) {
      if (socket == null) {
        return;
      }
      let message = "Connect Timeout Error";
      if (Array.isArray(socket.autoSelectFamilyAttemptedAddresses)) {
        message += ` (attempted addresses: ${socket.autoSelectFamilyAttemptedAddresses.join(", ")},`;
      } else {
        message += ` (attempted address: ${opts.hostname}:${opts.port},`;
      }
      message += ` timeout: ${opts.timeout}ms)`;
      destroy(socket, new ConnectTimeoutError(message));
    }
    __name(onConnectTimeout, "onConnectTimeout");
    function getProtocolFromUrlString(urlString) {
      if (urlString[0] === "h" && urlString[1] === "t" && urlString[2] === "t" && urlString[3] === "p") {
        switch (urlString[4]) {
          case ":":
            return "http:";
          case "s":
            if (urlString[5] === ":") {
              return "https:";
            }
        }
      }
      return urlString.slice(0, urlString.indexOf(":") + 1);
    }
    __name(getProtocolFromUrlString, "getProtocolFromUrlString");
    var kEnumerableProperty = /* @__PURE__ */ Object.create(null);
    kEnumerableProperty.enumerable = true;
    var normalizedMethodRecordsBase = {
      delete: "DELETE",
      DELETE: "DELETE",
      get: "GET",
      GET: "GET",
      head: "HEAD",
      HEAD: "HEAD",
      options: "OPTIONS",
      OPTIONS: "OPTIONS",
      post: "POST",
      POST: "POST",
      put: "PUT",
      PUT: "PUT"
    };
    var normalizedMethodRecords = {
      ...normalizedMethodRecordsBase,
      patch: "patch",
      PATCH: "PATCH"
    };
    Object.setPrototypeOf(normalizedMethodRecordsBase, null);
    Object.setPrototypeOf(normalizedMethodRecords, null);
    module2.exports = {
      kEnumerableProperty,
      isDisturbed,
      isBlobLike,
      parseOrigin,
      parseURL,
      getServerName,
      isStream,
      isIterable,
      hasSafeIterator,
      isAsyncIterable,
      isDestroyed,
      headerNameToString,
      bufferToLowerCasedHeaderName,
      addListener,
      removeAllListeners,
      errorRequest,
      parseRawHeaders,
      encodeRawHeaders,
      parseHeaders,
      parseKeepAliveTimeout,
      destroy,
      bodyLength,
      deepClone,
      ReadableStreamFrom,
      isBuffer,
      assertRequestHandler,
      getSocketInfo,
      isFormDataLike,
      pathHasQueryOrFragment,
      serializePathWithQuery,
      addAbortListener,
      isValidHTTPToken,
      isValidHeaderValue,
      isTokenCharCode,
      parseRangeHeader,
      normalizedMethodRecordsBase,
      normalizedMethodRecords,
      isValidPort,
      isHttpOrHttpsPrefixed,
      nodeMajor,
      nodeMinor,
      safeHTTPMethods: Object.freeze(["GET", "HEAD", "OPTIONS", "TRACE"]),
      wrapRequestBody,
      setupConnectTimeout,
      getProtocolFromUrlString
    };
  }
});

// lib/handler/unwrap-handler.js
var require_unwrap_handler = __commonJS({
  "lib/handler/unwrap-handler.js"(exports2, module2) {
    "use strict";
    var { parseHeaders } = require_util();
    var { InvalidArgumentError } = require_errors();
    var kResume = /* @__PURE__ */ Symbol("resume");
    var UnwrapController = class {
      static {
        __name(this, "UnwrapController");
      }
      #paused = false;
      #reason = null;
      #aborted = false;
      #abort;
      [kResume] = null;
      constructor(abort) {
        this.#abort = abort;
      }
      pause() {
        this.#paused = true;
      }
      resume() {
        if (this.#paused) {
          this.#paused = false;
          this[kResume]?.();
        }
      }
      abort(reason) {
        if (!this.#aborted) {
          this.#aborted = true;
          this.#reason = reason;
          this.#abort(reason);
        }
      }
      get aborted() {
        return this.#aborted;
      }
      get reason() {
        return this.#reason;
      }
      get paused() {
        return this.#paused;
      }
    };
    module2.exports = class UnwrapHandler {
      static {
        __name(this, "UnwrapHandler");
      }
      #handler;
      #controller;
      constructor(handler) {
        this.#handler = handler;
      }
      static unwrap(handler) {
        return !handler.onRequestStart ? handler : new UnwrapHandler(handler);
      }
      onConnect(abort, context) {
        this.#controller = new UnwrapController(abort);
        this.#handler.onRequestStart?.(this.#controller, context);
      }
      onResponseStarted() {
        return this.#handler.onResponseStarted?.();
      }
      onUpgrade(statusCode, rawHeaders, socket) {
        this.#handler.onRequestUpgrade?.(this.#controller, statusCode, parseHeaders(rawHeaders), socket);
      }
      onHeaders(statusCode, rawHeaders, resume, statusMessage) {
        this.#controller[kResume] = resume;
        this.#handler.onResponseStart?.(this.#controller, statusCode, parseHeaders(rawHeaders), statusMessage);
        return !this.#controller.paused;
      }
      onData(data) {
        this.#handler.onResponseData?.(this.#controller, data);
        return !this.#controller.paused;
      }
      onComplete(rawTrailers) {
        this.#handler.onResponseEnd?.(this.#controller, parseHeaders(rawTrailers));
      }
      onError(err) {
        if (!this.#handler.onResponseError) {
          throw new InvalidArgumentError("invalid onError method");
        }
        this.#handler.onResponseError?.(this.#controller, err);
      }
    };
  }
});

// lib/dispatcher/dispatcher-base.js
var require_dispatcher_base = __commonJS({
  "lib/dispatcher/dispatcher-base.js"(exports2, module2) {
    "use strict";
    var Dispatcher2 = require_dispatcher();
    var UnwrapHandler = require_unwrap_handler();
    var {
      ClientDestroyedError,
      ClientClosedError,
      InvalidArgumentError
    } = require_errors();
    var { kDestroy, kClose, kClosed, kDestroyed, kDispatch } = require_symbols();
    var kOnDestroyed = /* @__PURE__ */ Symbol("onDestroyed");
    var kOnClosed = /* @__PURE__ */ Symbol("onClosed");
    var DispatcherBase = class extends Dispatcher2 {
      static {
        __name(this, "DispatcherBase");
      }
      /** @type {boolean} */
      [kDestroyed] = false;
      /** @type {Array<Function|null} */
      [kOnDestroyed] = null;
      /** @type {boolean} */
      [kClosed] = false;
      /** @type {Array<Function>|null} */
      [kOnClosed] = null;
      /** @returns {boolean} */
      get destroyed() {
        return this[kDestroyed];
      }
      /** @returns {boolean} */
      get closed() {
        return this[kClosed];
      }
      close(callback) {
        if (callback === void 0) {
          return new Promise((resolve, reject) => {
            this.close((err, data) => {
              return err ? reject(err) : resolve(data);
            });
          });
        }
        if (typeof callback !== "function") {
          throw new InvalidArgumentError("invalid callback");
        }
        if (this[kDestroyed]) {
          const err = new ClientDestroyedError();
          queueMicrotask(() => callback(err, null));
          return;
        }
        if (this[kClosed]) {
          if (this[kOnClosed]) {
            this[kOnClosed].push(callback);
          } else {
            queueMicrotask(() => callback(null, null));
          }
          return;
        }
        this[kClosed] = true;
        this[kOnClosed] ??= [];
        this[kOnClosed].push(callback);
        const onClosed = /* @__PURE__ */ __name(() => {
          const callbacks = this[kOnClosed];
          this[kOnClosed] = null;
          for (let i = 0; i < callbacks.length; i++) {
            callbacks[i](null, null);
          }
        }, "onClosed");
        this[kClose]().then(() => this.destroy()).then(() => queueMicrotask(onClosed));
      }
      destroy(err, callback) {
        if (typeof err === "function") {
          callback = err;
          err = null;
        }
        if (callback === void 0) {
          return new Promise((resolve, reject) => {
            this.destroy(err, (err2, data) => {
              return err2 ? reject(err2) : resolve(data);
            });
          });
        }
        if (typeof callback !== "function") {
          throw new InvalidArgumentError("invalid callback");
        }
        if (this[kDestroyed]) {
          if (this[kOnDestroyed]) {
            this[kOnDestroyed].push(callback);
          } else {
            queueMicrotask(() => callback(null, null));
          }
          return;
        }
        if (!err) {
          err = new ClientDestroyedError();
        }
        this[kDestroyed] = true;
        this[kOnDestroyed] ??= [];
        this[kOnDestroyed].push(callback);
        const onDestroyed = /* @__PURE__ */ __name(() => {
          const callbacks = this[kOnDestroyed];
          this[kOnDestroyed] = null;
          for (let i = 0; i < callbacks.length; i++) {
            callbacks[i](null, null);
          }
        }, "onDestroyed");
        this[kDestroy](err).then(() => queueMicrotask(onDestroyed));
      }
      dispatch(opts, handler) {
        if (!handler || typeof handler !== "object") {
          throw new InvalidArgumentError("handler must be an object");
        }
        handler = UnwrapHandler.unwrap(handler);
        try {
          if (!opts || typeof opts !== "object") {
            throw new InvalidArgumentError("opts must be an object.");
          }
          if (this[kDestroyed] || this[kOnDestroyed]) {
            throw new ClientDestroyedError();
          }
          if (this[kClosed]) {
            throw new ClientClosedError();
          }
          return this[kDispatch](opts, handler);
        } catch (err) {
          if (typeof handler.onError !== "function") {
            throw err;
          }
          handler.onError(err);
          return false;
        }
      }
    };
    module2.exports = DispatcherBase;
  }
});

// lib/util/stats.js
var require_stats = __commonJS({
  "lib/util/stats.js"(exports2, module2) {
    "use strict";
    var {
      kConnected,
      kPending,
      kRunning,
      kSize,
      kFree,
      kQueued
    } = require_symbols();
    var ClientStats = class {
      static {
        __name(this, "ClientStats");
      }
      constructor(client) {
        this.connected = client[kConnected];
        this.pending = client[kPending];
        this.running = client[kRunning];
        this.size = client[kSize];
      }
    };
    var PoolStats = class {
      static {
        __name(this, "PoolStats");
      }
      constructor(pool) {
        this.connected = pool[kConnected];
        this.free = pool[kFree];
        this.pending = pool[kPending];
        this.queued = pool[kQueued];
        this.running = pool[kRunning];
        this.size = pool[kSize];
      }
    };
    module2.exports = { ClientStats, PoolStats };
  }
});

// lib/dispatcher/fixed-queue.js
var require_fixed_queue = __commonJS({
  "lib/dispatcher/fixed-queue.js"(exports2, module2) {
    "use strict";
    var kSize = 2048;
    var kMask = kSize - 1;
    var FixedCircularBuffer = class {
      static {
        __name(this, "FixedCircularBuffer");
      }
      /** @type {number} */
      bottom = 0;
      /** @type {number} */
      top = 0;
      /** @type {Array<T|undefined>} */
      list = new Array(kSize).fill(void 0);
      /** @type {T|null} */
      next = null;
      /** @returns {boolean} */
      isEmpty() {
        return this.top === this.bottom;
      }
      /** @returns {boolean} */
      isFull() {
        return (this.top + 1 & kMask) === this.bottom;
      }
      /**
       * @param {T} data
       * @returns {void}
       */
      push(data) {
        this.list[this.top] = data;
        this.top = this.top + 1 & kMask;
      }
      /** @returns {T|null} */
      shift() {
        const nextItem = this.list[this.bottom];
        if (nextItem === void 0) {
          return null;
        }
        this.list[this.bottom] = void 0;
        this.bottom = this.bottom + 1 & kMask;
        return nextItem;
      }
    };
    module2.exports = class FixedQueue {
      static {
        __name(this, "FixedQueue");
      }
      constructor() {
        this.head = this.tail = new FixedCircularBuffer();
      }
      /** @returns {boolean} */
      isEmpty() {
        return this.head.isEmpty();
      }
      /** @param {T} data */
      push(data) {
        if (this.head.isFull()) {
          this.head = this.head.next = new FixedCircularBuffer();
        }
        this.head.push(data);
      }
      /** @returns {T|null} */
      shift() {
        const tail = this.tail;
        const next = tail.shift();
        if (tail.isEmpty() && tail.next !== null) {
          this.tail = tail.next;
          tail.next = null;
        }
        return next;
      }
    };
  }
});

// lib/dispatcher/pool-base.js
var require_pool_base = __commonJS({
  "lib/dispatcher/pool-base.js"(exports2, module2) {
    "use strict";
    var { PoolStats } = require_stats();
    var DispatcherBase = require_dispatcher_base();
    var FixedQueue = require_fixed_queue();
    var { kConnected, kSize, kRunning, kPending, kQueued, kBusy, kFree, kUrl, kClose, kDestroy, kDispatch } = require_symbols();
    var kClients = /* @__PURE__ */ Symbol("clients");
    var kNeedDrain = /* @__PURE__ */ Symbol("needDrain");
    var kQueue = /* @__PURE__ */ Symbol("queue");
    var kClosedResolve = /* @__PURE__ */ Symbol("closed resolve");
    var kOnDrain = /* @__PURE__ */ Symbol("onDrain");
    var kOnConnect = /* @__PURE__ */ Symbol("onConnect");
    var kOnDisconnect = /* @__PURE__ */ Symbol("onDisconnect");
    var kOnConnectionError = /* @__PURE__ */ Symbol("onConnectionError");
    var kGetDispatcher = /* @__PURE__ */ Symbol("get dispatcher");
    var kAddClient = /* @__PURE__ */ Symbol("add client");
    var kRemoveClient = /* @__PURE__ */ Symbol("remove client");
    var PoolBase = class extends DispatcherBase {
      static {
        __name(this, "PoolBase");
      }
      [kQueue] = new FixedQueue();
      [kQueued] = 0;
      [kClients] = [];
      [kNeedDrain] = false;
      [kOnDrain](client, origin, targets) {
        const queue = this[kQueue];
        let needDrain = false;
        while (!needDrain) {
          const item = queue.shift();
          if (!item) {
            break;
          }
          this[kQueued]--;
          needDrain = !client.dispatch(item.opts, item.handler);
        }
        client[kNeedDrain] = needDrain;
        if (!needDrain && this[kNeedDrain]) {
          this[kNeedDrain] = false;
          this.emit("drain", origin, [this, ...targets]);
        }
        if (this[kClosedResolve] && queue.isEmpty()) {
          const closeAll = [];
          for (let i = 0; i < this[kClients].length; i++) {
            const client2 = this[kClients][i];
            if (!client2.destroyed) {
              closeAll.push(client2.close());
            }
          }
          return Promise.all(closeAll).then(this[kClosedResolve]);
        }
      }
      [kOnConnect] = (origin, targets) => {
        this.emit("connect", origin, [this, ...targets]);
      };
      [kOnDisconnect] = (origin, targets, err) => {
        this.emit("disconnect", origin, [this, ...targets], err);
      };
      [kOnConnectionError] = (origin, targets, err) => {
        this.emit("connectionError", origin, [this, ...targets], err);
      };
      get [kBusy]() {
        return this[kNeedDrain];
      }
      get [kConnected]() {
        let ret = 0;
        for (const { [kConnected]: connected } of this[kClients]) {
          ret += connected;
        }
        return ret;
      }
      get [kFree]() {
        let ret = 0;
        for (const { [kConnected]: connected, [kNeedDrain]: needDrain } of this[kClients]) {
          ret += connected && !needDrain;
        }
        return ret;
      }
      get [kPending]() {
        let ret = this[kQueued];
        for (const { [kPending]: pending } of this[kClients]) {
          ret += pending;
        }
        return ret;
      }
      get [kRunning]() {
        let ret = 0;
        for (const { [kRunning]: running } of this[kClients]) {
          ret += running;
        }
        return ret;
      }
      get [kSize]() {
        let ret = this[kQueued];
        for (const { [kSize]: size } of this[kClients]) {
          ret += size;
        }
        return ret;
      }
      get stats() {
        return new PoolStats(this);
      }
      [kClose]() {
        if (this[kQueue].isEmpty()) {
          const closeAll = [];
          for (let i = 0; i < this[kClients].length; i++) {
            const client = this[kClients][i];
            if (!client.destroyed) {
              closeAll.push(client.close());
            }
          }
          return Promise.all(closeAll);
        } else {
          return new Promise((resolve) => {
            this[kClosedResolve] = resolve;
          });
        }
      }
      [kDestroy](err) {
        while (true) {
          const item = this[kQueue].shift();
          if (!item) {
            break;
          }
          item.handler.onError(err);
        }
        const destroyAll = new Array(this[kClients].length);
        for (let i = 0; i < this[kClients].length; i++) {
          destroyAll[i] = this[kClients][i].destroy(err);
        }
        return Promise.all(destroyAll);
      }
      [kDispatch](opts, handler) {
        const dispatcher = this[kGetDispatcher]();
        if (!dispatcher) {
          this[kNeedDrain] = true;
          this[kQueue].push({ opts, handler });
          this[kQueued]++;
        } else if (!dispatcher.dispatch(opts, handler)) {
          dispatcher[kNeedDrain] = true;
          this[kNeedDrain] = !this[kGetDispatcher]();
        }
        return !this[kNeedDrain];
      }
      [kAddClient](client) {
        client.on("drain", this[kOnDrain].bind(this, client)).on("connect", this[kOnConnect]).on("disconnect", this[kOnDisconnect]).on("connectionError", this[kOnConnectionError]);
        this[kClients].push(client);
        if (this[kNeedDrain]) {
          queueMicrotask(() => {
            if (this[kNeedDrain]) {
              this[kOnDrain](client, client[kUrl], [client, this]);
            }
          });
        }
        return this;
      }
      [kRemoveClient](client) {
        client.close(() => {
          const idx = this[kClients].indexOf(client);
          if (idx !== -1) {
            this[kClients].splice(idx, 1);
          }
        });
        this[kNeedDrain] = this[kClients].some((dispatcher) => !dispatcher[kNeedDrain] && dispatcher.closed !== true && dispatcher.destroyed !== true);
      }
    };
    module2.exports = {
      PoolBase,
      kClients,
      kNeedDrain,
      kAddClient,
      kRemoveClient,
      kGetDispatcher
    };
  }
});

// lib/core/diagnostics.js
var require_diagnostics = __commonJS({
  "lib/core/diagnostics.js"(exports2, module2) {
    "use strict";
    var diagnosticsChannel = require("node:diagnostics_channel");
    var util = require("node:util");
    var undiciDebugLog = util.debuglog("undici");
    var fetchDebuglog = util.debuglog("fetch");
    var websocketDebuglog = util.debuglog("websocket");
    var channels = {
      // Client
      beforeConnect: diagnosticsChannel.channel("undici:client:beforeConnect"),
      connected: diagnosticsChannel.channel("undici:client:connected"),
      connectError: diagnosticsChannel.channel("undici:client:connectError"),
      sendHeaders: diagnosticsChannel.channel("undici:client:sendHeaders"),
      // Request
      create: diagnosticsChannel.channel("undici:request:create"),
      bodySent: diagnosticsChannel.channel("undici:request:bodySent"),
      bodyChunkSent: diagnosticsChannel.channel("undici:request:bodyChunkSent"),
      bodyChunkReceived: diagnosticsChannel.channel("undici:request:bodyChunkReceived"),
      headers: diagnosticsChannel.channel("undici:request:headers"),
      trailers: diagnosticsChannel.channel("undici:request:trailers"),
      error: diagnosticsChannel.channel("undici:request:error"),
      // WebSocket
      open: diagnosticsChannel.channel("undici:websocket:open"),
      close: diagnosticsChannel.channel("undici:websocket:close"),
      socketError: diagnosticsChannel.channel("undici:websocket:socket_error"),
      ping: diagnosticsChannel.channel("undici:websocket:ping"),
      pong: diagnosticsChannel.channel("undici:websocket:pong"),
      // ProxyAgent
      proxyConnected: diagnosticsChannel.channel("undici:proxy:connected")
    };
    var isTrackingClientEvents = false;
    function trackClientEvents(debugLog = undiciDebugLog) {
      if (isTrackingClientEvents) {
        return;
      }
      if (channels.beforeConnect.hasSubscribers || channels.connected.hasSubscribers || channels.connectError.hasSubscribers || channels.sendHeaders.hasSubscribers) {
        isTrackingClientEvents = true;
        return;
      }
      isTrackingClientEvents = true;
      diagnosticsChannel.subscribe(
        "undici:client:beforeConnect",
        (evt) => {
          const {
            connectParams: { version, protocol, port, host }
          } = evt;
          debugLog(
            "connecting to %s%s using %s%s",
            host,
            port ? `:${port}` : "",
            protocol,
            version
          );
        }
      );
      diagnosticsChannel.subscribe(
        "undici:client:connected",
        (evt) => {
          const {
            connectParams: { version, protocol, port, host }
          } = evt;
          debugLog(
            "connected to %s%s using %s%s",
            host,
            port ? `:${port}` : "",
            protocol,
            version
          );
        }
      );
      diagnosticsChannel.subscribe(
        "undici:client:connectError",
        (evt) => {
          const {
            connectParams: { version, protocol, port, host },
            error
          } = evt;
          debugLog(
            "connection to %s%s using %s%s errored - %s",
            host,
            port ? `:${port}` : "",
            protocol,
            version,
            error.message
          );
        }
      );
      diagnosticsChannel.subscribe(
        "undici:client:sendHeaders",
        (evt) => {
          const {
            request: { method, path, origin }
          } = evt;
          debugLog("sending request to %s %s%s", method, origin, path);
        }
      );
    }
    __name(trackClientEvents, "trackClientEvents");
    var isTrackingRequestEvents = false;
    function trackRequestEvents(debugLog = undiciDebugLog) {
      if (isTrackingRequestEvents) {
        return;
      }
      if (channels.headers.hasSubscribers || channels.trailers.hasSubscribers || channels.error.hasSubscribers) {
        isTrackingRequestEvents = true;
        return;
      }
      isTrackingRequestEvents = true;
      diagnosticsChannel.subscribe(
        "undici:request:headers",
        (evt) => {
          const {
            request: { method, path, origin },
            response: { statusCode }
          } = evt;
          debugLog(
            "received response to %s %s%s - HTTP %d",
            method,
            origin,
            path,
            statusCode
          );
        }
      );
      diagnosticsChannel.subscribe(
        "undici:request:trailers",
        (evt) => {
          const {
            request: { method, path, origin }
          } = evt;
          debugLog("trailers received from %s %s%s", method, origin, path);
        }
      );
      diagnosticsChannel.subscribe(
        "undici:request:error",
        (evt) => {
          const {
            request: { method, path, origin },
            error
          } = evt;
          debugLog(
            "request to %s %s%s errored - %s",
            method,
            origin,
            path,
            error.message
          );
        }
      );
    }
    __name(trackRequestEvents, "trackRequestEvents");
    var isTrackingWebSocketEvents = false;
    function trackWebSocketEvents(debugLog = websocketDebuglog) {
      if (isTrackingWebSocketEvents) {
        return;
      }
      if (channels.open.hasSubscribers || channels.close.hasSubscribers || channels.socketError.hasSubscribers || channels.ping.hasSubscribers || channels.pong.hasSubscribers) {
        isTrackingWebSocketEvents = true;
        return;
      }
      isTrackingWebSocketEvents = true;
      diagnosticsChannel.subscribe(
        "undici:websocket:open",
        (evt) => {
          if (evt.address != null) {
            const { address, port } = evt.address;
            debugLog("connection opened %s%s", address, port ? `:${port}` : "");
          } else {
            debugLog("connection opened");
          }
        }
      );
      diagnosticsChannel.subscribe(
        "undici:websocket:close",
        (evt) => {
          const { websocket, code, reason } = evt;
          debugLog(
            "closed connection to %s - %s %s",
            websocket.url,
            code,
            reason
          );
        }
      );
      diagnosticsChannel.subscribe(
        "undici:websocket:socket_error",
        (err) => {
          debugLog("connection errored - %s", err.message);
        }
      );
      diagnosticsChannel.subscribe(
        "undici:websocket:ping",
        (evt) => {
          debugLog("ping received");
        }
      );
      diagnosticsChannel.subscribe(
        "undici:websocket:pong",
        (evt) => {
          debugLog("pong received");
        }
      );
    }
    __name(trackWebSocketEvents, "trackWebSocketEvents");
    if (undiciDebugLog.enabled || fetchDebuglog.enabled) {
      trackClientEvents(fetchDebuglog.enabled ? fetchDebuglog : undiciDebugLog);
      trackRequestEvents(fetchDebuglog.enabled ? fetchDebuglog : undiciDebugLog);
    }
    if (websocketDebuglog.enabled) {
      trackClientEvents(undiciDebugLog.enabled ? undiciDebugLog : websocketDebuglog);
      trackWebSocketEvents(websocketDebuglog);
    }
    module2.exports = {
      channels
    };
  }
});

// lib/core/request.js
var require_request = __commonJS({
  "lib/core/request.js"(exports2, module2) {
    "use strict";
    var {
      InvalidArgumentError,
      NotSupportedError
    } = require_errors();
    var assert = require("node:assert");
    var {
      isValidHTTPToken,
      isValidHeaderValue,
      isStream,
      destroy,
      isBuffer,
      isFormDataLike,
      isIterable,
      hasSafeIterator,
      isBlobLike,
      serializePathWithQuery,
      assertRequestHandler,
      getServerName,
      normalizedMethodRecords,
      getProtocolFromUrlString
    } = require_util();
    var { channels } = require_diagnostics();
    var { headerNameLowerCasedRecord } = require_constants();
    var invalidPathRegex = /[^\u0021-\u00ff]/;
    var kHandler = /* @__PURE__ */ Symbol("handler");
    var Request = class {
      static {
        __name(this, "Request");
      }
      constructor(origin, {
        path,
        method,
        body,
        headers,
        query,
        idempotent,
        blocking,
        upgrade,
        headersTimeout,
        bodyTimeout,
        reset,
        expectContinue,
        servername,
        throwOnError,
        maxRedirections,
        typeOfService
      }, handler) {
        if (typeof path !== "string") {
          throw new InvalidArgumentError("path must be a string");
        } else if (path[0] !== "/" && !(path.startsWith("http://") || path.startsWith("https://")) && method !== "CONNECT") {
          throw new InvalidArgumentError("path must be an absolute URL or start with a slash");
        } else if (invalidPathRegex.test(path)) {
          throw new InvalidArgumentError("invalid request path");
        }
        if (typeof method !== "string") {
          throw new InvalidArgumentError("method must be a string");
        } else if (normalizedMethodRecords[method] === void 0 && !isValidHTTPToken(method)) {
          throw new InvalidArgumentError("invalid request method");
        }
        if (upgrade && typeof upgrade !== "string") {
          throw new InvalidArgumentError("upgrade must be a string");
        }
        if (upgrade && !isValidHeaderValue(upgrade)) {
          throw new InvalidArgumentError("invalid upgrade header");
        }
        if (headersTimeout != null && (!Number.isFinite(headersTimeout) || headersTimeout < 0)) {
          throw new InvalidArgumentError("invalid headersTimeout");
        }
        if (bodyTimeout != null && (!Number.isFinite(bodyTimeout) || bodyTimeout < 0)) {
          throw new InvalidArgumentError("invalid bodyTimeout");
        }
        if (reset != null && typeof reset !== "boolean") {
          throw new InvalidArgumentError("invalid reset");
        }
        if (expectContinue != null && typeof expectContinue !== "boolean") {
          throw new InvalidArgumentError("invalid expectContinue");
        }
        if (throwOnError != null) {
          throw new InvalidArgumentError("invalid throwOnError");
        }
        if (maxRedirections != null && maxRedirections !== 0) {
          throw new InvalidArgumentError("maxRedirections is not supported, use the redirect interceptor");
        }
        if (typeOfService != null && (!Number.isInteger(typeOfService) || typeOfService < 0 || typeOfService > 255)) {
          throw new InvalidArgumentError("typeOfService must be an integer between 0 and 255");
        }
        this.headersTimeout = headersTimeout;
        this.bodyTimeout = bodyTimeout;
        this.method = method;
        this.typeOfService = typeOfService ?? 0;
        this.abort = null;
        if (body == null) {
          this.body = null;
        } else if (isStream(body)) {
          this.body = body;
          const rState = this.body._readableState;
          if (!rState || !rState.autoDestroy) {
            this.endHandler = /* @__PURE__ */ __name(function autoDestroy() {
              destroy(this);
            }, "autoDestroy");
            this.body.on("end", this.endHandler);
          }
          this.errorHandler = (err) => {
            if (this.abort) {
              this.abort(err);
            } else {
              this.error = err;
            }
          };
          this.body.on("error", this.errorHandler);
        } else if (isBuffer(body)) {
          this.body = body.byteLength ? body : null;
        } else if (ArrayBuffer.isView(body)) {
          this.body = body.buffer.byteLength ? Buffer.from(body.buffer, body.byteOffset, body.byteLength) : null;
        } else if (body instanceof ArrayBuffer) {
          this.body = body.byteLength ? Buffer.from(body) : null;
        } else if (typeof body === "string") {
          this.body = body.length ? Buffer.from(body) : null;
        } else if (isFormDataLike(body) || isIterable(body) || isBlobLike(body)) {
          this.body = body;
        } else {
          throw new InvalidArgumentError("body must be a string, a Buffer, a Readable stream, an iterable, or an async iterable");
        }
        this.completed = false;
        this.aborted = false;
        this.upgrade = upgrade || null;
        this.path = query ? serializePathWithQuery(path, query) : path;
        this.origin = origin;
        this.protocol = getProtocolFromUrlString(origin);
        this.idempotent = idempotent == null ? method === "HEAD" || method === "GET" : idempotent;
        this.blocking = blocking ?? this.method !== "HEAD";
        this.reset = reset == null ? null : reset;
        this.host = null;
        this.contentLength = null;
        this.contentType = null;
        this.headers = [];
        this.expectContinue = expectContinue != null ? expectContinue : false;
        if (Array.isArray(headers)) {
          if (headers.length % 2 !== 0) {
            throw new InvalidArgumentError("headers array must be even");
          }
          for (let i = 0; i < headers.length; i += 2) {
            processHeader(this, headers[i], headers[i + 1]);
          }
        } else if (headers && typeof headers === "object") {
          if (hasSafeIterator(headers)) {
            for (const header of headers) {
              if (!Array.isArray(header) || header.length !== 2) {
                throw new InvalidArgumentError("headers must be in key-value pair format");
              }
              processHeader(this, header[0], header[1]);
            }
          } else {
            const keys = Object.keys(headers);
            for (let i = 0; i < keys.length; ++i) {
              processHeader(this, keys[i], headers[keys[i]]);
            }
          }
        } else if (headers != null) {
          throw new InvalidArgumentError("headers must be an object or an array");
        }
        assertRequestHandler(handler, method, upgrade);
        this.servername = servername || getServerName(this.host) || null;
        this[kHandler] = handler;
        if (channels.create.hasSubscribers) {
          channels.create.publish({ request: this });
        }
      }
      onBodySent(chunk) {
        if (channels.bodyChunkSent.hasSubscribers) {
          channels.bodyChunkSent.publish({ request: this, chunk });
        }
        if (this[kHandler].onBodySent) {
          try {
            return this[kHandler].onBodySent(chunk);
          } catch (err) {
            this.abort(err);
          }
        }
      }
      onRequestSent() {
        if (channels.bodySent.hasSubscribers) {
          channels.bodySent.publish({ request: this });
        }
        if (this[kHandler].onRequestSent) {
          try {
            return this[kHandler].onRequestSent();
          } catch (err) {
            this.abort(err);
          }
        }
      }
      onConnect(abort) {
        assert(!this.aborted);
        assert(!this.completed);
        if (this.error) {
          abort(this.error);
        } else {
          this.abort = abort;
          return this[kHandler].onConnect(abort);
        }
      }
      onResponseStarted() {
        return this[kHandler].onResponseStarted?.();
      }
      onHeaders(statusCode, headers, resume, statusText) {
        assert(!this.aborted);
        assert(!this.completed);
        if (channels.headers.hasSubscribers) {
          channels.headers.publish({ request: this, response: { statusCode, headers, statusText } });
        }
        try {
          return this[kHandler].onHeaders(statusCode, headers, resume, statusText);
        } catch (err) {
          this.abort(err);
        }
      }
      onData(chunk) {
        assert(!this.aborted);
        assert(!this.completed);
        if (channels.bodyChunkReceived.hasSubscribers) {
          channels.bodyChunkReceived.publish({ request: this, chunk });
        }
        try {
          return this[kHandler].onData(chunk);
        } catch (err) {
          this.abort(err);
          return false;
        }
      }
      onUpgrade(statusCode, headers, socket) {
        assert(!this.aborted);
        assert(!this.completed);
        return this[kHandler].onUpgrade(statusCode, headers, socket);
      }
      onComplete(trailers) {
        this.onFinally();
        assert(!this.aborted);
        assert(!this.completed);
        this.completed = true;
        if (channels.trailers.hasSubscribers) {
          channels.trailers.publish({ request: this, trailers });
        }
        try {
          return this[kHandler].onComplete(trailers);
        } catch (err) {
          this.onError(err);
        }
      }
      onError(error) {
        this.onFinally();
        if (channels.error.hasSubscribers) {
          channels.error.publish({ request: this, error });
        }
        if (this.aborted) {
          return;
        }
        this.aborted = true;
        return this[kHandler].onError(error);
      }
      onFinally() {
        if (this.errorHandler) {
          this.body.off("error", this.errorHandler);
          this.errorHandler = null;
        }
        if (this.endHandler) {
          this.body.off("end", this.endHandler);
          this.endHandler = null;
        }
      }
      addHeader(key, value) {
        processHeader(this, key, value);
        return this;
      }
    };
    function processHeader(request, key, val) {
      if (val && (typeof val === "object" && !Array.isArray(val))) {
        throw new InvalidArgumentError(`invalid ${key} header`);
      } else if (val === void 0) {
        return;
      }
      let headerName = headerNameLowerCasedRecord[key];
      if (headerName === void 0) {
        headerName = key.toLowerCase();
        if (headerNameLowerCasedRecord[headerName] === void 0 && !isValidHTTPToken(headerName)) {
          throw new InvalidArgumentError("invalid header key");
        }
      }
      if (Array.isArray(val)) {
        const arr = [];
        for (let i = 0; i < val.length; i++) {
          if (typeof val[i] === "string") {
            if (!isValidHeaderValue(val[i])) {
              throw new InvalidArgumentError(`invalid ${key} header`);
            }
            arr.push(val[i]);
          } else if (val[i] === null) {
            arr.push("");
          } else if (typeof val[i] === "object") {
            throw new InvalidArgumentError(`invalid ${key} header`);
          } else {
            arr.push(`${val[i]}`);
          }
        }
        val = arr;
      } else if (typeof val === "string") {
        if (!isValidHeaderValue(val)) {
          throw new InvalidArgumentError(`invalid ${key} header`);
        }
      } else if (val === null) {
        val = "";
      } else {
        val = `${val}`;
      }
      if (headerName === "host") {
        if (request.host !== null) {
          throw new InvalidArgumentError("duplicate host header");
        }
        if (typeof val !== "string") {
          throw new InvalidArgumentError("invalid host header");
        }
        request.host = val;
      } else if (headerName === "content-length") {
        if (request.contentLength !== null) {
          throw new InvalidArgumentError("duplicate content-length header");
        }
        request.contentLength = parseInt(val, 10);
        if (!Number.isFinite(request.contentLength)) {
          throw new InvalidArgumentError("invalid content-length header");
        }
      } else if (request.contentType === null && headerName === "content-type") {
        request.contentType = val;
        request.headers.push(key, val);
      } else if (headerName === "transfer-encoding" || headerName === "keep-alive" || headerName === "upgrade") {
        throw new InvalidArgumentError(`invalid ${headerName} header`);
      } else if (headerName === "connection") {
        const value = typeof val === "string" ? val : null;
        if (value === null) {
          throw new InvalidArgumentError("invalid connection header");
        }
        for (const token of value.toLowerCase().split(",")) {
          const trimmed = token.trim();
          if (!isValidHTTPToken(trimmed)) {
            throw new InvalidArgumentError("invalid connection header");
          }
          if (trimmed === "close") {
            request.reset = true;
          }
        }
      } else if (headerName === "expect") {
        throw new NotSupportedError("expect header not supported");
      } else {
        request.headers.push(key, val);
      }
    }
    __name(processHeader, "processHeader");
    module2.exports = Request;
  }
});

// lib/core/connect.js
var require_connect = __commonJS({
  "lib/core/connect.js"(exports2, module2) {
    "use strict";
    var net = require("node:net");
    var assert = require("node:assert");
    var util = require_util();
    var { InvalidArgumentError } = require_errors();
    var tls;
    var SessionCache = class WeakSessionCache {
      static {
        __name(this, "WeakSessionCache");
      }
      constructor(maxCachedSessions) {
        this._maxCachedSessions = maxCachedSessions;
        this._sessionCache = /* @__PURE__ */ new Map();
        this._sessionRegistry = new FinalizationRegistry((key) => {
          if (this._sessionCache.size < this._maxCachedSessions) {
            return;
          }
          const ref = this._sessionCache.get(key);
          if (ref !== void 0 && ref.deref() === void 0) {
            this._sessionCache.delete(key);
          }
        });
      }
      get(sessionKey) {
        const ref = this._sessionCache.get(sessionKey);
        return ref ? ref.deref() : null;
      }
      set(sessionKey, session) {
        if (this._maxCachedSessions === 0) {
          return;
        }
        this._sessionCache.set(sessionKey, new WeakRef(session));
        this._sessionRegistry.register(session, sessionKey);
      }
    };
    function buildConnector({ allowH2, useH2c, maxCachedSessions, socketPath, timeout, session: customSession, ...opts }) {
      if (maxCachedSessions != null && (!Number.isInteger(maxCachedSessions) || maxCachedSessions < 0)) {
        throw new InvalidArgumentError("maxCachedSessions must be a positive integer or zero");
      }
      const options = { path: socketPath, ...opts };
      const sessionCache = new SessionCache(maxCachedSessions == null ? 100 : maxCachedSessions);
      timeout = timeout == null ? 1e4 : timeout;
      allowH2 = allowH2 != null ? allowH2 : false;
      return /* @__PURE__ */ __name(function connect({ hostname, host, protocol, port, servername, localAddress, httpSocket }, callback) {
        let socket;
        if (protocol === "https:") {
          if (!tls) {
            tls = require("node:tls");
          }
          servername = servername || options.servername || util.getServerName(host) || null;
          const sessionKey = servername || hostname;
          assert(sessionKey);
          const session = customSession || sessionCache.get(sessionKey) || null;
          port = port || 443;
          socket = tls.connect({
            highWaterMark: 16384,
            // TLS in node can't have bigger HWM anyway...
            ...options,
            servername,
            session,
            localAddress,
            ALPNProtocols: allowH2 ? ["http/1.1", "h2"] : ["http/1.1"],
            socket: httpSocket,
            // upgrade socket connection
            port,
            host: hostname
          });
          socket.on("session", function(session2) {
            sessionCache.set(sessionKey, session2);
          });
        } else {
          assert(!httpSocket, "httpSocket can only be sent on TLS update");
          port = port || 80;
          socket = net.connect({
            highWaterMark: 64 * 1024,
            // Same as nodejs fs streams.
            ...options,
            localAddress,
            port,
            host: hostname
          });
          if (useH2c === true) {
            socket.alpnProtocol = "h2";
          }
        }
        if (options.keepAlive == null || options.keepAlive) {
          const keepAliveInitialDelay = options.keepAliveInitialDelay === void 0 ? 6e4 : options.keepAliveInitialDelay;
          socket.setKeepAlive(true, keepAliveInitialDelay);
        }
        const clearConnectTimeout = util.setupConnectTimeout(new WeakRef(socket), { timeout, hostname, port });
        socket.setNoDelay(true).once(protocol === "https:" ? "secureConnect" : "connect", function() {
          queueMicrotask(clearConnectTimeout);
          if (callback) {
            const cb = callback;
            callback = null;
            cb(null, this);
          }
        }).on("error", function(err) {
          queueMicrotask(clearConnectTimeout);
          if (callback) {
            const cb = callback;
            callback = null;
            cb(err);
          }
        });
        return socket;
      }, "connect");
    }
    __name(buildConnector, "buildConnector");
    module2.exports = buildConnector;
  }
});

// lib/llhttp/utils.js
var require_utils = __commonJS({
  "lib/llhttp/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.enumToMap = enumToMap;
    function enumToMap(obj, filter = [], exceptions = []) {
      const emptyFilter = (filter?.length ?? 0) === 0;
      const emptyExceptions = (exceptions?.length ?? 0) === 0;
      return Object.fromEntries(Object.entries(obj).filter(([, value]) => {
        return typeof value === "number" && (emptyFilter || filter.includes(value)) && (emptyExceptions || !exceptions.includes(value));
      }));
    }
    __name(enumToMap, "enumToMap");
  }
});

// lib/llhttp/constants.js
var require_constants2 = __commonJS({
  "lib/llhttp/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SPECIAL_HEADERS = exports2.MINOR = exports2.MAJOR = exports2.HTAB_SP_VCHAR_OBS_TEXT = exports2.QUOTED_STRING = exports2.CONNECTION_TOKEN_CHARS = exports2.HEADER_CHARS = exports2.TOKEN = exports2.HEX = exports2.URL_CHAR = exports2.USERINFO_CHARS = exports2.MARK = exports2.ALPHANUM = exports2.NUM = exports2.HEX_MAP = exports2.NUM_MAP = exports2.ALPHA = exports2.STATUSES_HTTP = exports2.H_METHOD_MAP = exports2.METHOD_MAP = exports2.METHODS_RTSP = exports2.METHODS_ICE = exports2.METHODS_HTTP = exports2.HEADER_STATE = exports2.FINISH = exports2.STATUSES = exports2.METHODS = exports2.LENIENT_FLAGS = exports2.FLAGS = exports2.TYPE = exports2.ERROR = void 0;
    var utils_1 = require_utils();
    exports2.ERROR = {
      OK: 0,
      INTERNAL: 1,
      STRICT: 2,
      CR_EXPECTED: 25,
      LF_EXPECTED: 3,
      UNEXPECTED_CONTENT_LENGTH: 4,
      UNEXPECTED_SPACE: 30,
      CLOSED_CONNECTION: 5,
      INVALID_METHOD: 6,
      INVALID_URL: 7,
      INVALID_CONSTANT: 8,
      INVALID_VERSION: 9,
      INVALID_HEADER_TOKEN: 10,
      INVALID_CONTENT_LENGTH: 11,
      INVALID_CHUNK_SIZE: 12,
      INVALID_STATUS: 13,
      INVALID_EOF_STATE: 14,
      INVALID_TRANSFER_ENCODING: 15,
      CB_MESSAGE_BEGIN: 16,
      CB_HEADERS_COMPLETE: 17,
      CB_MESSAGE_COMPLETE: 18,
      CB_CHUNK_HEADER: 19,
      CB_CHUNK_COMPLETE: 20,
      PAUSED: 21,
      PAUSED_UPGRADE: 22,
      PAUSED_H2_UPGRADE: 23,
      USER: 24,
      CB_URL_COMPLETE: 26,
      CB_STATUS_COMPLETE: 27,
      CB_METHOD_COMPLETE: 32,
      CB_VERSION_COMPLETE: 33,
      CB_HEADER_FIELD_COMPLETE: 28,
      CB_HEADER_VALUE_COMPLETE: 29,
      CB_CHUNK_EXTENSION_NAME_COMPLETE: 34,
      CB_CHUNK_EXTENSION_VALUE_COMPLETE: 35,
      CB_RESET: 31,
      CB_PROTOCOL_COMPLETE: 38
    };
    exports2.TYPE = {
      BOTH: 0,
      // default
      REQUEST: 1,
      RESPONSE: 2
    };
    exports2.FLAGS = {
      CONNECTION_KEEP_ALIVE: 1 << 0,
      CONNECTION_CLOSE: 1 << 1,
      CONNECTION_UPGRADE: 1 << 2,
      CHUNKED: 1 << 3,
      UPGRADE: 1 << 4,
      CONTENT_LENGTH: 1 << 5,
      SKIPBODY: 1 << 6,
      TRAILING: 1 << 7,
      // 1 << 8 is unused
      TRANSFER_ENCODING: 1 << 9
    };
    exports2.LENIENT_FLAGS = {
      HEADERS: 1 << 0,
      CHUNKED_LENGTH: 1 << 1,
      KEEP_ALIVE: 1 << 2,
      TRANSFER_ENCODING: 1 << 3,
      VERSION: 1 << 4,
      DATA_AFTER_CLOSE: 1 << 5,
      OPTIONAL_LF_AFTER_CR: 1 << 6,
      OPTIONAL_CRLF_AFTER_CHUNK: 1 << 7,
      OPTIONAL_CR_BEFORE_LF: 1 << 8,
      SPACES_AFTER_CHUNK_SIZE: 1 << 9
    };
    exports2.METHODS = {
      "DELETE": 0,
      "GET": 1,
      "HEAD": 2,
      "POST": 3,
      "PUT": 4,
      /* pathological */
      "CONNECT": 5,
      "OPTIONS": 6,
      "TRACE": 7,
      /* WebDAV */
      "COPY": 8,
      "LOCK": 9,
      "MKCOL": 10,
      "MOVE": 11,
      "PROPFIND": 12,
      "PROPPATCH": 13,
      "SEARCH": 14,
      "UNLOCK": 15,
      "BIND": 16,
      "REBIND": 17,
      "UNBIND": 18,
      "ACL": 19,
      /* subversion */
      "REPORT": 20,
      "MKACTIVITY": 21,
      "CHECKOUT": 22,
      "MERGE": 23,
      /* upnp */
      "M-SEARCH": 24,
      "NOTIFY": 25,
      "SUBSCRIBE": 26,
      "UNSUBSCRIBE": 27,
      /* RFC-5789 */
      "PATCH": 28,
      "PURGE": 29,
      /* CalDAV */
      "MKCALENDAR": 30,
      /* RFC-2068, section 19.6.1.2 */
      "LINK": 31,
      "UNLINK": 32,
      /* icecast */
      "SOURCE": 33,
      /* RFC-7540, section 11.6 */
      "PRI": 34,
      /* RFC-2326 RTSP */
      "DESCRIBE": 35,
      "ANNOUNCE": 36,
      "SETUP": 37,
      "PLAY": 38,
      "PAUSE": 39,
      "TEARDOWN": 40,
      "GET_PARAMETER": 41,
      "SET_PARAMETER": 42,
      "REDIRECT": 43,
      "RECORD": 44,
      /* RAOP */
      "FLUSH": 45,
      /* DRAFT https://www.ietf.org/archive/id/draft-ietf-httpbis-safe-method-w-body-02.html */
      "QUERY": 46
    };
    exports2.STATUSES = {
      CONTINUE: 100,
      SWITCHING_PROTOCOLS: 101,
      PROCESSING: 102,
      EARLY_HINTS: 103,
      RESPONSE_IS_STALE: 110,
      // Unofficial
      REVALIDATION_FAILED: 111,
      // Unofficial
      DISCONNECTED_OPERATION: 112,
      // Unofficial
      HEURISTIC_EXPIRATION: 113,
      // Unofficial
      MISCELLANEOUS_WARNING: 199,
      // Unofficial
      OK: 200,
      CREATED: 201,
      ACCEPTED: 202,
      NON_AUTHORITATIVE_INFORMATION: 203,
      NO_CONTENT: 204,
      RESET_CONTENT: 205,
      PARTIAL_CONTENT: 206,
      MULTI_STATUS: 207,
      ALREADY_REPORTED: 208,
      TRANSFORMATION_APPLIED: 214,
      // Unofficial
      IM_USED: 226,
      MISCELLANEOUS_PERSISTENT_WARNING: 299,
      // Unofficial
      MULTIPLE_CHOICES: 300,
      MOVED_PERMANENTLY: 301,
      FOUND: 302,
      SEE_OTHER: 303,
      NOT_MODIFIED: 304,
      USE_PROXY: 305,
      SWITCH_PROXY: 306,
      // No longer used
      TEMPORARY_REDIRECT: 307,
      PERMANENT_REDIRECT: 308,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      PAYMENT_REQUIRED: 402,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      METHOD_NOT_ALLOWED: 405,
      NOT_ACCEPTABLE: 406,
      PROXY_AUTHENTICATION_REQUIRED: 407,
      REQUEST_TIMEOUT: 408,
      CONFLICT: 409,
      GONE: 410,
      LENGTH_REQUIRED: 411,
      PRECONDITION_FAILED: 412,
      PAYLOAD_TOO_LARGE: 413,
      URI_TOO_LONG: 414,
      UNSUPPORTED_MEDIA_TYPE: 415,
      RANGE_NOT_SATISFIABLE: 416,
      EXPECTATION_FAILED: 417,
      IM_A_TEAPOT: 418,
      PAGE_EXPIRED: 419,
      // Unofficial
      ENHANCE_YOUR_CALM: 420,
      // Unofficial
      MISDIRECTED_REQUEST: 421,
      UNPROCESSABLE_ENTITY: 422,
      LOCKED: 423,
      FAILED_DEPENDENCY: 424,
      TOO_EARLY: 425,
      UPGRADE_REQUIRED: 426,
      PRECONDITION_REQUIRED: 428,
      TOO_MANY_REQUESTS: 429,
      REQUEST_HEADER_FIELDS_TOO_LARGE_UNOFFICIAL: 430,
      // Unofficial
      REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
      LOGIN_TIMEOUT: 440,
      // Unofficial
      NO_RESPONSE: 444,
      // Unofficial
      RETRY_WITH: 449,
      // Unofficial
      BLOCKED_BY_PARENTAL_CONTROL: 450,
      // Unofficial
      UNAVAILABLE_FOR_LEGAL_REASONS: 451,
      CLIENT_CLOSED_LOAD_BALANCED_REQUEST: 460,
      // Unofficial
      INVALID_X_FORWARDED_FOR: 463,
      // Unofficial
      REQUEST_HEADER_TOO_LARGE: 494,
      // Unofficial
      SSL_CERTIFICATE_ERROR: 495,
      // Unofficial
      SSL_CERTIFICATE_REQUIRED: 496,
      // Unofficial
      HTTP_REQUEST_SENT_TO_HTTPS_PORT: 497,
      // Unofficial
      INVALID_TOKEN: 498,
      // Unofficial
      CLIENT_CLOSED_REQUEST: 499,
      // Unofficial
      INTERNAL_SERVER_ERROR: 500,
      NOT_IMPLEMENTED: 501,
      BAD_GATEWAY: 502,
      SERVICE_UNAVAILABLE: 503,
      GATEWAY_TIMEOUT: 504,
      HTTP_VERSION_NOT_SUPPORTED: 505,
      VARIANT_ALSO_NEGOTIATES: 506,
      INSUFFICIENT_STORAGE: 507,
      LOOP_DETECTED: 508,
      BANDWIDTH_LIMIT_EXCEEDED: 509,
      NOT_EXTENDED: 510,
      NETWORK_AUTHENTICATION_REQUIRED: 511,
      WEB_SERVER_UNKNOWN_ERROR: 520,
      // Unofficial
      WEB_SERVER_IS_DOWN: 521,
      // Unofficial
      CONNECTION_TIMEOUT: 522,
      // Unofficial
      ORIGIN_IS_UNREACHABLE: 523,
      // Unofficial
      TIMEOUT_OCCURED: 524,
      // Unofficial
      SSL_HANDSHAKE_FAILED: 525,
      // Unofficial
      INVALID_SSL_CERTIFICATE: 526,
      // Unofficial
      RAILGUN_ERROR: 527,
      // Unofficial
      SITE_IS_OVERLOADED: 529,
      // Unofficial
      SITE_IS_FROZEN: 530,
      // Unofficial
      IDENTITY_PROVIDER_AUTHENTICATION_ERROR: 561,
      // Unofficial
      NETWORK_READ_TIMEOUT: 598,
      // Unofficial
      NETWORK_CONNECT_TIMEOUT: 599
      // Unofficial
    };
    exports2.FINISH = {
      SAFE: 0,
      SAFE_WITH_CB: 1,
      UNSAFE: 2
    };
    exports2.HEADER_STATE = {
      GENERAL: 0,
      CONNECTION: 1,
      CONTENT_LENGTH: 2,
      TRANSFER_ENCODING: 3,
      UPGRADE: 4,
      CONNECTION_KEEP_ALIVE: 5,
      CONNECTION_CLOSE: 6,
      CONNECTION_UPGRADE: 7,
      TRANSFER_ENCODING_CHUNKED: 8
    };
    exports2.METHODS_HTTP = [
      exports2.METHODS.DELETE,
      exports2.METHODS.GET,
      exports2.METHODS.HEAD,
      exports2.METHODS.POST,
      exports2.METHODS.PUT,
      exports2.METHODS.CONNECT,
      exports2.METHODS.OPTIONS,
      exports2.METHODS.TRACE,
      exports2.METHODS.COPY,
      exports2.METHODS.LOCK,
      exports2.METHODS.MKCOL,
      exports2.METHODS.MOVE,
      exports2.METHODS.PROPFIND,
      exports2.METHODS.PROPPATCH,
      exports2.METHODS.SEARCH,
      exports2.METHODS.UNLOCK,
      exports2.METHODS.BIND,
      exports2.METHODS.REBIND,
      exports2.METHODS.UNBIND,
      exports2.METHODS.ACL,
      exports2.METHODS.REPORT,
      exports2.METHODS.MKACTIVITY,
      exports2.METHODS.CHECKOUT,
      exports2.METHODS.MERGE,
      exports2.METHODS["M-SEARCH"],
      exports2.METHODS.NOTIFY,
      exports2.METHODS.SUBSCRIBE,
      exports2.METHODS.UNSUBSCRIBE,
      exports2.METHODS.PATCH,
      exports2.METHODS.PURGE,
      exports2.METHODS.MKCALENDAR,
      exports2.METHODS.LINK,
      exports2.METHODS.UNLINK,
      exports2.METHODS.PRI,
      // TODO(indutny): should we allow it with HTTP?
      exports2.METHODS.SOURCE,
      exports2.METHODS.QUERY
    ];
    exports2.METHODS_ICE = [
      exports2.METHODS.SOURCE
    ];
    exports2.METHODS_RTSP = [
      exports2.METHODS.OPTIONS,
      exports2.METHODS.DESCRIBE,
      exports2.METHODS.ANNOUNCE,
      exports2.METHODS.SETUP,
      exports2.METHODS.PLAY,
      exports2.METHODS.PAUSE,
      exports2.METHODS.TEARDOWN,
      exports2.METHODS.GET_PARAMETER,
      exports2.METHODS.SET_PARAMETER,
      exports2.METHODS.REDIRECT,
      exports2.METHODS.RECORD,
      exports2.METHODS.FLUSH,
      // For AirPlay
      exports2.METHODS.GET,
      exports2.METHODS.POST
    ];
    exports2.METHOD_MAP = (0, utils_1.enumToMap)(exports2.METHODS);
    exports2.H_METHOD_MAP = Object.fromEntries(Object.entries(exports2.METHODS).filter(([k]) => k.startsWith("H")));
    exports2.STATUSES_HTTP = [
      exports2.STATUSES.CONTINUE,
      exports2.STATUSES.SWITCHING_PROTOCOLS,
      exports2.STATUSES.PROCESSING,
      exports2.STATUSES.EARLY_HINTS,
      exports2.STATUSES.RESPONSE_IS_STALE,
      exports2.STATUSES.REVALIDATION_FAILED,
      exports2.STATUSES.DISCONNECTED_OPERATION,
      exports2.STATUSES.HEURISTIC_EXPIRATION,
      exports2.STATUSES.MISCELLANEOUS_WARNING,
      exports2.STATUSES.OK,
      exports2.STATUSES.CREATED,
      exports2.STATUSES.ACCEPTED,
      exports2.STATUSES.NON_AUTHORITATIVE_INFORMATION,
      exports2.STATUSES.NO_CONTENT,
      exports2.STATUSES.RESET_CONTENT,
      exports2.STATUSES.PARTIAL_CONTENT,
      exports2.STATUSES.MULTI_STATUS,
      exports2.STATUSES.ALREADY_REPORTED,
      exports2.STATUSES.TRANSFORMATION_APPLIED,
      exports2.STATUSES.IM_USED,
      exports2.STATUSES.MISCELLANEOUS_PERSISTENT_WARNING,
      exports2.STATUSES.MULTIPLE_CHOICES,
      exports2.STATUSES.MOVED_PERMANENTLY,
      exports2.STATUSES.FOUND,
      exports2.STATUSES.SEE_OTHER,
      exports2.STATUSES.NOT_MODIFIED,
      exports2.STATUSES.USE_PROXY,
      exports2.STATUSES.SWITCH_PROXY,
      exports2.STATUSES.TEMPORARY_REDIRECT,
      exports2.STATUSES.PERMANENT_REDIRECT,
      exports2.STATUSES.BAD_REQUEST,
      exports2.STATUSES.UNAUTHORIZED,
      exports2.STATUSES.PAYMENT_REQUIRED,
      exports2.STATUSES.FORBIDDEN,
      exports2.STATUSES.NOT_FOUND,
      exports2.STATUSES.METHOD_NOT_ALLOWED,
      exports2.STATUSES.NOT_ACCEPTABLE,
      exports2.STATUSES.PROXY_AUTHENTICATION_REQUIRED,
      exports2.STATUSES.REQUEST_TIMEOUT,
      exports2.STATUSES.CONFLICT,
      exports2.STATUSES.GONE,
      exports2.STATUSES.LENGTH_REQUIRED,
      exports2.STATUSES.PRECONDITION_FAILED,
      exports2.STATUSES.PAYLOAD_TOO_LARGE,
      exports2.STATUSES.URI_TOO_LONG,
      exports2.STATUSES.UNSUPPORTED_MEDIA_TYPE,
      exports2.STATUSES.RANGE_NOT_SATISFIABLE,
      exports2.STATUSES.EXPECTATION_FAILED,
      exports2.STATUSES.IM_A_TEAPOT,
      exports2.STATUSES.PAGE_EXPIRED,
      exports2.STATUSES.ENHANCE_YOUR_CALM,
      exports2.STATUSES.MISDIRECTED_REQUEST,
      exports2.STATUSES.UNPROCESSABLE_ENTITY,
      exports2.STATUSES.LOCKED,
      exports2.STATUSES.FAILED_DEPENDENCY,
      exports2.STATUSES.TOO_EARLY,
      exports2.STATUSES.UPGRADE_REQUIRED,
      exports2.STATUSES.PRECONDITION_REQUIRED,
      exports2.STATUSES.TOO_MANY_REQUESTS,
      exports2.STATUSES.REQUEST_HEADER_FIELDS_TOO_LARGE_UNOFFICIAL,
      exports2.STATUSES.REQUEST_HEADER_FIELDS_TOO_LARGE,
      exports2.STATUSES.LOGIN_TIMEOUT,
      exports2.STATUSES.NO_RESPONSE,
      exports2.STATUSES.RETRY_WITH,
      exports2.STATUSES.BLOCKED_BY_PARENTAL_CONTROL,
      exports2.STATUSES.UNAVAILABLE_FOR_LEGAL_REASONS,
      exports2.STATUSES.CLIENT_CLOSED_LOAD_BALANCED_REQUEST,
      exports2.STATUSES.INVALID_X_FORWARDED_FOR,
      exports2.STATUSES.REQUEST_HEADER_TOO_LARGE,
      exports2.STATUSES.SSL_CERTIFICATE_ERROR,
      exports2.STATUSES.SSL_CERTIFICATE_REQUIRED,
      exports2.STATUSES.HTTP_REQUEST_SENT_TO_HTTPS_PORT,
      exports2.STATUSES.INVALID_TOKEN,
      exports2.STATUSES.CLIENT_CLOSED_REQUEST,
      exports2.STATUSES.INTERNAL_SERVER_ERROR,
      exports2.STATUSES.NOT_IMPLEMENTED,
      exports2.STATUSES.BAD_GATEWAY,
      exports2.STATUSES.SERVICE_UNAVAILABLE,
      exports2.STATUSES.GATEWAY_TIMEOUT,
      exports2.STATUSES.HTTP_VERSION_NOT_SUPPORTED,
      exports2.STATUSES.VARIANT_ALSO_NEGOTIATES,
      exports2.STATUSES.INSUFFICIENT_STORAGE,
      exports2.STATUSES.LOOP_DETECTED,
      exports2.STATUSES.BANDWIDTH_LIMIT_EXCEEDED,
      exports2.STATUSES.NOT_EXTENDED,
      exports2.STATUSES.NETWORK_AUTHENTICATION_REQUIRED,
      exports2.STATUSES.WEB_SERVER_UNKNOWN_ERROR,
      exports2.STATUSES.WEB_SERVER_IS_DOWN,
      exports2.STATUSES.CONNECTION_TIMEOUT,
      exports2.STATUSES.ORIGIN_IS_UNREACHABLE,
      exports2.STATUSES.TIMEOUT_OCCURED,
      exports2.STATUSES.SSL_HANDSHAKE_FAILED,
      exports2.STATUSES.INVALID_SSL_CERTIFICATE,
      exports2.STATUSES.RAILGUN_ERROR,
      exports2.STATUSES.SITE_IS_OVERLOADED,
      exports2.STATUSES.SITE_IS_FROZEN,
      exports2.STATUSES.IDENTITY_PROVIDER_AUTHENTICATION_ERROR,
      exports2.STATUSES.NETWORK_READ_TIMEOUT,
      exports2.STATUSES.NETWORK_CONNECT_TIMEOUT
    ];
    exports2.ALPHA = [];
    for (let i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
      exports2.ALPHA.push(String.fromCharCode(i));
      exports2.ALPHA.push(String.fromCharCode(i + 32));
    }
    exports2.NUM_MAP = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9
    };
    exports2.HEX_MAP = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      A: 10,
      B: 11,
      C: 12,
      D: 13,
      E: 14,
      F: 15,
      a: 10,
      b: 11,
      c: 12,
      d: 13,
      e: 14,
      f: 15
    };
    exports2.NUM = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ];
    exports2.ALPHANUM = exports2.ALPHA.concat(exports2.NUM);
    exports2.MARK = ["-", "_", ".", "!", "~", "*", "'", "(", ")"];
    exports2.USERINFO_CHARS = exports2.ALPHANUM.concat(exports2.MARK).concat(["%", ";", ":", "&", "=", "+", "$", ","]);
    exports2.URL_CHAR = [
      "!",
      '"',
      "$",
      "%",
      "&",
      "'",
      "(",
      ")",
      "*",
      "+",
      ",",
      "-",
      ".",
      "/",
      ":",
      ";",
      "<",
      "=",
      ">",
      "@",
      "[",
      "\\",
      "]",
      "^",
      "_",
      "`",
      "{",
      "|",
      "}",
      "~"
    ].concat(exports2.ALPHANUM);
    exports2.HEX = exports2.NUM.concat(["a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F"]);
    exports2.TOKEN = [
      "!",
      "#",
      "$",
      "%",
      "&",
      "'",
      "*",
      "+",
      "-",
      ".",
      "^",
      "_",
      "`",
      "|",
      "~"
    ].concat(exports2.ALPHANUM);
    exports2.HEADER_CHARS = ["	"];
    for (let i = 32; i <= 255; i++) {
      if (i !== 127) {
        exports2.HEADER_CHARS.push(i);
      }
    }
    exports2.CONNECTION_TOKEN_CHARS = exports2.HEADER_CHARS.filter((c) => c !== 44);
    exports2.QUOTED_STRING = ["	", " "];
    for (let i = 33; i <= 255; i++) {
      if (i !== 34 && i !== 92) {
        exports2.QUOTED_STRING.push(i);
      }
    }
    exports2.HTAB_SP_VCHAR_OBS_TEXT = ["	", " "];
    for (let i = 33; i <= 126; i++) {
      exports2.HTAB_SP_VCHAR_OBS_TEXT.push(i);
    }
    for (let i = 128; i <= 255; i++) {
      exports2.HTAB_SP_VCHAR_OBS_TEXT.push(i);
    }
    exports2.MAJOR = exports2.NUM_MAP;
    exports2.MINOR = exports2.MAJOR;
    exports2.SPECIAL_HEADERS = {
      "connection": exports2.HEADER_STATE.CONNECTION,
      "content-length": exports2.HEADER_STATE.CONTENT_LENGTH,
      "proxy-connection": exports2.HEADER_STATE.CONNECTION,
      "transfer-encoding": exports2.HEADER_STATE.TRANSFER_ENCODING,
      "upgrade": exports2.HEADER_STATE.UPGRADE
    };
    exports2.default = {
      ERROR: exports2.ERROR,
      TYPE: exports2.TYPE,
      FLAGS: exports2.FLAGS,
      LENIENT_FLAGS: exports2.LENIENT_FLAGS,
      METHODS: exports2.METHODS,
      STATUSES: exports2.STATUSES,
      FINISH: exports2.FINISH,
      HEADER_STATE: exports2.HEADER_STATE,
      ALPHA: exports2.ALPHA,
      NUM_MAP: exports2.NUM_MAP,
      HEX_MAP: exports2.HEX_MAP,
      NUM: exports2.NUM,
      ALPHANUM: exports2.ALPHANUM,
      MARK: exports2.MARK,
      USERINFO_CHARS: exports2.USERINFO_CHARS,
      URL_CHAR: exports2.URL_CHAR,
      HEX: exports2.HEX,
      TOKEN: exports2.TOKEN,
      HEADER_CHARS: exports2.HEADER_CHARS,
      CONNECTION_TOKEN_CHARS: exports2.CONNECTION_TOKEN_CHARS,
      QUOTED_STRING: exports2.QUOTED_STRING,
      HTAB_SP_VCHAR_OBS_TEXT: exports2.HTAB_SP_VCHAR_OBS_TEXT,
      MAJOR: exports2.MAJOR,
      MINOR: exports2.MINOR,
      SPECIAL_HEADERS: exports2.SPECIAL_HEADERS,
      METHODS_HTTP: exports2.METHODS_HTTP,
      METHODS_ICE: exports2.METHODS_ICE,
      METHODS_RTSP: exports2.METHODS_RTSP,
      METHOD_MAP: exports2.METHOD_MAP,
      H_METHOD_MAP: exports2.H_METHOD_MAP,
      STATUSES_HTTP: exports2.STATUSES_HTTP
    };
  }
});

// lib/llhttp/llhttp-wasm.js
var require_llhttp_wasm = __commonJS({
  "lib/llhttp/llhttp-wasm.js"(exports2, module2) {
    "use strict";
    var { Buffer: Buffer2 } = require("node:buffer");
    var wasmBase64 = "AGFzbQEAAAABMAhgAX8Bf2ADf39/AX9gBH9/f38Bf2AAAGADf39/AGABfwBgAn9/AGAGf39/f39/AALLAQgDZW52GHdhc21fb25faGVhZGVyc19jb21wbGV0ZQACA2VudhV3YXNtX29uX21lc3NhZ2VfYmVnaW4AAANlbnYLd2FzbV9vbl91cmwAAQNlbnYOd2FzbV9vbl9zdGF0dXMAAQNlbnYUd2FzbV9vbl9oZWFkZXJfZmllbGQAAQNlbnYUd2FzbV9vbl9oZWFkZXJfdmFsdWUAAQNlbnYMd2FzbV9vbl9ib2R5AAEDZW52GHdhc21fb25fbWVzc2FnZV9jb21wbGV0ZQAAA05NAwMEAAAFAAAAAAAABQEFAAUFBQAABgAAAAAGBgYGBgYGBgYGAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEAAAEBBwAABQUDAAEEBQFwARMTBQMBAAIGDQJ/AUHA2QQLfwBBAAsHxQcoBm1lbW9yeQIAC19pbml0aWFsaXplAAkZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEAC2xsaHR0cF9pbml0AAoYbGxodHRwX3Nob3VsZF9rZWVwX2FsaXZlAEkMbGxodHRwX2FsbG9jAAwGbWFsbG9jAE4LbGxodHRwX2ZyZWUADQRmcmVlAFAPbGxodHRwX2dldF90eXBlAA4VbGxodHRwX2dldF9odHRwX21ham9yAA8VbGxodHRwX2dldF9odHRwX21pbm9yABARbGxodHRwX2dldF9tZXRob2QAERZsbGh0dHBfZ2V0X3N0YXR1c19jb2RlABISbGxodHRwX2dldF91cGdyYWRlABMMbGxodHRwX3Jlc2V0ABQObGxodHRwX2V4ZWN1dGUAFRRsbGh0dHBfc2V0dGluZ3NfaW5pdAAWDWxsaHR0cF9maW5pc2gAFwxsbGh0dHBfcGF1c2UAGA1sbGh0dHBfcmVzdW1lABkbbGxodHRwX3Jlc3VtZV9hZnRlcl91cGdyYWRlABoQbGxodHRwX2dldF9lcnJubwAbF2xsaHR0cF9nZXRfZXJyb3JfcmVhc29uABwXbGxodHRwX3NldF9lcnJvcl9yZWFzb24AHRRsbGh0dHBfZ2V0X2Vycm9yX3BvcwAeEWxsaHR0cF9lcnJub19uYW1lAB8SbGxodHRwX21l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AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCAAKAIcIgRBf2oO/QH8AQH5AQIDBAUGBwgJCgsMDQ4PEBES+AET9wEUFfYBFhf1ARgZGhscHR4fIP0B+wEh9AEiIyQlJicoKSor8wEsLS4vMDEy8gHxATM08AHvATU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT/oBUFFSU+4B7QFU7AFV6wFWV1hZWuoBW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4ABgQGCAYMBhAGFAYYBhwGIAYkBigGLAYwBjQGOAY8BkAGRAZIBkwGUAZUBlgGXAZgBmQGaAZsBnAGdAZ4BnwGgAaEBogGjAaQBpQGmAacBqAGpAaoBqwGsAa0BrgGvAbABsQGyAbMBtAG1AbYBtwG4AbkBugG7AbwBvQG+Ab8BwAHBAcIBwwHEAcUBxgHHAcgByQHKAcsBzAHNAc4B6QHoAc8B5wHQAeYB0QHSAdMB1AHlAdUB1gHXAdgB2QHaAdsB3AHdAd4B3wHgAeEB4gHjAQD8AQtBACEEDOMBC0EOIQQM4gELQQ0hBAzhAQtBDyEEDOABC0EQIQQM3wELQRMhBAzeAQtBFCEEDN0BC0EVIQQM3AELQRYhBAzbAQtBFyEE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AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgBA7kAQABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEjJCUnKCmfA5wDmwOSA4sDhAOBA/4C/AL5AvMC8gLw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CEHX1ICAAGotAABHDR4gCEEBRg0BIAhBAWohCCABQQFqIgEgAkcNAAsgACAJNgIADPMBCyAAQQA2AgAgCkEBaiEBQQshBAweCwJAIAEiASACRw0AQawBIQQM8gELAkACQCABLQAAQb9/ag4DACABIAsgAUEBaiEBQZABIQQM2QELIAFBAWohAUGTASEEDNgBCwJAIAEiASACRw0AQasBIQQM8QELAkACQCABLQAAQb9/ag4PAB8fHx8fHx8fHx8fHx8BHwsgAUEBaiEBQZEBIQQM2AELIAFBAWohAUGSASEEDNcBCwJAIAEiASACRw0AQaoBIQQM8AELIAEtAABBzABHDRwgAUEBaiEBQQohBAwbC0GpASEEIAEiASACRg3uASACIAFrIAAoAgAiCGohCSABIAhrQQVqIQoCQANAIAEtAAAgCEHR1ICAAGotAABHDRogCEEFRg0BIAhBAWohCCABQQFqIgEgAkcNAAsgACAJNgIADO8BCyAAQQA2AgAgCkEBaiEBQR4hBAwaC0GoASEEIAEiASACRg3tASACIAFrIAAoAgAiCGohCSABIAhrQQZqIQoCQANAIAEtAAAgCEHK1ICAAGotAABHDRkgCEEGRg0BIAhBAWohCCABQQFqIgEgAkcNAAsgACAJNgIADO4BCyAAQQA2AgAgCkEBaiEBQRUhBAwZC0GnASEEIAEiASACRg3sASACIAFrIAAoAgAiCGohCSABIAhrQQJqIQoCQANAIAEtAAAgCEHH1ICAAGotAABHDRggCEECRg0BIAhBAWohCCABQQFqIgEgAkcNAAsgACAJNgIADO0BCyAAQQA2AgAgCkEBaiEBQRchBAwYC0GmASEEIAEiASACRg3rASACIAFrIAAoAgAiCGohCSABIAhrQQVqIQoCQANAIAEtAAAgCEHB1ICAAGotAABHDRcgCEEFRg0BIAhBAWohCCABQQFqIgEgAkcNAAsgACAJNgIADOwBCyAAQQA2AgAgCkEBaiEBQRghBAwXCwJAIAEiASACRw0AQaUBIQQM6wELAkACQCABLQAAQbd/ag4HABkZGRkZARkLIAFBAWohAUGLASEEDNIBCyABQQFqIQFBjAEhBAzRAQtBpAEhBCABIgEgAkYN6QEgAiABayAAKAIAIghqIQkgASAIa0EBaiEKAkADQCABLQAAIAhBptWAgABq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AkcNAAsgACAJNgIADJ0BCyAAKAIEIQEgAEIANwMAAkACQCAAIAEgCkEBaiIEEK2AgIAAIgENACAEIQEMAQsgAEH0ADYCHCAAIAQ2AhQgACABNgIMQQAhBAydAQtB4gAhBAyDAQsCQAJAAkAgACABIgEgAhCugICAACIEDQAgASEBDAELIARBFUYNASAAQQA2AhwgACABNgIUIABB6o2AgAA2AhAgAEEmNgIMQQAhBAydAQtB4QAhBAyDAQsgAEHzADYCHCAAIAE2AhQgAEGAm4CAADYCECAAQRU2AgxBACEEDJsBCyABIQECQCAALQApIgRBXWpBC08NACABIQEMCgsCQCAEQQZLDQBBASAEdEHKAHFFDQAgASEBDAoLQQAhBCAAQQA2AhwgACABNgIUIABB7YmAgAA2AhAgAEEINgIMDJoBC0HyACEEIAEiASACRg2ZASACIAFrIAAoAgAiCGohCSABIAhrQQFqIQoCQANAIAEtAAAgCEGz1YCAAGotAABHDQUgCEEBRg0BIAhBAWohCCABQQFqIgEgAkcNAAsgACAJNgIADJoBCyAAKAIEIQEgAEIANwMAAkACQCAAIAEgCkEBaiIEEK2AgIAAIgENACAEIQEMAQsgAEHxADYCHCAAIAQ2AhQgACABNgIMQQAhBAyaAQtB3wAhBAyAAQsCQAJAAkAgACABIgEgAhCugICAACIEDQAgASEBDAELIARBFUYNASAAQQA2AhwgACABNgIUIABB6o2AgAA2AhAgAEEmNgIMQQAhBAyaAQtB3gAhBAyAAQsgAEHwADYCHCAAIAE2AhQgAEGAm4CAADYCECAAQRU2AgxBACEEDJgBCyABIQECQCAALQApQSFHDQAgASEBDAcLIABBADYCHCAAIAE2AhQgAEGRioCAADYCECAAQQg2AgxBACEEDJcBC0HvACEEIAEiASACRg2WASACIAFrIAAoAgAiCGohCSABIAhrQQJqIQoCQANAIAEtAAAgCEGw1YCAAGotAABHDQIgCEECRg0BIAhBAWohCCABQQFqIgEgAkcNAAsgACAJNgIADJcBCyAAKAIEIQEgAEIANwMAAkAgACABIApBAWoiBBCtgICAACIBDQAgBCEBDAMLIABB7QA2AhwgACAENgIUIAAgATYCDEEAIQQMlgELIABBADYCAAsgACgCBCECIABBADYC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NgLM1YCAAA8LAkAgAEH/AUsNACAAQXhxQezVgIAAaiECAkACQEEAKALE1YCAACIEQQEgAEEDdnQiAHENAEEAIAQgAHI2AsTVgIAAIAIhAAwBCyACKAIIIQALIAAgATYCDCACIAE2AgggASACNgIMIAEgADYCCA8LQR8hAgJAIABB////B0sNACAAQSYgAEEIdmciAmt2QQFxIAJBAXRrQT5qIQILIAEgAjYCHCABQgA3AhAgAkECdEH014CAAGohBAJAAkBBACgCyNWAgAAiBkEBIAJ0IgNxDQAgBCABNgIAQQAgBiADcjYCyNWAgAAgASAENgIYIAEgATYCCCABIAE2AgwMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGAkADQCAGIgQoAgRBeHEgAEYNASACQR12IQYgAkEBdCECIAQgBkEEcWpBEGoiAygCACIGDQALIAMgATYCACABIAQ2AhggASABNgIMIAEgATYCCAwBCyAEKAIIIgAgATYCDCAEIAE2AgggAUEANgIYIAEgBDYCDCABIAA2AggLQQBBACgC5NWAgABBf2oiAUF/IAEbNgLk1YCAAAsLBAAAAAtOAAJAIAANAD8AQRB0DwsCQCAAQf//A3ENACAAQX9MDQACQCAAQRB2QAAiAEF/Rw0AQQBBMDYCtNmAgABBfw8LIABBEHQPCxDSgICAAAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALC8VNAQBBgAgLvU0BAAAAAAAAAAIAAAADAAAAAAAAAAAAAAAEAAAABQAAAAAAAAAAAAAABgAAAAcAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW52YWxpZCBjaGFyIGluIHVybCBxdWVyeQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2JvZHkAQ29udGVudC1MZW5ndGggb3ZlcmZsb3cAQ2h1bmsgc2l6ZSBvdmVyZmxvdwBJbnZhbGlkIG1ldGhvZCBmb3IgSFRUUC94LnggcmVxdWVzdABJbnZhbGlkIG1ldGhvZCBmb3IgUlRTUC94LnggcmVxdWVzdABFeHBlY3RlZCBTT1VSQ0UgbWV0aG9kIGZvciBJQ0UveC54IHJlcXVlc3QASW52YWxpZCBjaGFyIGluIHVybCBmcmFnbWVudCBzdGFydABFeHBlY3RlZCBkb3QAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9zdGF0dXMASW52YWxpZCByZXNwb25zZSBzdGF0dXMARXhwZWN0ZWQgTEYgYWZ0ZXIgaGVhZGVycwBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zAFVzZXIgY2FsbGJhY2sgZXJyb3IAYG9uX3Jlc2V0YCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfaGVhZGVyYCBjYWxsYmFjayBlcnJvcgBgb25fbWVzc2FnZV9iZWdpbmAgY2FsbGJhY2sgZXJyb3IAYG9uX2NodW5rX2V4dGVuc2lvbl92YWx1ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX3N0YXR1c19jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX3ZlcnNpb25fY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl91cmxfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9wcm90b2NvbF9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX2NodW5rX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25faGVhZGVyX3ZhbHVlX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fbWVzc2FnZV9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX21ldGhvZF9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX2hlYWRlcl9maWVsZF9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lYCBjYWxsYmFjayBlcnJvcgBVbmV4cGVjdGVkIGNoYXIgaW4gdXJsIHNlcnZlcgBJbnZhbGlkIGhlYWRlciB2YWx1ZSBjaGFyAEludmFsaWQgaGVhZGVyIGZpZWxkIGNoYXIAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl92ZXJzaW9uAEludmFsaWQgbWlub3IgdmVyc2lvbgBJbnZhbGlkIG1ham9yIHZlcnNpb24ARXhwZWN0ZWQgc3BhY2UgYWZ0ZXIgdmVyc2lvbgBFeHBlY3RlZCBDUkxGIGFmdGVyIHZlcnNpb24ASW52YWxpZCBIVFRQIHZlcnNpb24ASW52YWxpZCBoZWFkZXIgdG9rZW4AU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl91cmwASW52YWxpZCBjaGFyYWN0ZXJzIGluIHVybABVbmV4cGVjdGVkIHN0YXJ0IGNoYXIgaW4gdXJsAERvdWJsZSBAIGluIHVybABTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX3Byb3RvY29sAEVtcHR5IENvbnRlbnQtTGVuZ3RoAEludmFsaWQgY2hhcmFjdGVyIGluIENvbnRlbnQtTGVuZ3RoAFRyYW5zZmVyLUVuY29kaW5nIGNhbid0IGJlIHByZXNlbnQgd2l0aCBDb250ZW50LUxlbmd0aABEdXBsaWNhdGUgQ29udGVudC1MZW5ndGgASW52YWxpZCBjaGFyIGluIHVybCBwYXRoAENvbnRlbnQtTGVuZ3RoIGNhbid0IGJlIHByZXNlbnQgd2l0aCBUcmFuc2Zlci1FbmNvZGluZwBNaXNzaW5nIGV4cGVjdGVkIENSIGFmdGVyIGNodW5rIHNpemUARXhwZWN0ZWQgTEYgYWZ0ZXIgY2h1bmsgc2l6ZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBzaXplAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25faGVhZGVyX3ZhbHVlAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fY2h1bmtfZXh0ZW5zaW9uX3ZhbHVlAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgdmFsdWUAVW5leHBlY3RlZCB3aGl0ZXNwYWNlIGFmdGVyIGhlYWRlciB2YWx1ZQBNaXNzaW5nIGV4cGVjdGVkIENSIGFmdGVyIGhlYWRlciB2YWx1ZQBNaXNzaW5nIGV4cGVjdGVkIExGIGFmdGVyIGhlYWRlciB2YWx1ZQBJbnZhbGlkIGBUcmFuc2Zlci1FbmNvZGluZ2AgaGVhZGVyIHZhbHVlAE1pc3NpbmcgZXhwZWN0ZWQgQ1IgYWZ0ZXIgY2h1bmsgZXh0ZW5zaW9uIHZhbHVlAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgcXVvdGUgdmFsdWUASW52YWxpZCBxdW90ZWQtcGFpciBpbiBjaHVuayBleHRlbnNpb25zIHF1b3RlZCB2YWx1ZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zIHF1b3RlZCB2YWx1ZQBQYXVzZWQgYnkgb25faGVhZGVyc19jb21wbGV0ZQBJbnZhbGlkIEVPRiBzdGF0ZQBvbl9yZXNldCBwYXVzZQBvbl9jaHVua19oZWFkZXIgcGF1c2UAb25fbWVzc2FnZV9iZWdpbiBwYXVzZQBvbl9jaHVua19leHRlbnNpb25fdmFsdWUgcGF1c2UAb25fc3RhdHVzX2NvbXBsZXRlIHBhdXNlAG9uX3ZlcnNpb25fY29tcGxldGUgcGF1c2UAb25fdXJsX2NvbXBsZXRlIHBhdXNlAG9uX3Byb3RvY29sX2NvbXBsZXRlIHBhdXNlAG9uX2NodW5rX2NvbXBsZXRlIHBhdXNlAG9uX2hlYWRlcl92YWx1ZV9jb21wbGV0ZSBwYXVzZQBvbl9tZXNzYWdlX2NvbXBsZXRlIHBhdXNlAG9uX21ldGhvZF9jb21wbGV0ZSBwYXVzZQBvbl9oZWFkZXJfZmllbGRfY29tcGxldGUgcGF1c2UAb25fY2h1bmtfZXh0ZW5zaW9uX25hbWUgcGF1c2UAVW5leHBlY3RlZCBzcGFjZSBhZnRlciBzdGFydCBsaW5lAE1pc3NpbmcgZXhwZWN0ZWQgQ1IgYWZ0ZXIgcmVzcG9uc2UgbGluZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgbmFtZQBNaXNzaW5nIGV4cGVjdGVkIENSIGFmdGVyIGNodW5rIGV4dGVuc2lvbiBuYW1lAEludmFsaWQgc3RhdHVzIGNvZGUAUGF1c2Ugb24gQ09OTkVDVC9VcGdyYWRlAFBhdXNlIG9uIFBSSS9VcGdyYWRlAEV4cGVjdGVkIEhUVFAvMiBDb25uZWN0aW9uIFByZWZhY2UAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9tZXRob2QARXhwZWN0ZWQgc3BhY2UgYWZ0ZXIgbWV0aG9kAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25faGVhZGVyX2ZpZWxkAFBhdXNlZABJbnZhbGlkIHdvcmQgZW5jb3VudGVyZWQASW52YWxpZCBtZXRob2QgZW5jb3VudGVyZWQATWlzc2luZyBleHBlY3RlZCBDUiBhZnRlciBjaHVuayBkYXRhAEV4cGVjdGVkIExGIGFmdGVyIGNodW5rIGRhdGEAVW5leHBlY3RlZCBjaGFyIGluIHVybCBzY2hlbWEAUmVxdWVzdCBoYXMgaW52YWxpZCBgVHJhbnNmZXItRW5jb2RpbmdgAERhdGEgYWZ0ZXIgYENvbm5lY3Rpb246IGNsb3NlYABTV0lUQ0hfUFJPWFkAVVNFX1BST1hZAE1LQUNUSVZJVFkAVU5QUk9DRVNTQUJMRV9FTlRJVFkAUVVFUlkAQ09QWQBNT1ZFRF9QRVJNQU5FTlRMWQBUT09fRUFSTFkATk9USUZZAEZBSUxFRF9ERVBFTkRFTkNZAEJBRF9HQVRFV0FZAFBMQVkAUFVUAENIRUNLT1VUAEdBVEVXQVlfVElNRU9VVABSRVFVRVNUX1RJTUVPVVQATkVUV09SS19DT05ORUNUX1RJTUVPVVQAQ09OTkVDVElPTl9USU1FT1VUAExPR0lOX1RJTUVPVVQATkVUV09SS19SRUFEX1RJTUVPVVQAUE9TVABNSVNESVJFQ1RFRF9SRVFVRVNUAENMSUVOVF9DTE9TRURfUkVRVUVTVABDTElFTlRfQ0xPU0VEX0xPQURfQkFMQU5DRURfUkVRVUVTVABCQURfUkVRVUVTVABIVFRQX1JFUVVFU1RfU0VOVF9UT19IVFRQU19QT1JUAFJFUE9SVABJTV9BX1RFQVBPVABSRVNFVF9DT05URU5UAE5PX0NPTlRFTlQAUEFSVElBTF9DT05URU5UAEhQRV9JTlZBTElEX0NPTlNUQU5UAEhQRV9DQl9SRVNFVABHRVQASFBFX1NUUklDVABDT05GTElDVABURU1QT1JBUllfUkVESVJFQ1QAUEVSTUFORU5UX1JFRElSRUNUAENPTk5FQ1QATVVMVElfU1RBVFVTAEhQRV9JTlZBTElEX1NUQVRVUwBUT09fTUFOWV9SRVFVRVNUUwBFQVJMWV9ISU5UUwBVTkFWQUlMQUJMRV9GT1JfTEVHQUxfUkVBU09OUwBPUFRJT05TAFNXSVRDSElOR19QUk9UT0NPTFMAVkFSSUFOVF9BTFNPX05FR09USUFURVMATVVMVElQTEVfQ0hPSUNFUwBJTlRFUk5BTF9TRVJWRVJfRVJST1IAV0VCX1NFUlZFUl9VTktOT1dOX0VSUk9SAFJBSUxHVU5fRVJST1IASURFTlRJVFlfUFJPVklERVJfQVVUSEVOVElDQVRJT05fRVJST1IAU1NMX0NFUlRJRklDQVRFX0VSUk9SAElOVkFMSURfWF9GT1JXQVJERURfRk9SAFNFVF9QQVJBTUVURVIAR0VUX1BBUkFNRVRFUgBIUEVfVVNFUgBTRUVfT1RIRVIASFBFX0NCX0NIVU5LX0hFQURFUgBFeHBlY3RlZCBMRiBhZnRlciBDUgBNS0NBTEVOREFSAFNFVFVQAFdFQl9TRVJWRVJfSVNfRE9XTgBURUFSRE9XTgBIUEVfQ0xPU0VEX0NPTk5FQ1RJT04ASEVVUklTVElDX0VYUElSQVRJT04ARElTQ09OTkVDVEVEX09QRVJBVElPTgBOT05fQVVUSE9SSVRBVElWRV9JTkZPUk1BVElPTgBIUEVfSU5WQUxJRF9WRVJTSU9OAEhQRV9DQl9NRVNTQUdFX0JFR0lOAFNJVEVfSVNfRlJPWkVOAEhQRV9JTlZBTElEX0hFQURFUl9UT0tFTgBJTlZBTElEX1RPS0VOAEZPUkJJRERFTgBFTkhBTkNFX1lPVVJfQ0FMTQBIUEVfSU5WQUxJRF9VUkwAQkxPQ0tFRF9CWV9QQVJFTlRBTF9DT05UUk9MAE1LQ09MAEFDTABIUEVfSU5URVJOQUwAUkVRVUVTVF9IRUFERVJfRklFTERTX1RPT19MQVJHRV9VTk9GRklDSUFMAEhQRV9PSwBVTkxJTksAVU5MT0NLAFBSSQBSRVRSWV9XSVRIAEhQRV9JTlZBTElEX0NPTlRFTlRfTEVOR1RIAEhQRV9VTkVYUEVDVEVEX0NPTlRFTlRfTEVOR1RIAEZMVVNIAFBST1BQQVRDSABNLVNFQVJDSABVUklfVE9PX0xPTkcAUFJPQ0VTU0lORwBNSVNDRUxMQU5FT1VTX1BFUlNJU1RFTlRfV0FSTklORwBNSVNDRUxMQU5FT1VTX1dBUk5JTkcASFBFX0lOVkFMSURfVFJBTlNGRVJfRU5DT0RJTkcARXhwZWN0ZWQgQ1JMRgBIUEVfSU5WQUxJRF9DSFVOS19TSVpFAE1PVkUAQ09OVElOVUUASFBFX0NCX1NUQVRVU19DT01QTEVURQBIUEVfQ0JfSEVBREVSU19DT01QTEVURQBIUEVfQ0JfVkVSU0lPTl9DT01QTEVURQBIUEVfQ0JfVVJMX0NPTVBMRVRFAEhQRV9DQl9QUk9UT0NPTF9DT01QTEVURQBIUEVfQ0JfQ0hVTktfQ09NUExFVEUASFBFX0NCX0hFQURFUl9WQUxVRV9DT01QTEVURQBIUEVfQ0JfQ0hVTktfRVhURU5TSU9OX1ZBTFVFX0NPTVBMRVRFAEhQRV9DQl9DSFVOS19FWFRFTlNJT05fTkFNRV9DT01QTEVURQBIUEVfQ0JfTUVTU0FHRV9DT01QTEVURQBIUEVfQ0JfTUVUSE9EX0NPTVBMRVRFAEhQRV9DQl9IRUFERVJfRklFTERfQ09NUExFVEUAREVMRVRFAEhQRV9JTlZBTElEX0VPRl9TVEFURQBJTlZBTElEX1NTTF9DRVJUSUZJQ0FURQBQQVVTRQBOT19SRVNQT05TRQBVTlNVUFBPUlRFRF9NRURJQV9UWVBFAEdPTkUATk9UX0FDQ0VQVEFCTEUAU0VSVklDRV9VTkFWQUlMQUJMRQBSQU5HRV9OT1RfU0FUSVNGSUFCTEUAT1JJR0lOX0lTX1VOUkVBQ0hBQkxFAFJFU1BPTlNFX0lTX1NUQUxFAFBVUkdFAE1FUkdFAFJFUVVFU1RfSEVBREVSX0ZJRUxEU19UT09fTEFSR0UAUkVRVUVTVF9IRUFERVJfVE9PX0xBUkdFAFBBWUxPQURfVE9PX0xBUkdFAElOU1VGRklDSUVOVF9TVE9SQUdFAEhQRV9QQVVTRURfVVBHUkFERQBIUEVfUEFVU0VEX0gyX1VQR1JBREUAU09VUkNFAEFOTk9VTkNFAFRSQUNFAEhQRV9VTkVYUEVDVEVEX1NQQUNFAERFU0NSSUJFAFVOU1VCU0NSSUJFAFJFQ09SRABIUEVfSU5WQUxJRF9NRVRIT0QATk9UX0ZPVU5EAFBST1BGSU5EAFVOQklORABSRUJJTkQAVU5BVVRIT1JJWkVEAE1FVEhPRF9OT1RfQUxMT1dFRABIVFRQX1ZFUlNJT05fTk9UX1NVUFBPUlRFRABBTFJFQURZX1JFUE9SVEVEAEFDQ0VQVEVEAE5PVF9JTVBMRU1FTlRFRABMT09QX0RFVEVDVEVEAEhQRV9DUl9FWFBFQ1RFRABIUEVfTEZfRVhQRUNURUQAQ1JFQVRFRABJTV9VU0VEAEhQRV9QQVVTRUQAVElNRU9VVF9PQ0NVUkVEAFBBWU1FTlRfUkVRVUlSRUQAUFJFQ09ORElUSU9OX1JFUVVJUkVEAFBST1hZX0FVVEhFTlRJQ0FUSU9OX1JFUVVJUkVEAE5FVFdPUktfQVVUSEVOVElDQVRJT05fUkVRVUlSRUQATEVOR1RIX1JFUVVJUkVEAFNTTF9DRVJUSUZJQ0FURV9SRVFVSVJFRABVUEdSQURFX1JFUVVJUkVEAFBBR0VfRVhQSVJFRABQUkVDT05ESVRJT05fRkFJTEVEAEVYUEVDVEFUSU9OX0ZBSUxFRABSRVZBTElEQVRJT05fRkFJTEVEAFNTTF9IQU5EU0hBS0VfRkFJTEVEAExPQ0tFRABUUkFOU0ZPUk1BVElPTl9BUFBMSUVEAE5PVF9NT0RJRklFRABOT1RfRVhURU5ERUQAQkFORFdJRFRIX0xJTUlUX0VYQ0VFREVEAFNJVEVfSVNfT1ZFUkxPQURFRABIRUFEAEV4cGVjdGVkIEhUVFAvLCBSVFNQLyBvciBJQ0UvAOcVAACvFQAApBIAAJIaAAAmFgAAnhQAANsZAAB5FQAAfhIAAP4UAAA2FQAACxYAANgWAADzEgAAQhgAAKwWAAASFQAAFBcAAO8XAABIFAAAcRcAALIaAABrGQAAfhkAADUUAACCGgAARBcAAP0WAAAeGAAAhxcAAKoZAACTEgAABxgAACwXAADKFwAApBcAAOcVAADnFQAAWBcAADsYAACgEgAALRwAAMMRAABIEQAA3hIAAEITAACkGQAA/RAAAPcVAAClFQAA7xYAAPgZAABKFgAAVhYAAPUVAAAKGgAACBoAAAEaAACrFQAAQhIAANcQAABMEQAABRkAAFQWAAAeEQAAyhkAAMgZAABOFgAA/xgAAHEUAADwFQAA7hUAAJQZAAD8FQAAvxkAAJsZAAB8FAAAQxEAAHAYAACVFAAAJxQAABkUAADVEgAA1BkAAEQWAAD3EAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQMBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAEAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAwQDAwMDAwAAAwMAAwMAAwMDAwMDAwMDAwAFAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAMAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAACAAAAAAAAAAAAAAAAAAAAAAAAAAMAAwMDAwMAAAMDAAMDAAMDAwMDAwMDAwMABAAFAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsb3NlZWVwLWFsaXZlAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQFjaHVua2VkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAQEBAQAAAQEAAQEAAQEBAQEBAQEBAQAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGVjdGlvbmVudC1sZW5ndGhvbnJveHktY29ubmVjdGlvbgAAAAAAAAAAAAAAAAAAAHJhbnNmZXItZW5jb2RpbmdwZ3JhZGUNCg0KU00NCg0KAAAAAAAAAAAAAQIAAQMAAAAAAAAAAAAAAAAAAAAAAAAEBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECAAEDAAAAAAAAAAAAAAAAAAAAAAAABAUFBgUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAACAgACAgICAgICAgICAgICAgICAgICAgICAgICAgIAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQIAAQMAAAAAAAAAAAAAAAAAAAAAAAAEBQAABQUFBQUFBQUFBQUGBQUFBQUFBQUFBQUFAAUABwgFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUABQAFAAUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAAEBAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQABAQAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAACAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATk9VTkNFRUNLT1VUTkVDVEVURUNSSUJFTFVTSEVURUFEU0VBUkNIUkdFQ1RJVklUWUxFTkRBUlZFT1RJRllQVElPTlNDSFNFQVlTVEFUQ0hHRVVFUllPUkRJUkVDVE9SVFJDSFBBUkFNRVRFUlVSQ0VCU0NSSUJFQVJET1dOQUNFSU5ETktDS1VCU0NSSUJFVFRQQ0VUU1BBRFRQLw==";
    var wasmBuffer;
    Object.defineProperty(module2, "exports", {
      get: /* @__PURE__ */ __name(() => {
        return wasmBuffer ? wasmBuffer : wasmBuffer = Buffer2.from(wasmBase64, "base64");
      }, "get")
    });
  }
});

// lib/llhttp/llhttp_simd-wasm.js
var require_llhttp_simd_wasm = __commonJS({
  "lib/llhttp/llhttp_simd-wasm.js"(exports2, module2) {
    "use strict";
    var { Buffer: Buffer2 } = require("node:buffer");
    var wasmBase64 = "AGFzbQEAAAABMAhgAX8Bf2ADf39/AX9gBH9/f38Bf2AAAGADf39/AGABfwBgAn9/AGAGf39/f39/AALLAQgDZW52GHdhc21fb25faGVhZGVyc19jb21wbGV0ZQACA2VudhV3YXNtX29uX21lc3NhZ2VfYmVnaW4AAANlbnYLd2FzbV9vbl91cmwAAQNlbnYOd2FzbV9vbl9zdGF0dXMAAQNlbnYUd2FzbV9vbl9oZWFkZXJfZmllbGQAAQNlbnYUd2FzbV9vbl9oZWFkZXJfdmFsdWUAAQNlbnYMd2FzbV9vbl9ib2R5AAEDZW52GHdhc21fb25fbWVzc2FnZV9jb21wbGV0ZQAAA05NAwMEAAAFAAAAAAAABQEFAAUFBQAABgAAAAAGBgYGBgYGBgYGAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEAAAEBBwAABQUDAAEEBQFwARMTBQMBAAIGDQJ/AUHA2QQLfwBBAAsHxQcoBm1lbW9yeQIAC19pbml0aWFsaXplAAkZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEAC2xsaHR0cF9pbml0AAoYbGxodHRwX3Nob3VsZF9rZWVwX2FsaXZlAEkMbGxodHRwX2FsbG9jAAwGbWFsbG9jAE4LbGxodHRwX2ZyZWUADQRmcmVlAFAPbGxodHRwX2dldF90eXBlAA4VbGxodHRwX2dldF9odHRwX21ham9yAA8VbGxodHRwX2dldF9odHRwX21pbm9yABARbGxodHRwX2dldF9tZXRob2QAERZsbGh0dHBfZ2V0X3N0YXR1c19jb2RlABISbGxodHRwX2dldF91cGdyYWRlABMMbGxodHRwX3Jlc2V0ABQObGxodHRwX2V4ZWN1dGUAFRRsbGh0dHBfc2V0dGluZ3NfaW5pdAAWDWxsaHR0cF9maW5pc2gAFwxsbGh0dHBfcGF1c2UAGA1sbGh0dHBfcmVzdW1lABkbbGxodHRwX3Jlc3VtZV9hZnRlcl91cGdyYWRlABoQbGxodHRwX2dldF9lcnJubwAbF2xsaHR0cF9nZXRfZXJyb3JfcmVhc29uABwXbGxodHRwX3NldF9lcnJvcl9yZWFzb24AHRRsbGh0dHBfZ2V0X2Vycm9yX3BvcwAeEWxsaHR0cF9lcnJub19uYW1lAB8SbGxodHRwX21l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AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgACgCHCIEQX9qDv0B/AEB+QECAwQFBgcICQoLDA0ODxAREvgBE/cBFBX2ARYX9QEYGRobHB0eHyD9AfsBIfQBIiMkJSYnKCkqK/MBLC0uLzAxMvIB8QEzNPAB7wE1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk/6AVBRUlPuAe0BVOwBVesBVldYWVrqAVtcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AAYEBggGDAYQBhQGGAYcBiAGJAYoBiwGMAY0BjgGPAZABkQGSAZMBlAGVAZYBlwGYAZkBmgGbAZwBnQGeAZ8BoAGhAaIBowGkAaUBpgGnAagBqQGqAasBrAGtAa4BrwGwAbEBsgGzAbQBtQG2AbcBuAG5AboBuwG8Ab0BvgG/AcABwQHCAcMBxAHFAcYBxwHIAckBygHLAcwBzQHOAekB6AHPAecB0AHmAdEB0gHTAdQB5QHVAdYB1wHYAdkB2gHbAdwB3QHeAd8B4AHhAeIB4wEA/AELQQAhBAzjAQtBDiEEDOIBC0ENIQQM4QELQQ8hBAzgAQtBECEEDN8BC0ETIQQM3gELQRQhBAzdAQtBFSEEDNwBC0EWIQQM2wELQRchBAzaAQtBGCEEDNkBC0EZIQQM2AELQRohBAzXAQtBGyEEDNYBC0EcIQQM1QELQR0hBAzUAQtBHiEEDNMBC0EfIQQM0gELQSAhBAzRAQtBISEEDNABC0EIIQQMzwELQSIhBAzOAQtBJCEEDM0BC0EjIQQMzAELQQchBAzLAQtBJSEEDMoBC0EmIQQMyQELQSchBAzIAQtBKCEEDMcBC0ESIQQMxgELQREhBAzFAQtBKSEEDMQBC0EqIQQMwwELQSshBAzCAQtBLCEEDMEBC0HeASEEDMABC0EuIQQMvwELQS8hBAy+AQtBMCEEDL0BC0ExIQQMvAELQTIhBAy7AQtBMyEEDLoBC0E0IQQMuQELQd8BIQQMuAELQTUhBAy3AQtBOSEEDLYBC0EMIQQMtQELQTYhBAy0AQtBNyEEDLMBC0E4IQQMsgELQT4hBAyxAQtBOiEEDLABC0HgASEEDK8BC0ELIQQMrgELQT8hBAytAQtBOyEEDKwBC0EKIQQMqwELQTwhBAyqAQtBPSEEDKkBC0HhASEEDKgBC0HBACEEDKcBC0HAACEEDKYBC0HCACEEDKUBC0EJIQQMpAELQS0hBAyjAQtBwwAhBAyiAQtBxAAhBAyhAQtBxQAhBAygAQtBxgAhBAyfAQtBxwAhBAyeAQtByAAhBAydAQtByQAhBAycAQtBygAhBAybAQtBywAhBAyaAQtBzAAhBAyZAQtBzQAhBAyYAQtBzgAhBAyXAQtBzwAhBAyWAQtB0AAhBAyVAQtB0QAhBAyUAQtB0gAhBAyTAQtB0wAhBAySAQtB1QAhBAyRAQtB1AAhBAyQAQtB1gAhBAyPAQtB1wAhBAyOAQtB2AAhBAyNAQtB2QAhBAyMAQtB2gAhBAyLAQtB2wAhBAyKAQtB3AAhBAyJAQtB3QAhBAyIAQtB3gAhBAyHAQtB3wAhBAyGAQtB4AAhBAyFAQtB4QAhBAyEAQtB4gAhBAyDAQtB4wAhBAyCAQtB5AAhBAyBAQtB5QAhBAyAAQtB4gEhBAx/C0HmACEEDH4LQecAIQQMfQtBBiEEDHwLQegAIQQMewtBBSEEDHoLQekAIQQMeQtBBCEEDHgLQeoAIQQMdwtB6wAhBAx2C0HsACEEDHULQe0AIQQMdAtBAyEEDHMLQe4AIQQMcgtB7wAhBAxxC0HwACEEDHALQfIAIQQMbwtB8QAhBAxuC0HzACEEDG0LQfQAIQQMbAtB9QAhBAxrC0H2ACEEDGoLQQIhBAxpC0H3ACEEDGgLQfgAIQQMZwtB+QAhBAxmC0H6ACEEDGULQfsAIQQMZAtB/AAhBAxjC0H9ACEEDGILQf4AIQQMYQtB/wAhBAxgC0GAASEEDF8LQYEBIQQMXgtBggEhBAxdC0GDASEEDFwLQYQBIQQMWwtBhQEhBAxaC0GGASEEDFkLQYcBIQQMWAtBiAEhBAxXC0GJASEEDFYLQYoBIQQMVQtBiwEhBAxUC0GMASEEDFMLQY0BIQQMUgtBjgEhBAxRC0GPASEEDFALQZABIQQMTwtBkQEhBAxOC0GSASEEDE0LQZMBIQQMTAtBlAEhBAxLC0GVASEEDEoLQZYBIQQMSQtBlwEhBAxIC0GYASEEDEcLQZkBIQQMRgtBmgEhBAxFC0GbASEEDEQLQZwBIQQMQwtBnQEhBAxCC0GeASEEDEELQZ8BIQQMQAtBoAEhBAw/C0GhASEEDD4LQaIBIQQMPQtBowEhBAw8C0GkASEEDDsLQaUBIQQMOgtBpgEhBAw5C0GnASEEDDgLQagBIQQMNwtBqQEhBAw2C0GqASEEDDULQasBIQQMNAtBrAEhBAwzC0GtASEEDDILQa4BIQQMMQtBrwEhBAwwC0GwASEEDC8LQbEBIQQMLgtBsgEhBAwtC0GzASEEDCwLQbQBIQQMKwtBtQEhBAwqC0G2ASEEDCkLQbcBIQQMKAtBuAEhBAwnC0G5ASEEDCYLQboBIQQMJQtBuwEhBAwkC0G8ASEEDCMLQb0BIQQMIgtBvgEhBAwhC0G/ASEEDCALQcABIQQMHwtBwQEhBAweC0HCASEEDB0LQQEhBAwcC0HDASEEDBsLQcQBIQQMGgtBxQEhBAwZC0HGASEEDBgLQccBIQQMFwtByAEhBAwWC0HJASEEDBULQcoBIQQMFAtBywEhBAwTC0HMASEEDBILQc0BIQQMEQtBzgEhBAwQC0HPASEEDA8LQdABIQQMDgtB0QEhBAwNC0HSASEEDAwLQdMBIQQMCwtB1AEhBAwKC0HVASEEDAkLQdYBIQQMCAtB4wEhBAwHC0HXASEEDAYLQdgBIQQMBQtB2QEhBAwEC0HaASEEDAMLQdsBIQQMAgtB3QEhBAwBC0HcASEECwNAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAQO5AEAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIyQlJygpnwOcA5sDkgOLA4QDgQP+AvwC+QLzAvIC8ALuAukC6ALnAuYC5QLd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ADYCECAAQR82AgxBACEEDMwCCwJAAkAgAC0AKEF/ag4CBAEAC0HbASEEDLMCC0HUASEEDLICCyAAQQI6ADECQCAAIAEiASACEKyAgIAAIgQNACABIQFB3QEhBAyyAgsCQCAEQRVGDQAgAEEANgIcIAAgATYCFCAAQbSMgIAANgIQIABBEDYCDEEAIQQMywILIABB+wE2AhwgACABNgIUIABBgZqAgAA2AhAgAEEVNgIMQQAhBAzKAgsCQCABIgEgAkcNAEH6ASEEDMoCCyABLQAAQcgARg0BIABBAToAKCABIQELQcABIQQMrwILIAEhAUHaASEEDK4CCwJAIAEiASACRg0AIABBjICAgAA2AgggACABNgIEIAEhAUHZASEEDK4CC0H5ASEEDMYCCwJAIAEiASACRw0AQfgBIQQMxgILIAEtAABByABHDQQgAUEBaiEBQdgBIQQMrAILAkAgASIBIAJHDQBB9wEhBAzFAgsCQAJAIAEtAABBu39qDhAABQUFBQUFBQUFBQUFBQUBBQsgAUEBaiEBQdYBIQQMrAILIAFBAWohAUHXASEEDKsCC0H2ASEEIAEiASACRg3DAiACIAFrIAAoAgAiCGohCSABIAhrQQJqIQoCQANAIAEtAAAgCEG61YCAAGotAABHDQMgCEECRg0BIAhBAWohCCABQQFqIgEgAkcNAAsgACAJNgIADMQCCyAAKAIEIQEgAEIANwMAAkAgACABIApBAWoiBBCzgICAACIBDQAgBCEBQeMBIQQMqwILIABB9QE2AhwgACAENgIUIAAgATYCDEEAIQQMwwILQfQBIQQgASIBIAJGDcICIAIgAWsgACgCACIIaiEJIAEgCGtBAWohCgJAA0AgAS0AACAIQbjVgIAAai0AAEcNAiAIQQFGDQEgCEEBaiEIIAFBAWoiASACRw0ACyAAIAk2AgAMwwILIABBgQQ7ASggACgCBCEEIABCADcDACAAIAQgCkEBaiIBELOAgIAAIgQNAyABIQEMAgsgAEEANgIAC0EAIQQgAEEANgIcIAAgATYCFCAAQeWfgIAANgIQIABBCDYCDAzAAgtB1QEhBAymAgsgAEHzATYCHCAAIAE2AhQgACAENgIMQQAhBAy+AgsCQCAAIAEiASACELSAgIAAIgQNACABIQEMbwsCQCAEQRVGDQAgAEEANgIcIAAgATYCFCAAQYKPgIAANgIQIABBIDYCDEEAIQQMvgILIABBjwE2AhwgACABNgIUIABB7JuAgAA2AhAgAEEVNgIMQQAhBAy9AgsCQCABIgEgAkYNACAAQY2AgIAANgIIIAAgATYCBCABIQFB0wEhBAykAgtB8gEhBAy8AgsCQCABIgEgAkcNAEHxASEEDLwCCwJAAkACQCABLQAAQbh/ag4LAAEICAgICAgICAIICyABQQFqIQFB0AEhBAykAgsgAUEBaiEBQdEBIQQMowILIAFBAWohAUHSASEEDKICC0HwASEEIAEiASACRg26AiACIAFrIAAoAgAiCGohCSABIAhrQQJqIQoDQCABLQAAIAhBtdWAgABqLQAARw0EIAhBAkYNAyAIQQFqIQggAUEBaiIBIAJHDQALIAAgCTYCAAy6AgtB7wEhBCABIgEgAkYNuQIgAiABayAAKAIAIghqIQkgASAIa0EBaiEKA0AgAS0AACAIQbPVgIAAai0AAEcNAyAIQQFGDQIgCEEBaiEIIAFBAWoiASACRw0ACyAAIAk2AgAMuQILQe4BIQQgASIBIAJGDbgCIAIgAWsgACgCACIIaiEJIAEgCGtBAmohCgNAIAEtAAAgCEGw1YCAAGotAABHDQIgCEECRg0BIAhBAWohCCABQQFqIgEgAkcNAAsgACAJNgIADLgCCyAAKAIEIQEgAEIANwMAAkAgACABIApBAWoiBBCtgICAACIBDQAgBCEBDAMLIABB7AE2AhwgACAENgIUIAAgATYCDEEAIQQMtwILIABBADYCAAsgACgCBCECIABBADYCBAJAIAAgAiABEK2AgIAAIgINACABIQEMngILIABB7QE2AhwgACABNgIUIAAgAjYCDEEAIQQMtQILQc8BIQQMmwILAkACQAJAIAAgASIBIAIQroCAgAAiBA0AIAEhAQwBCyAEQRVGDQEgAEEANgIcIAAgATYCFCAAQeqNgIAANgIQIABBJjYCDEEAIQQMtQILQc4BIQQMmwILIABB6wE2AhwgACABNgIUIABBgJuAgAA2AhAgAEEVNgIMQQAhBAyzAgsCQCABIgEgAkcNAEHrASEEDLMCCwJAIAEtAABBL0cNACABQQFqIQEMAQsgAEEANgIcIAAgATYCFCAAQbK4gIAANgIQIABBCDYCDEEAIQQMsgILQc0BIQQMmAIL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FCADIAE2AhAgAyABNgIMIAJBcGogATYCACACQWxqIAE2AgAgAkFoaiABNgIAIAJBZGogATYCACAEIANBBHFBGHIiBWsiAkEgSQ0AIAGtQoGAgIAQfiEGIAMgBWohAQNAIAEgBjcDGCABIAY3AxAgASAGNwMIIAEgBjcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACwvFTQEAQYAIC71NAQAAAAAAAAACAAAAAwAAAAAAAAAAAAAABAAAAAUAAAAAAAAAAAAAAAYAAAAHAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEludmFsaWQgY2hhciBpbiB1cmwgcXVlcnkAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9ib2R5AENvbnRlbnQtTGVuZ3RoIG92ZXJmbG93AENodW5rIHNpemUgb3ZlcmZsb3cASW52YWxpZCBtZXRob2QgZm9yIEhUVFAveC54IHJlcXVlc3QASW52YWxpZCBtZXRob2QgZm9yIFJUU1AveC54IHJlcXVlc3QARXhwZWN0ZWQgU09VUkNFIG1ldGhvZCBmb3IgSUNFL3gueCByZXF1ZXN0AEludmFsaWQgY2hhciBpbiB1cmwgZnJhZ21lbnQgc3RhcnQARXhwZWN0ZWQgZG90AFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fc3RhdHVzAEludmFsaWQgcmVzcG9uc2Ugc3RhdHVzAEV4cGVjdGVkIExGIGFmdGVyIGhlYWRlcnMASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucwBVc2VyIGNhbGxiYWNrIGVycm9yAGBvbl9yZXNldGAgY2FsbGJhY2sgZXJyb3IAYG9uX2NodW5rX2hlYWRlcmAgY2FsbGJhY2sgZXJyb3IAYG9uX21lc3NhZ2VfYmVnaW5gIGNhbGxiYWNrIGVycm9yAGBvbl9jaHVua19leHRlbnNpb25fdmFsdWVgIGNhbGxiYWNrIGVycm9yAGBvbl9zdGF0dXNfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl92ZXJzaW9uX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fdXJsX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fcHJvdG9jb2xfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9jaHVua19jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX2hlYWRlcl92YWx1ZV9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX21lc3NhZ2VfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9tZXRob2RfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9oZWFkZXJfZmllbGRfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9jaHVua19leHRlbnNpb25fbmFtZWAgY2FsbGJhY2sgZXJyb3IAVW5leHBlY3RlZCBjaGFyIGluIHVybCBzZXJ2ZXIASW52YWxpZCBoZWFkZXIgdmFsdWUgY2hhcgBJbnZhbGlkIGhlYWRlciBmaWVsZCBjaGFyAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fdmVyc2lvbgBJbnZhbGlkIG1pbm9yIHZlcnNpb24ASW52YWxpZCBtYWpvciB2ZXJzaW9uAEV4cGVjdGVkIHNwYWNlIGFmdGVyIHZlcnNpb24ARXhwZWN0ZWQgQ1JMRiBhZnRlciB2ZXJzaW9uAEludmFsaWQgSFRUUCB2ZXJzaW9uAEludmFsaWQgaGVhZGVyIHRva2VuAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fdXJsAEludmFsaWQgY2hhcmFjdGVycyBpbiB1cmwAVW5leHBlY3RlZCBzdGFydCBjaGFyIGluIHVybABEb3VibGUgQCBpbiB1cmwAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9wcm90b2NvbABFbXB0eSBDb250ZW50LUxlbmd0aABJbnZhbGlkIGNoYXJhY3RlciBpbiBDb250ZW50LUxlbmd0aABUcmFuc2Zlci1FbmNvZGluZyBjYW4ndCBiZSBwcmVzZW50IHdpdGggQ29udGVudC1MZW5ndGgARHVwbGljYXRlIENvbnRlbnQtTGVuZ3RoAEludmFsaWQgY2hhciBpbiB1cmwgcGF0aABDb250ZW50LUxlbmd0aCBjYW4ndCBiZSBwcmVzZW50IHdpdGggVHJhbnNmZXItRW5jb2RpbmcATWlzc2luZyBleHBlY3RlZCBDUiBhZnRlciBjaHVuayBzaXplAEV4cGVjdGVkIExGIGFmdGVyIGNodW5rIHNpemUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgc2l6ZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2hlYWRlcl92YWx1ZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2NodW5rX2V4dGVuc2lvbl92YWx1ZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zIHZhbHVlAFVuZXhwZWN0ZWQgd2hpdGVzcGFjZSBhZnRlciBoZWFkZXIgdmFsdWUATWlzc2luZyBleHBlY3RlZCBDUiBhZnRlciBoZWFkZXIgdmFsdWUATWlzc2luZyBleHBlY3RlZCBMRiBhZnRlciBoZWFkZXIgdmFsdWUASW52YWxpZCBgVHJhbnNmZXItRW5jb2RpbmdgIGhlYWRlciB2YWx1ZQBNaXNzaW5nIGV4cGVjdGVkIENSIGFmdGVyIGNodW5rIGV4dGVuc2lvbiB2YWx1ZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zIHF1b3RlIHZhbHVlAEludmFsaWQgcXVvdGVkLXBhaXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyBxdW90ZWQgdmFsdWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyBxdW90ZWQgdmFsdWUAUGF1c2VkIGJ5IG9uX2hlYWRlcnNfY29tcGxldGUASW52YWxpZCBFT0Ygc3RhdGUAb25fcmVzZXQgcGF1c2UAb25fY2h1bmtfaGVhZGVyIHBhdXNlAG9uX21lc3NhZ2VfYmVnaW4gcGF1c2UAb25fY2h1bmtfZXh0ZW5zaW9uX3ZhbHVlIHBhdXNlAG9uX3N0YXR1c19jb21wbGV0ZSBwYXVzZQBvbl92ZXJzaW9uX2NvbXBsZXRlIHBhdXNlAG9uX3VybF9jb21wbGV0ZSBwYXVzZQBvbl9wcm90b2NvbF9jb21wbGV0ZSBwYXVzZQBvbl9jaHVua19jb21wbGV0ZSBwYXVzZQBvbl9oZWFkZXJfdmFsdWVfY29tcGxldGUgcGF1c2UAb25fbWVzc2FnZV9jb21wbGV0ZSBwYXVzZQBvbl9tZXRob2RfY29tcGxldGUgcGF1c2UAb25faGVhZGVyX2ZpZWxkX2NvbXBsZXRlIHBhdXNlAG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lIHBhdXNlAFVuZXhwZWN0ZWQgc3BhY2UgYWZ0ZXIgc3RhcnQgbGluZQBNaXNzaW5nIGV4cGVjdGVkIENSIGFmdGVyIHJlc3BvbnNlIGxpbmUAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9jaHVua19leHRlbnNpb25fbmFtZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zIG5hbWUATWlzc2luZyBleHBlY3RlZCBDUiBhZnRlciBjaHVuayBleHRlbnNpb24gbmFtZQBJbnZhbGlkIHN0YXR1cyBjb2RlAFBhdXNlIG9uIENPTk5FQ1QvVXBncmFkZQBQYXVzZSBvbiBQUkkvVXBncmFkZQBFeHBlY3RlZCBIVFRQLzIgQ29ubmVjdGlvbiBQcmVmYWNlAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fbWV0aG9kAEV4cGVjdGVkIHNwYWNlIGFmdGVyIG1ldGhvZABTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2hlYWRlcl9maWVsZABQYXVzZWQASW52YWxpZCB3b3JkIGVuY291bnRlcmVkAEludmFsaWQgbWV0aG9kIGVuY291bnRlcmVkAE1pc3NpbmcgZXhwZWN0ZWQgQ1IgYWZ0ZXIgY2h1bmsgZGF0YQBFeHBlY3RlZCBMRiBhZnRlciBjaHVuayBkYXRhAFVuZXhwZWN0ZWQgY2hhciBpbiB1cmwgc2NoZW1hAFJlcXVlc3QgaGFzIGludmFsaWQgYFRyYW5zZmVyLUVuY29kaW5nYABEYXRhIGFmdGVyIGBDb25uZWN0aW9uOiBjbG9zZWAAU1dJVENIX1BST1hZAFVTRV9QUk9YWQBNS0FDVElWSVRZAFVOUFJPQ0VTU0FCTEVfRU5USVRZAFFVRVJZAENPUFkATU9WRURfUEVSTUFORU5UTFkAVE9PX0VBUkxZAE5PVElGWQBGQUlMRURfREVQRU5ERU5DWQBCQURfR0FURVdBWQBQTEFZAFBVVABDSEVDS09VVABHQVRFV0FZX1RJTUVPVVQAUkVRVUVTVF9USU1FT1VUAE5FVFdPUktfQ09OTkVDVF9USU1FT1VUAENPTk5FQ1RJT05fVElNRU9VVABMT0dJTl9USU1FT1VUAE5FVFdPUktfUkVBRF9USU1FT1VUAFBPU1QATUlTRElSRUNURURfUkVRVUVTVABDTElFTlRfQ0xPU0VEX1JFUVVFU1QAQ0xJRU5UX0NMT1NFRF9MT0FEX0JBTEFOQ0VEX1JFUVVFU1QAQkFEX1JFUVVFU1QASFRUUF9SRVFVRVNUX1NFTlRfVE9fSFRUUFNfUE9SVABSRVBPUlQASU1fQV9URUFQT1QAUkVTRVRfQ09OVEVOVABOT19DT05URU5UAFBBUlRJQUxfQ09OVEVOVABIUEVfSU5WQUxJRF9DT05TVEFOVABIUEVfQ0JfUkVTRVQAR0VUAEhQRV9TVFJJQ1QAQ09ORkxJQ1QAVEVNUE9SQVJZX1JFRElSRUNUAFBFUk1BTkVOVF9SRURJUkVDVABDT05ORUNUAE1VTFRJX1NUQVRVUwBIUEVfSU5WQUxJRF9TVEFUVVMAVE9PX01BTllfUkVRVUVTVFMARUFSTFlfSElOVFMAVU5BVkFJTEFCTEVfRk9SX0xFR0FMX1JFQVNPTlMAT1BUSU9OUwBTV0lUQ0hJTkdfUFJPVE9DT0xTAFZBUklBTlRfQUxTT19ORUdPVElBVEVTAE1VTFRJUExFX0NIT0lDRVMASU5URVJOQUxfU0VSVkVSX0VSUk9SAFdFQl9TRVJWRVJfVU5LTk9XTl9FUlJPUgBSQUlMR1VOX0VSUk9SAElERU5USVRZX1BST1ZJREVSX0FVVEhFTlRJQ0FUSU9OX0VSUk9SAFNTTF9DRVJUSUZJQ0FURV9FUlJPUgBJTlZBTElEX1hfRk9SV0FSREVEX0ZPUgBTRVRfUEFSQU1FVEVSAEdFVF9QQVJBTUVURVIASFBFX1VTRVIAU0VFX09USEVSAEhQRV9DQl9DSFVOS19IRUFERVIARXhwZWN0ZWQgTEYgYWZ0ZXIgQ1IATUtDQUxFTkRBUgBTRVRVUABXRUJfU0VSVkVSX0lTX0RPV04AVEVBUkRPV04ASFBFX0NMT1NFRF9DT05ORUNUSU9OAEhFVVJJU1RJQ19FWFBJUkFUSU9OAERJU0NPTk5FQ1RFRF9PUEVSQVRJT04ATk9OX0FVVEhPUklUQVRJVkVfSU5GT1JNQVRJT04ASFBFX0lOVkFMSURfVkVSU0lPTgBIUEVfQ0JfTUVTU0FHRV9CRUdJTgBTSVRFX0lTX0ZST1pFTgBIUEVfSU5WQUxJRF9IRUFERVJfVE9LRU4ASU5WQUxJRF9UT0tFTgBGT1JCSURERU4ARU5IQU5DRV9ZT1VSX0NBTE0ASFBFX0lOVkFMSURfVVJMAEJMT0NLRURfQllfUEFSRU5UQUxfQ09OVFJPTABNS0NPTABBQ0wASFBFX0lOVEVSTkFMAFJFUVVFU1RfSEVBREVSX0ZJRUxEU19UT09fTEFSR0VfVU5PRkZJQ0lBTABIUEVfT0sAVU5MSU5LAFVOTE9DSwBQUkkAUkVUUllfV0lUSABIUEVfSU5WQUxJRF9DT05URU5UX0xFTkdUSABIUEVfVU5FWFBFQ1RFRF9DT05URU5UX0xFTkdUSABGTFVTSABQUk9QUEFUQ0gATS1TRUFSQ0gAVVJJX1RPT19MT05HAFBST0NFU1NJTkcATUlTQ0VMTEFORU9VU19QRVJTSVNURU5UX1dBUk5JTkcATUlTQ0VMTEFORU9VU19XQVJOSU5HAEhQRV9JTlZBTElEX1RSQU5TRkVSX0VOQ09ESU5HAEV4cGVjdGVkIENSTEYASFBFX0lOVkFMSURfQ0hVTktfU0laRQBNT1ZFAENPTlRJTlVFAEhQRV9DQl9TVEFUVVNfQ09NUExFVEUASFBFX0NCX0hFQURFUlNfQ09NUExFVEUASFBFX0NCX1ZFUlNJT05fQ09NUExFVEUASFBFX0NCX1VSTF9DT01QTEVURQBIUEVfQ0JfUFJPVE9DT0xfQ09NUExFVEUASFBFX0NCX0NIVU5LX0NPTVBMRVRFAEhQRV9DQl9IRUFERVJfVkFMVUVfQ09NUExFVEUASFBFX0NCX0NIVU5LX0VYVEVOU0lPTl9WQUxVRV9DT01QTEVURQBIUEVfQ0JfQ0hVTktfRVhURU5TSU9OX05BTUVfQ09NUExFVEUASFBFX0NCX01FU1NBR0VfQ09NUExFVEUASFBFX0NCX01FVEhPRF9DT01QTEVURQBIUEVfQ0JfSEVBREVSX0ZJRUxEX0NPTVBMRVRFAERFTEVURQBIUEVfSU5WQUxJRF9FT0ZfU1RBVEUASU5WQUxJRF9TU0xfQ0VSVElGSUNBVEUAUEFVU0UATk9fUkVTUE9OU0UAVU5TVVBQT1JURURfTUVESUFfVFlQRQBHT05FAE5PVF9BQ0NFUFRBQkxFAFNFUlZJQ0VfVU5BVkFJTEFCTEUAUkFOR0VfTk9UX1NBVElTRklBQkxFAE9SSUdJTl9JU19VTlJFQUNIQUJMRQBSRVNQT05TRV9JU19TVEFMRQBQVVJHRQBNRVJHRQBSRVFVRVNUX0hFQURFUl9GSUVMRFNfVE9PX0xBUkdFAFJFUVVFU1RfSEVBREVSX1RPT19MQVJHRQBQQVlMT0FEX1RPT19MQVJHRQBJTlNVRkZJQ0lFTlRfU1RPUkFHRQBIUEVfUEFVU0VEX1VQR1JBREUASFBFX1BBVVNFRF9IMl9VUEdSQURFAFNPVVJDRQBBTk5PVU5DRQBUUkFDRQBIUEVfVU5FWFBFQ1RFRF9TUEFDRQBERVNDUklCRQBVTlNVQlNDUklCRQBSRUNPUkQASFBFX0lOVkFMSURfTUVUSE9EAE5PVF9GT1VORABQUk9QRklORABVTkJJTkQAUkVCSU5EAFVOQVVUSE9SSVpFRABNRVRIT0RfTk9UX0FMTE9XRUQASFRUUF9WRVJTSU9OX05PVF9TVVBQT1JURUQAQUxSRUFEWV9SRVBPUlRFRABBQ0NFUFRFRABOT1RfSU1QTEVNRU5URUQATE9PUF9ERVRFQ1RFRABIUEVfQ1JfRVhQRUNURUQASFBFX0xGX0VYUEVDVEVEAENSRUFURUQASU1fVVNFRABIUEVfUEFVU0VEAFRJTUVPVVRfT0NDVVJFRABQQVlNRU5UX1JFUVVJUkVEAFBSRUNPTkRJVElPTl9SRVFVSVJFRABQUk9YWV9BVVRIRU5USUNBVElPTl9SRVFVSVJFRABORVRXT1JLX0FVVEhFTlRJQ0FUSU9OX1JFUVVJUkVEAExFTkdUSF9SRVFVSVJFRABTU0xfQ0VSVElGSUNBVEVfUkVRVUlSRUQAVVBHUkFERV9SRVFVSVJFRABQQUdFX0VYUElSRUQAUFJFQ09ORElUSU9OX0ZBSUxFRABFWFBFQ1RBVElPTl9GQUlMRUQAUkVWQUxJREFUSU9OX0ZBSUxFRABTU0xfSEFORFNIQUtFX0ZBSUxFRABMT0NLRUQAVFJBTlNGT1JNQVRJT05fQVBQTElFRABOT1RfTU9ESUZJRUQATk9UX0VYVEVOREVEAEJBTkRXSURUSF9MSU1JVF9FWENFRURFRABTSVRFX0lTX09WRVJMT0FERUQASEVBRABFeHBlY3RlZCBIVFRQLywgUlRTUC8gb3IgSUNFLwDnFQAArxUAAKQSAACSGgAAJhYAAJ4UAADbGQAAeRUAAH4SAAD+FAAANhUAAAsWAADYFgAA8xIAAEIYAACsFgAAEhUAABQXAADvFwAASBQAAHEXAACyGgAAaxkAAH4ZAAA1FAAAghoAAEQXAAD9FgAAHhgAAIcXAACqGQAAkxIAAAcYAAAsFwAAyhcAAKQXAADnFQAA5xUAAFgXAAA7GAAAoBIAAC0cAADDEQAASBEAAN4SAABCEwAApBkAAP0QAAD3FQAApRUAAO8WAAD4GQAAShYAAFYWAAD1FQAAChoAAAgaAAABGgAAqxUAAEISAADXEAAATBEAAAUZAABUFgAAHhEAAMoZAADIGQAAThYAAP8YAABxFAAA8BUAAO4VAACUGQAA/BUAAL8ZAACbGQAAfBQAAEMRAABwGAAAlRQAACcUAAAZFAAA1RIAANQZAABEFgAA9xAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAABAAACAAAAAAAAAAAAAAAAAAAAAAAAAAMEAwMDAwMAAAMDAAMDAAMDAwMDAwMDAwMABQAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAgAAAAAAAAAAAAAAAAAAAAAAAAADAAMDAwMDAAADAwADAwADAwMDAwMDAwMDAAQABQAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAwADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbG9zZWVlcC1hbGl2ZQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBY2h1bmtlZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQEBAQEAAAEBAAEBAAEBAQEBAQEBAQEAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABlY3Rpb25lbnQtbGVuZ3Rob25yb3h5LWNvbm5lY3Rpb24AAAAAAAAAAAAAAAAAAAByYW5zZmVyLWVuY29kaW5ncGdyYWRlDQoNClNNDQoNCgAAAAAAAAAAAAECAAEDAAAAAAAAAAAAAAAAAAAAAAAABAUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAgABAwAAAAAAAAAAAAAAAAAAAAAAAAQFBQYFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAgIAAgICAgICAgICAgICAgICAgICAgICAgICAgICAAICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECAAEDAAAAAAAAAAAAAAAAAAAAAAAABAUAAAUFBQUFBQUFBQUFBgUFBQUFBQUFBQUFBQAFAAcIBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFAAUABQAFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQABAQAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEAAQEAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAgAAAAACAAAAAAAAAAAAAAAAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE5PVU5DRUVDS09VVE5FQ1RFVEVDUklCRUxVU0hFVEVBRFNFQVJDSFJHRUNUSVZJVFlMRU5EQVJWRU9USUZZUFRJT05TQ0hTRUFZU1RBVENIR0VVRVJZT1JESVJFQ1RPUlRSQ0hQQVJBTUVURVJVUkNFQlNDUklCRUFSRE9XTkFDRUlORE5LQ0tVQlNDUklCRVRUUENFVFNQQURUUC8=";
    var wasmBuffer;
    Object.defineProperty(module2, "exports", {
      get: /* @__PURE__ */ __name(() => {
        return wasmBuffer ? wasmBuffer : wasmBuffer = Buffer2.from(wasmBase64, "base64");
      }, "get")
    });
  }
});

// lib/web/fetch/constants.js
var require_constants3 = __commonJS({
  "lib/web/fetch/constants.js"(exports2, module2) {
    "use strict";
    var corsSafeListedMethods = (
      /** @type {const} */
      ["GET", "HEAD", "POST"]
    );
    var corsSafeListedMethodsSet = new Set(corsSafeListedMethods);
    var nullBodyStatus = (
      /** @type {const} */
      [101, 204, 205, 304]
    );
    var redirectStatus = (
      /** @type {const} */
      [301, 302, 303, 307, 308]
    );
    var redirectStatusSet = new Set(redirectStatus);
    var badPorts = (
      /** @type {const} */
      [
        "1",
        "7",
        "9",
        "11",
        "13",
        "15",
        "17",
        "19",
        "20",
        "21",
        "22",
        "23",
        "25",
        "37",
        "42",
        "43",
        "53",
        "69",
        "77",
        "79",
        "87",
        "95",
        "101",
        "102",
        "103",
        "104",
        "109",
        "110",
        "111",
        "113",
        "115",
        "117",
        "119",
        "123",
        "135",
        "137",
        "139",
        "143",
        "161",
        "179",
        "389",
        "427",
        "465",
        "512",
        "513",
        "514",
        "515",
        "526",
        "530",
        "531",
        "532",
        "540",
        "548",
        "554",
        "556",
        "563",
        "587",
        "601",
        "636",
        "989",
        "990",
        "993",
        "995",
        "1719",
        "1720",
        "1723",
        "2049",
        "3659",
        "4045",
        "4190",
        "5060",
        "5061",
        "6000",
        "6566",
        "6665",
        "6666",
        "6667",
        "6668",
        "6669",
        "6679",
        "6697",
        "10080"
      ]
    );
    var badPortsSet = new Set(badPorts);
    var referrerPolicyTokens = (
      /** @type {const} */
      [
        "no-referrer",
        "no-referrer-when-downgrade",
        "same-origin",
        "origin",
        "strict-origin",
        "origin-when-cross-origin",
        "strict-origin-when-cross-origin",
        "unsafe-url"
      ]
    );
    var referrerPolicy = (
      /** @type {const} */
      [
        "",
        ...referrerPolicyTokens
      ]
    );
    var referrerPolicyTokensSet = new Set(referrerPolicyTokens);
    var requestRedirect = (
      /** @type {const} */
      ["follow", "manual", "error"]
    );
    var safeMethods = (
      /** @type {const} */
      ["GET", "HEAD", "OPTIONS", "TRACE"]
    );
    var safeMethodsSet = new Set(safeMethods);
    var requestMode = (
      /** @type {const} */
      ["navigate", "same-origin", "no-cors", "cors"]
    );
    var requestCredentials = (
      /** @type {const} */
      ["omit", "same-origin", "include"]
    );
    var requestCache = (
      /** @type {const} */
      [
        "default",
        "no-store",
        "reload",
        "no-cache",
        "force-cache",
        "only-if-cached"
      ]
    );
    var requestBodyHeader = (
      /** @type {const} */
      [
        "content-encoding",
        "content-language",
        "content-location",
        "content-type",
        // See https://github.com/nodejs/undici/issues/2021
        // 'Content-Length' is a forbidden header name, which is typically
        // removed in the Headers implementation. However, undici doesn't
        // filter out headers, so we add it here.
        "content-length"
      ]
    );
    var requestDuplex = (
      /** @type {const} */
      [
        "half"
      ]
    );
    var forbiddenMethods = (
      /** @type {const} */
      ["CONNECT", "TRACE", "TRACK"]
    );
    var forbiddenMethodsSet = new Set(forbiddenMethods);
    var subresource = (
      /** @type {const} */
      [
        "audio",
        "audioworklet",
        "font",
        "image",
        "manifest",
        "paintworklet",
        "script",
        "style",
        "track",
        "video",
        "xslt",
        ""
      ]
    );
    var subresourceSet = new Set(subresource);
    module2.exports = {
      subresource,
      forbiddenMethods,
      requestBodyHeader,
      referrerPolicy,
      requestRedirect,
      requestMode,
      requestCredentials,
      requestCache,
      redirectStatus,
      corsSafeListedMethods,
      nullBodyStatus,
      safeMethods,
      badPorts,
      requestDuplex,
      subresourceSet,
      badPortsSet,
      redirectStatusSet,
      corsSafeListedMethodsSet,
      safeMethodsSet,
      forbiddenMethodsSet,
      referrerPolicyTokens: referrerPolicyTokensSet
    };
  }
});

// lib/web/fetch/global.js
var require_global = __commonJS({
  "lib/web/fetch/global.js"(exports2, module2) {
    "use strict";
    var globalOrigin = /* @__PURE__ */ Symbol.for("undici.globalOrigin.1");
    function getGlobalOrigin() {
      return globalThis[globalOrigin];
    }
    __name(getGlobalOrigin, "getGlobalOrigin");
    function setGlobalOrigin(newOrigin) {
      if (newOrigin === void 0) {
        Object.defineProperty(globalThis, globalOrigin, {
          value: void 0,
          writable: true,
          enumerable: false,
          configurable: false
        });
        return;
      }
      const parsedURL = new URL(newOrigin);
      if (parsedURL.protocol !== "http:" && parsedURL.protocol !== "https:") {
        throw new TypeError(`Only http & https urls are allowed, received ${parsedURL.protocol}`);
      }
      Object.defineProperty(globalThis, globalOrigin, {
        value: parsedURL,
        writable: true,
        enumerable: false,
        configurable: false
      });
    }
    __name(setGlobalOrigin, "setGlobalOrigin");
    module2.exports = {
      getGlobalOrigin,
      setGlobalOrigin
    };
  }
});

// lib/encoding/index.js
var require_encoding = __commonJS({
  "lib/encoding/index.js"(exports2, module2) {
    "use strict";
    var textDecoder = new TextDecoder();
    function utf8DecodeBytes(buffer) {
      if (buffer.length === 0) {
        return "";
      }
      if (buffer[0] === 239 && buffer[1] === 187 && buffer[2] === 191) {
        buffer = buffer.subarray(3);
      }
      const output = textDecoder.decode(buffer);
      return output;
    }
    __name(utf8DecodeBytes, "utf8DecodeBytes");
    module2.exports = {
      utf8DecodeBytes
    };
  }
});

// lib/web/infra/index.js
var require_infra = __commonJS({
  "lib/web/infra/index.js"(exports2, module2) {
    "use strict";
    var assert = require("node:assert");
    var { utf8DecodeBytes } = require_encoding();
    function collectASequenceOfCodePoints(condition, input, position) {
      let result = "";
      while (position.position < input.length && condition(input[position.position])) {
        result += input[position.position];
        position.position++;
      }
      return result;
    }
    __name(collectASequenceOfCodePoints, "collectASequenceOfCodePoints");
    function collectASequenceOfCodePointsFast(char, input, position) {
      const idx = input.indexOf(char, position.position);
      const start = position.position;
      if (idx === -1) {
        position.position = input.length;
        return input.slice(start);
      }
      position.position = idx;
      return input.slice(start, position.position);
    }
    __name(collectASequenceOfCodePointsFast, "collectASequenceOfCodePointsFast");
    var ASCII_WHITESPACE_REPLACE_REGEX = /[\u0009\u000A\u000C\u000D\u0020]/g;
    function forgivingBase64(data) {
      data = data.replace(ASCII_WHITESPACE_REPLACE_REGEX, "");
      let dataLength = data.length;
      if (dataLength % 4 === 0) {
        if (data.charCodeAt(dataLength - 1) === 61) {
          --dataLength;
          if (data.charCodeAt(dataLength - 1) === 61) {
            --dataLength;
          }
        }
      }
      if (dataLength % 4 === 1) {
        return "failure";
      }
      if (/[^+/0-9A-Za-z]/.test(data.length === dataLength ? data : data.substring(0, dataLength))) {
        return "failure";
      }
      const buffer = Buffer.from(data, "base64");
      return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }
    __name(forgivingBase64, "forgivingBase64");
    function isASCIIWhitespace(char) {
      return char === 9 || // \t
      char === 10 || // \n
      char === 12 || // \f
      char === 13 || // \r
      char === 32;
    }
    __name(isASCIIWhitespace, "isASCIIWhitespace");
    function isomorphicDecode(input) {
      const length = input.length;
      if ((2 << 15) - 1 > length) {
        return String.fromCharCode.apply(null, input);
      }
      let result = "";
      let i = 0;
      let addition = (2 << 15) - 1;
      while (i < length) {
        if (i + addition > length) {
          addition = length - i;
        }
        result += String.fromCharCode.apply(null, input.subarray(i, i += addition));
      }
      return result;
    }
    __name(isomorphicDecode, "isomorphicDecode");
    var invalidIsomorphicEncodeValueRegex = /[^\x00-\xFF]/;
    function isomorphicEncode(input) {
      assert(!invalidIsomorphicEncodeValueRegex.test(input));
      return input;
    }
    __name(isomorphicEncode, "isomorphicEncode");
    function parseJSONFromBytes(bytes) {
      return JSON.parse(utf8DecodeBytes(bytes));
    }
    __name(parseJSONFromBytes, "parseJSONFromBytes");
    function removeASCIIWhitespace(str, leading = true, trailing = true) {
      return removeChars(str, leading, trailing, isASCIIWhitespace);
    }
    __name(removeASCIIWhitespace, "removeASCIIWhitespace");
    function removeChars(str, leading, trailing, predicate) {
      let lead = 0;
      let trail = str.length - 1;
      if (leading) {
        while (lead < str.length && predicate(str.charCodeAt(lead))) lead++;
      }
      if (trailing) {
        while (trail > 0 && predicate(str.charCodeAt(trail))) trail--;
      }
      return lead === 0 && trail === str.length - 1 ? str : str.slice(lead, trail + 1);
    }
    __name(removeChars, "removeChars");
    function serializeJavascriptValueToJSONString(value) {
      const result = JSON.stringify(value);
      if (result === void 0) {
        throw new TypeError("Value is not JSON serializable");
      }
      assert(typeof result === "string");
      return result;
    }
    __name(serializeJavascriptValueToJSONString, "serializeJavascriptValueToJSONString");
    module2.exports = {
      collectASequenceOfCodePoints,
      collectASequenceOfCodePointsFast,
      forgivingBase64,
      isASCIIWhitespace,
      isomorphicDecode,
      isomorphicEncode,
      parseJSONFromBytes,
      removeASCIIWhitespace,
      removeChars,
      serializeJavascriptValueToJSONString
    };
  }
});

// lib/web/fetch/data-url.js
var require_data_url = __commonJS({
  "lib/web/fetch/data-url.js"(exports2, module2) {
    "use strict";
    var assert = require("node:assert");
    var { forgivingBase64, collectASequenceOfCodePoints, collectASequenceOfCodePointsFast, isomorphicDecode, removeASCIIWhitespace, removeChars } = require_infra();
    var encoder = new TextEncoder();
    var HTTP_TOKEN_CODEPOINTS = /^[-!#$%&'*+.^_|~A-Za-z0-9]+$/u;
    var HTTP_WHITESPACE_REGEX = /[\u000A\u000D\u0009\u0020]/u;
    var HTTP_QUOTED_STRING_TOKENS = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/u;
    function dataURLProcessor(dataURL) {
      assert(dataURL.protocol === "data:");
      let input = URLSerializer(dataURL, true);
      input = input.slice(5);
      const position = { position: 0 };
      let mimeType = collectASequenceOfCodePointsFast(
        ",",
        input,
        position
      );
      const mimeTypeLength = mimeType.length;
      mimeType = removeASCIIWhitespace(mimeType, true, true);
      if (position.position >= input.length) {
        return "failure";
      }
      position.position++;
      const encodedBody = input.slice(mimeTypeLength + 1);
      let body = stringPercentDecode(encodedBody);
      if (/;(?:\u0020*)base64$/ui.test(mimeType)) {
        const stringBody = isomorphicDecode(body);
        body = forgivingBase64(stringBody);
        if (body === "failure") {
          return "failure";
        }
        mimeType = mimeType.slice(0, -6);
        mimeType = mimeType.replace(/(\u0020+)$/u, "");
        mimeType = mimeType.slice(0, -1);
      }
      if (mimeType.startsWith(";")) {
        mimeType = "text/plain" + mimeType;
      }
      let mimeTypeRecord = parseMIMEType(mimeType);
      if (mimeTypeRecord === "failure") {
        mimeTypeRecord = parseMIMEType("text/plain;charset=US-ASCII");
      }
      return { mimeType: mimeTypeRecord, body };
    }
    __name(dataURLProcessor, "dataURLProcessor");
    function URLSerializer(url, excludeFragment = false) {
      if (!excludeFragment) {
        return url.href;
      }
      const href = url.href;
      const hashLength = url.hash.length;
      const serialized = hashLength === 0 ? href : href.substring(0, href.length - hashLength);
      if (!hashLength && href.endsWith("#")) {
        return serialized.slice(0, -1);
      }
      return serialized;
    }
    __name(URLSerializer, "URLSerializer");
    function stringPercentDecode(input) {
      const bytes = encoder.encode(input);
      return percentDecode(bytes);
    }
    __name(stringPercentDecode, "stringPercentDecode");
    function isHexCharByte(byte) {
      return byte >= 48 && byte <= 57 || byte >= 65 && byte <= 70 || byte >= 97 && byte <= 102;
    }
    __name(isHexCharByte, "isHexCharByte");
    function hexByteToNumber(byte) {
      return (
        // 0-9
        byte >= 48 && byte <= 57 ? byte - 48 : (byte & 223) - 55
      );
    }
    __name(hexByteToNumber, "hexByteToNumber");
    function percentDecode(input) {
      const length = input.length;
      const output = new Uint8Array(length);
      let j = 0;
      let i = 0;
      while (i < length) {
        const byte = input[i];
        if (byte !== 37) {
          output[j++] = byte;
        } else if (byte === 37 && !(isHexCharByte(input[i + 1]) && isHexCharByte(input[i + 2]))) {
          output[j++] = 37;
        } else {
          output[j++] = hexByteToNumber(input[i + 1]) << 4 | hexByteToNumber(input[i + 2]);
          i += 2;
        }
        ++i;
      }
      return length === j ? output : output.subarray(0, j);
    }
    __name(percentDecode, "percentDecode");
    function parseMIMEType(input) {
      input = removeHTTPWhitespace(input, true, true);
      const position = { position: 0 };
      const type = collectASequenceOfCodePointsFast(
        "/",
        input,
        position
      );
      if (type.length === 0 || !HTTP_TOKEN_CODEPOINTS.test(type)) {
        return "failure";
      }
      if (position.position >= input.length) {
        return "failure";
      }
      position.position++;
      let subtype = collectASequenceOfCodePointsFast(
        ";",
        input,
        position
      );
      subtype = removeHTTPWhitespace(subtype, false, true);
      if (subtype.length === 0 || !HTTP_TOKEN_CODEPOINTS.test(subtype)) {
        return "failure";
      }
      const typeLowercase = type.toLowerCase();
      const subtypeLowercase = subtype.toLowerCase();
      const mimeType = {
        type: typeLowercase,
        subtype: subtypeLowercase,
        /** @type {Map<string, string>} */
        parameters: /* @__PURE__ */ new Map(),
        // https://mimesniff.spec.whatwg.org/#mime-type-essence
        essence: `${typeLowercase}/${subtypeLowercase}`
      };
      while (position.position < input.length) {
        position.position++;
        collectASequenceOfCodePoints(
          // https://fetch.spec.whatwg.org/#http-whitespace
          (char) => HTTP_WHITESPACE_REGEX.test(char),
          input,
          position
        );
        let parameterName = collectASequenceOfCodePoints(
          (char) => char !== ";" && char !== "=",
          input,
          position
        );
        parameterName = parameterName.toLowerCase();
        if (position.position < input.length) {
          if (input[position.position] === ";") {
            continue;
          }
          position.position++;
        }
        if (position.position >= input.length) {
          break;
        }
        let parameterValue = null;
        if (input[position.position] === '"') {
          parameterValue = collectAnHTTPQuotedString(input, position, true);
          collectASequenceOfCodePointsFast(
            ";",
            input,
            position
          );
        } else {
          parameterValue = collectASequenceOfCodePointsFast(
            ";",
            input,
            position
          );
          parameterValue = removeHTTPWhitespace(parameterValue, false, true);
          if (parameterValue.length === 0) {
            continue;
          }
        }
        if (parameterName.length !== 0 && HTTP_TOKEN_CODEPOINTS.test(parameterName) && (parameterValue.length === 0 || HTTP_QUOTED_STRING_TOKENS.test(parameterValue)) && !mimeType.parameters.has(parameterName)) {
          mimeType.parameters.set(parameterName, parameterValue);
        }
      }
      return mimeType;
    }
    __name(parseMIMEType, "parseMIMEType");
    function collectAnHTTPQuotedString(input, position, extractValue = false) {
      const positionStart = position.position;
      let value = "";
      assert(input[position.position] === '"');
      position.position++;
      while (true) {
        value += collectASequenceOfCodePoints(
          (char) => char !== '"' && char !== "\\",
          input,
          position
        );
        if (position.position >= input.length) {
          break;
        }
        const quoteOrBackslash = input[position.position];
        position.position++;
        if (quoteOrBackslash === "\\") {
          if (position.position >= input.length) {
            value += "\\";
            break;
          }
          value += input[position.position];
          position.position++;
        } else {
          assert(quoteOrBackslash === '"');
          break;
        }
      }
      if (extractValue) {
        return value;
      }
      return input.slice(positionStart, position.position);
    }
    __name(collectAnHTTPQuotedString, "collectAnHTTPQuotedString");
    function serializeAMimeType(mimeType) {
      assert(mimeType !== "failure");
      const { parameters, essence } = mimeType;
      let serialization = essence;
      for (let [name, value] of parameters.entries()) {
        serialization += ";";
        serialization += name;
        serialization += "=";
        if (!HTTP_TOKEN_CODEPOINTS.test(value)) {
          value = value.replace(/[\\"]/ug, "\\$&");
          value = '"' + value;
          value += '"';
        }
        serialization += value;
      }
      return serialization;
    }
    __name(serializeAMimeType, "serializeAMimeType");
    function isHTTPWhiteSpace(char) {
      return char === 13 || char === 10 || char === 9 || char === 32;
    }
    __name(isHTTPWhiteSpace, "isHTTPWhiteSpace");
    function removeHTTPWhitespace(str, leading = true, trailing = true) {
      return removeChars(str, leading, trailing, isHTTPWhiteSpace);
    }
    __name(removeHTTPWhitespace, "removeHTTPWhitespace");
    function minimizeSupportedMimeType(mimeType) {
      switch (mimeType.essence) {
        case "application/ecmascript":
        case "application/javascript":
        case "application/x-ecmascript":
        case "application/x-javascript":
        case "text/ecmascript":
        case "text/javascript":
        case "text/javascript1.0":
        case "text/javascript1.1":
        case "text/javascript1.2":
        case "text/javascript1.3":
        case "text/javascript1.4":
        case "text/javascript1.5":
        case "text/jscript":
        case "text/livescript":
        case "text/x-ecmascript":
        case "text/x-javascript":
          return "text/javascript";
        case "application/json":
        case "text/json":
          return "application/json";
        case "image/svg+xml":
          return "image/svg+xml";
        case "text/xml":
        case "application/xml":
          return "application/xml";
      }
      if (mimeType.subtype.endsWith("+json")) {
        return "application/json";
      }
      if (mimeType.subtype.endsWith("+xml")) {
        return "application/xml";
      }
      return "";
    }
    __name(minimizeSupportedMimeType, "minimizeSupportedMimeType");
    module2.exports = {
      dataURLProcessor,
      URLSerializer,
      stringPercentDecode,
      parseMIMEType,
      collectAnHTTPQuotedString,
      serializeAMimeType,
      removeHTTPWhitespace,
      minimizeSupportedMimeType,
      HTTP_TOKEN_CODEPOINTS
    };
  }
});

// lib/util/runtime-features.js
var require_runtime_features = __commonJS({
  "lib/util/runtime-features.js"(exports2, module2) {
    "use strict";
    var lazyLoaders = {
      __proto__: null,
      "node:crypto": /* @__PURE__ */ __name(() => require("node:crypto"), "node:crypto"),
      "node:sqlite": /* @__PURE__ */ __name(() => require("node:sqlite"), "node:sqlite"),
      "node:worker_threads": /* @__PURE__ */ __name(() => require("node:worker_threads"), "node:worker_threads"),
      "node:zlib": /* @__PURE__ */ __name(() => require("node:zlib"), "node:zlib")
    };
    function detectRuntimeFeatureByNodeModule(moduleName) {
      try {
        lazyLoaders[moduleName]();
        return true;
      } catch (err) {
        if (err.code !== "ERR_UNKNOWN_BUILTIN_MODULE" && err.code !== "ERR_NO_CRYPTO") {
          throw err;
        }
        return false;
      }
    }
    __name(detectRuntimeFeatureByNodeModule, "detectRuntimeFeatureByNodeModule");
    function detectRuntimeFeatureByExportedProperty(moduleName, property) {
      const module3 = lazyLoaders[moduleName]();
      return typeof module3[property] !== "undefined";
    }
    __name(detectRuntimeFeatureByExportedProperty, "detectRuntimeFeatureByExportedProperty");
    var runtimeFeaturesByExportedProperty = (
      /** @type {const} */
      ["markAsUncloneable", "zstd"]
    );
    var exportedPropertyLookup = {
      markAsUncloneable: ["node:worker_threads", "markAsUncloneable"],
      zstd: ["node:zlib", "createZstdDecompress"]
    };
    var runtimeFeaturesAsNodeModule = (
      /** @type {const} */
      ["crypto", "sqlite"]
    );
    var features = (
      /** @type {const} */
      [
        ...runtimeFeaturesAsNodeModule,
        ...runtimeFeaturesByExportedProperty
      ]
    );
    function detectRuntimeFeature(feature) {
      if (runtimeFeaturesAsNodeModule.includes(
        /** @type {RuntimeFeatureByNodeModule} */
        feature
      )) {
        return detectRuntimeFeatureByNodeModule(`node:${feature}`);
      } else if (runtimeFeaturesByExportedProperty.includes(
        /** @type {RuntimeFeatureByExportedProperty} */
        feature
      )) {
        const [moduleName, property] = exportedPropertyLookup[feature];
        return detectRuntimeFeatureByExportedProperty(moduleName, property);
      }
      throw new TypeError(`unknown feature: ${feature}`);
    }
    __name(detectRuntimeFeature, "detectRuntimeFeature");
    var RuntimeFeatures = class {
      static {
        __name(this, "RuntimeFeatures");
      }
      /** @type {Map<Feature, boolean>} */
      #map = /* @__PURE__ */ new Map();
      /**
       * Clears all cached feature detections.
       */
      clear() {
        this.#map.clear();
      }
      /**
       * @param {Feature} feature
       * @returns {boolean}
       */
      has(feature) {
        return this.#map.get(feature) ?? this.#detectRuntimeFeature(feature);
      }
      /**
       * @param {Feature} feature
       * @param {boolean} value
       */
      set(feature, value) {
        if (features.includes(feature) === false) {
          throw new TypeError(`unknown feature: ${feature}`);
        }
        this.#map.set(feature, value);
      }
      /**
       * @param {Feature} feature
       * @returns {boolean}
       */
      #detectRuntimeFeature(feature) {
        const result = detectRuntimeFeature(feature);
        this.#map.set(feature, result);
        return result;
      }
    };
    var instance = new RuntimeFeatures();
    module2.exports.runtimeFeatures = instance;
    module2.exports.default = instance;
  }
});

// lib/web/webidl/index.js
var require_webidl = __commonJS({
  "lib/web/webidl/index.js"(exports2, module2) {
    "use strict";
    var assert = require("node:assert");
    var { types, inspect } = require("node:util");
    var { runtimeFeatures } = require_runtime_features();
    var UNDEFINED = 1;
    var BOOLEAN = 2;
    var STRING = 3;
    var SYMBOL = 4;
    var NUMBER = 5;
    var BIGINT = 6;
    var NULL = 7;
    var OBJECT = 8;
    var FunctionPrototypeSymbolHasInstance = Function.call.bind(Function.prototype[Symbol.hasInstance]);
    var webidl = {
      converters: {},
      util: {},
      errors: {},
      is: {}
    };
    webidl.errors.exception = function(message) {
      return new TypeError(`${message.header}: ${message.message}`);
    };
    webidl.errors.conversionFailed = function(opts) {
      const plural = opts.types.length === 1 ? "" : " one of";
      const message = `${opts.argument} could not be converted to${plural}: ${opts.types.join(", ")}.`;
      return webidl.errors.exception({
        header: opts.prefix,
        message
      });
    };
    webidl.errors.invalidArgument = function(context) {
      return webidl.errors.exception({
        header: context.prefix,
        message: `"${context.value}" is an invalid ${context.type}.`
      });
    };
    webidl.brandCheck = function(V, I) {
      if (!FunctionPrototypeSymbolHasInstance(I, V)) {
        const err = new TypeError("Illegal invocation");
        err.code = "ERR_INVALID_THIS";
        throw err;
      }
    };
    webidl.brandCheckMultiple = function(List) {
      const prototypes = List.map((c) => webidl.util.MakeTypeAssertion(c));
      return (V) => {
        if (prototypes.every((typeCheck) => !typeCheck(V))) {
          const err = new TypeError("Illegal invocation");
          err.code = "ERR_INVALID_THIS";
          throw err;
        }
      };
    };
    webidl.argumentLengthCheck = function({ length }, min, ctx) {
      if (length < min) {
        throw webidl.errors.exception({
          message: `${min} argument${min !== 1 ? "s" : ""} required, but${length ? " only" : ""} ${length} found.`,
          header: ctx
        });
      }
    };
    webidl.illegalConstructor = function() {
      throw webidl.errors.exception({
        header: "TypeError",
        message: "Illegal constructor"
      });
    };
    webidl.util.MakeTypeAssertion = function(I) {
      return (O) => FunctionPrototypeSymbolHasInstance(I, O);
    };
    webidl.util.Type = function(V) {
      switch (typeof V) {
        case "undefined":
          return UNDEFINED;
        case "boolean":
          return BOOLEAN;
        case "string":
          return STRING;
        case "symbol":
          return SYMBOL;
        case "number":
          return NUMBER;
        case "bigint":
          return BIGINT;
        case "function":
        case "object": {
          if (V === null) {
            return NULL;
          }
          return OBJECT;
        }
      }
    };
    webidl.util.Types = {
      UNDEFINED,
      BOOLEAN,
      STRING,
      SYMBOL,
      NUMBER,
      BIGINT,
      NULL,
      OBJECT
    };
    webidl.util.TypeValueToString = function(o) {
      switch (webidl.util.Type(o)) {
        case UNDEFINED:
          return "Undefined";
        case BOOLEAN:
          return "Boolean";
        case STRING:
          return "String";
        case SYMBOL:
          return "Symbol";
        case NUMBER:
          return "Number";
        case BIGINT:
          return "BigInt";
        case NULL:
          return "Null";
        case OBJECT:
          return "Object";
      }
    };
    webidl.util.markAsUncloneable = runtimeFeatures.has("markAsUncloneable") ? require("node:worker_threads").markAsUncloneable : () => {
    };
    webidl.util.ConvertToInt = function(V, bitLength, signedness, flags) {
      let upperBound;
      let lowerBound;
      if (bitLength === 64) {
        upperBound = Math.pow(2, 53) - 1;
        if (signedness === "unsigned") {
          lowerBound = 0;
        } else {
          lowerBound = Math.pow(-2, 53) + 1;
        }
      } else if (signedness === "unsigned") {
        lowerBound = 0;
        upperBound = Math.pow(2, bitLength) - 1;
      } else {
        lowerBound = Math.pow(-2, bitLength) - 1;
        upperBound = Math.pow(2, bitLength - 1) - 1;
      }
      let x = Number(V);
      if (x === 0) {
        x = 0;
      }
      if (webidl.util.HasFlag(flags, webidl.attributes.EnforceRange)) {
        if (Number.isNaN(x) || x === Number.POSITIVE_INFINITY || x === Number.NEGATIVE_INFINITY) {
          throw webidl.errors.exception({
            header: "Integer conversion",
            message: `Could not convert ${webidl.util.Stringify(V)} to an integer.`
          });
        }
        x = webidl.util.IntegerPart(x);
        if (x < lowerBound || x > upperBound) {
          throw webidl.errors.exception({
            header: "Integer conversion",
            message: `Value must be between ${lowerBound}-${upperBound}, got ${x}.`
          });
        }
        return x;
      }
      if (!Number.isNaN(x) && webidl.util.HasFlag(flags, webidl.attributes.Clamp)) {
        x = Math.min(Math.max(x, lowerBound), upperBound);
        if (Math.floor(x) % 2 === 0) {
          x = Math.floor(x);
        } else {
          x = Math.ceil(x);
        }
        return x;
      }
      if (Number.isNaN(x) || x === 0 && Object.is(0, x) || x === Number.POSITIVE_INFINITY || x === Number.NEGATIVE_INFINITY) {
        return 0;
      }
      x = webidl.util.IntegerPart(x);
      x = x % Math.pow(2, bitLength);
      if (signedness === "signed" && x >= Math.pow(2, bitLength) - 1) {
        return x - Math.pow(2, bitLength);
      }
      return x;
    };
    webidl.util.IntegerPart = function(n) {
      const r = Math.floor(Math.abs(n));
      if (n < 0) {
        return -1 * r;
      }
      return r;
    };
    webidl.util.Stringify = function(V) {
      const type = webidl.util.Type(V);
      switch (type) {
        case SYMBOL:
          return `Symbol(${V.description})`;
        case OBJECT:
          return inspect(V);
        case STRING:
          return `"${V}"`;
        case BIGINT:
          return `${V}n`;
        default:
          return `${V}`;
      }
    };
    webidl.util.IsResizableArrayBuffer = function(V) {
      if (types.isArrayBuffer(V)) {
        return V.resizable;
      }
      if (types.isSharedArrayBuffer(V)) {
        return V.growable;
      }
      throw webidl.errors.exception({
        header: "IsResizableArrayBuffer",
        message: `"${webidl.util.Stringify(V)}" is not an array buffer.`
      });
    };
    webidl.util.HasFlag = function(flags, attributes) {
      return typeof flags === "number" && (flags & attributes) === attributes;
    };
    webidl.sequenceConverter = function(converter) {
      return (V, prefix, argument, Iterable) => {
        if (webidl.util.Type(V) !== OBJECT) {
          throw webidl.errors.exception({
            header: prefix,
            message: `${argument} (${webidl.util.Stringify(V)}) is not iterable.`
          });
        }
        const method = typeof Iterable === "function" ? Iterable() : V?.[Symbol.iterator]?.();
        const seq = [];
        let index = 0;
        if (method === void 0 || typeof method.next !== "function") {
          throw webidl.errors.exception({
            header: prefix,
            message: `${argument} is not iterable.`
          });
        }
        while (true) {
          const { done, value } = method.next();
          if (done) {
            break;
          }
          seq.push(converter(value, prefix, `${argument}[${index++}]`));
        }
        return seq;
      };
    };
    webidl.recordConverter = function(keyConverter, valueConverter) {
      return (O, prefix, argument) => {
        if (webidl.util.Type(O) !== OBJECT) {
          throw webidl.errors.exception({
            header: prefix,
            message: `${argument} ("${webidl.util.TypeValueToString(O)}") is not an Object.`
          });
        }
        const result = {};
        if (!types.isProxy(O)) {
          const keys2 = [...Object.getOwnPropertyNames(O), ...Object.getOwnPropertySymbols(O)];
          for (const key of keys2) {
            const keyName = webidl.util.Stringify(key);
            const typedKey = keyConverter(key, prefix, `Key ${keyName} in ${argument}`);
            const typedValue = valueConverter(O[key], prefix, `${argument}[${keyName}]`);
            result[typedKey] = typedValue;
          }
          return result;
        }
        const keys = Reflect.ownKeys(O);
        for (const key of keys) {
          const desc = Reflect.getOwnPropertyDescriptor(O, key);
          if (desc?.enumerable) {
            const typedKey = keyConverter(key, prefix, argument);
            const typedValue = valueConverter(O[key], prefix, argument);
            result[typedKey] = typedValue;
          }
        }
        return result;
      };
    };
    webidl.interfaceConverter = function(TypeCheck, name) {
      return (V, prefix, argument) => {
        if (!TypeCheck(V)) {
          throw webidl.errors.exception({
            header: prefix,
            message: `Expected ${argument} ("${webidl.util.Stringify(V)}") to be an instance of ${name}.`
          });
        }
        return V;
      };
    };
    webidl.dictionaryConverter = function(converters) {
      converters.sort((a, b) => (a.key > b.key) - (a.key < b.key));
      return (dictionary, prefix, argument) => {
        const dict = {};
        if (dictionary != null && webidl.util.Type(dictionary) !== OBJECT) {
          throw webidl.errors.exception({
            header: prefix,
            message: `Expected ${dictionary} to be one of: Null, Undefined, Object.`
          });
        }
        for (const options of converters) {
          const { key, defaultValue, required, converter } = options;
          if (required === true) {
            if (dictionary == null || !Object.hasOwn(dictionary, key)) {
              throw webidl.errors.exception({
                header: prefix,
                message: `Missing required key "${key}".`
              });
            }
          }
          let value = dictionary?.[key];
          const hasDefault = defaultValue !== void 0;
          if (hasDefault && value === void 0) {
            value = defaultValue();
          }
          if (required || hasDefault || value !== void 0) {
            value = converter(value, prefix, `${argument}.${key}`);
            if (options.allowedValues && !options.allowedValues.includes(value)) {
              throw webidl.errors.exception({
                header: prefix,
                message: `${value} is not an accepted type. Expected one of ${options.allowedValues.join(", ")}.`
              });
            }
            dict[key] = value;
          }
        }
        return dict;
      };
    };
    webidl.nullableConverter = function(converter) {
      return (V, prefix, argument) => {
        if (V === null) {
          return V;
        }
        return converter(V, prefix, argument);
      };
    };
    webidl.is.USVString = function(value) {
      return typeof value === "string" && value.isWellFormed();
    };
    webidl.is.ReadableStream = webidl.util.MakeTypeAssertion(ReadableStream);
    webidl.is.Blob = webidl.util.MakeTypeAssertion(Blob);
    webidl.is.URLSearchParams = webidl.util.MakeTypeAssertion(URLSearchParams);
    webidl.is.File = webidl.util.MakeTypeAssertion(File);
    webidl.is.URL = webidl.util.MakeTypeAssertion(URL);
    webidl.is.AbortSignal = webidl.util.MakeTypeAssertion(AbortSignal);
    webidl.is.MessagePort = webidl.util.MakeTypeAssertion(MessagePort);
    webidl.is.BufferSource = function(V) {
      return types.isArrayBuffer(V) || ArrayBuffer.isView(V) && types.isArrayBuffer(V.buffer);
    };
    webidl.util.getCopyOfBytesHeldByBufferSource = function(bufferSource) {
      const jsBufferSource = bufferSource;
      let jsArrayBuffer = jsBufferSource;
      let offset = 0;
      let length = 0;
      if (types.isTypedArray(jsBufferSource) || types.isDataView(jsBufferSource)) {
        jsArrayBuffer = jsBufferSource.buffer;
        offset = jsBufferSource.byteOffset;
        length = jsBufferSource.byteLength;
      } else {
        assert(types.isAnyArrayBuffer(jsBufferSource));
        length = jsBufferSource.byteLength;
      }
      if (jsArrayBuffer.detached) {
        return new Uint8Array(0);
      }
      const bytes = new Uint8Array(length);
      const view = new Uint8Array(jsArrayBuffer, offset, length);
      bytes.set(view);
      return bytes;
    };
    webidl.converters.DOMString = function(V, prefix, argument, flags) {
      if (V === null && webidl.util.HasFlag(flags, webidl.attributes.LegacyNullToEmptyString)) {
        return "";
      }
      if (typeof V === "symbol") {
        throw webidl.errors.exception({
          header: prefix,
          message: `${argument} is a symbol, which cannot be converted to a DOMString.`
        });
      }
      return String(V);
    };
    webidl.converters.ByteString = function(V, prefix, argument) {
      if (typeof V === "symbol") {
        throw webidl.errors.exception({
          header: prefix,
          message: `${argument} is a symbol, which cannot be converted to a ByteString.`
        });
      }
      const x = String(V);
      for (let index = 0; index < x.length; index++) {
        if (x.charCodeAt(index) > 255) {
          throw new TypeError(
            `Cannot convert argument to a ByteString because the character at index ${index} has a value of ${x.charCodeAt(index)} which is greater than 255.`
          );
        }
      }
      return x;
    };
    webidl.converters.USVString = function(value) {
      if (typeof value === "string") {
        return value.toWellFormed();
      }
      return `${value}`.toWellFormed();
    };
    webidl.converters.boolean = function(V) {
      const x = Boolean(V);
      return x;
    };
    webidl.converters.any = function(V) {
      return V;
    };
    webidl.converters["long long"] = function(V, prefix, argument) {
      const x = webidl.util.ConvertToInt(V, 64, "signed", 0, prefix, argument);
      return x;
    };
    webidl.converters["unsigned long long"] = function(V, prefix, argument) {
      const x = webidl.util.ConvertToInt(V, 64, "unsigned", 0, prefix, argument);
      return x;
    };
    webidl.converters["unsigned long"] = function(V, prefix, argument) {
      const x = webidl.util.ConvertToInt(V, 32, "unsigned", 0, prefix, argument);
      return x;
    };
    webidl.converters["unsigned short"] = function(V, prefix, argument, flags) {
      const x = webidl.util.ConvertToInt(V, 16, "unsigned", flags, prefix, argument);
      return x;
    };
    webidl.converters.ArrayBuffer = function(V, prefix, argument, flags) {
      if (webidl.util.Type(V) !== OBJECT || !types.isArrayBuffer(V)) {
        throw webidl.errors.conversionFailed({
          prefix,
          argument: `${argument} ("${webidl.util.Stringify(V)}")`,
          types: ["ArrayBuffer"]
        });
      }
      if (!webidl.util.HasFlag(flags, webidl.attributes.AllowResizable) && webidl.util.IsResizableArrayBuffer(V)) {
        throw webidl.errors.exception({
          header: prefix,
          message: `${argument} cannot be a resizable ArrayBuffer.`
        });
      }
      return V;
    };
    webidl.converters.SharedArrayBuffer = function(V, prefix, argument, flags) {
      if (webidl.util.Type(V) !== OBJECT || !types.isSharedArrayBuffer(V)) {
        throw webidl.errors.conversionFailed({
          prefix,
          argument: `${argument} ("${webidl.util.Stringify(V)}")`,
          types: ["SharedArrayBuffer"]
        });
      }
      if (!webidl.util.HasFlag(flags, webidl.attributes.AllowResizable) && webidl.util.IsResizableArrayBuffer(V)) {
        throw webidl.errors.exception({
          header: prefix,
          message: `${argument} cannot be a resizable SharedArrayBuffer.`
        });
      }
      return V;
    };
    webidl.converters.TypedArray = function(V, T, prefix, argument, flags) {
      if (webidl.util.Type(V) !== OBJECT || !types.isTypedArray(V) || V.constructor.name !== T.name) {
        throw webidl.errors.conversionFailed({
          prefix,
          argument: `${argument} ("${webidl.util.Stringify(V)}")`,
          types: [T.name]
        });
      }
      if (!webidl.util.HasFlag(flags, webidl.attributes.AllowShared) && types.isSharedArrayBuffer(V.buffer)) {
        throw webidl.errors.exception({
          header: prefix,
          message: `${argument} cannot be a view on a shared array buffer.`
        });
      }
      if (!webidl.util.HasFlag(flags, webidl.attributes.AllowResizable) && webidl.util.IsResizableArrayBuffer(V.buffer)) {
        throw webidl.errors.exception({
          header: prefix,
          message: `${argument} cannot be a view on a resizable array buffer.`
        });
      }
      return V;
    };
    webidl.converters.DataView = function(V, prefix, argument, flags) {
      if (webidl.util.Type(V) !== OBJECT || !types.isDataView(V)) {
        throw webidl.errors.conversionFailed({
          prefix,
          argument: `${argument} ("${webidl.util.Stringify(V)}")`,
          types: ["DataView"]
        });
      }
      if (!webidl.util.HasFlag(flags, webidl.attributes.AllowShared) && types.isSharedArrayBuffer(V.buffer)) {
        throw webidl.errors.exception({
          header: prefix,
          message: `${argument} cannot be a view on a shared array buffer.`
        });
      }
      if (!webidl.util.HasFlag(flags, webidl.attributes.AllowResizable) && webidl.util.IsResizableArrayBuffer(V.buffer)) {
        throw webidl.errors.exception({
          header: prefix,
          message: `${argument} cannot be a view on a resizable array buffer.`
        });
      }
      return V;
    };
    webidl.converters.ArrayBufferView = function(V, prefix, argument, flags) {
      if (webidl.util.Type(V) !== OBJECT || !types.isArrayBufferView(V)) {
        throw webidl.errors.conversionFailed({
          prefix,
          argument: `${argument} ("${webidl.util.Stringify(V)}")`,
          types: ["ArrayBufferView"]
        });
      }
      if (!webidl.util.HasFlag(flags, webidl.attributes.AllowShared) && types.isSharedArrayBuffer(V.buffer)) {
        throw webidl.errors.exception({
          header: prefix,
          message: `${argument} cannot be a view on a shared array buffer.`
        });
      }
      if (!webidl.util.HasFlag(flags, webidl.attributes.AllowResizable) && webidl.util.IsResizableArrayBuffer(V.buffer)) {
        throw webidl.errors.exception({
          header: prefix,
          message: `${argument} cannot be a view on a resizable array buffer.`
        });
      }
      return V;
    };
    webidl.converters.BufferSource = function(V, prefix, argument, flags) {
      if (types.isArrayBuffer(V)) {
        return webidl.converters.ArrayBuffer(V, prefix, argument, flags);
      }
      if (types.isArrayBufferView(V)) {
        flags &= ~webidl.attributes.AllowShared;
        return webidl.converters.ArrayBufferView(V, prefix, argument, flags);
      }
      if (types.isSharedArrayBuffer(V)) {
        throw webidl.errors.exception({
          header: prefix,
          message: `${argument} cannot be a SharedArrayBuffer.`
        });
      }
      throw webidl.errors.conversionFailed({
        prefix,
        argument: `${argument} ("${webidl.util.Stringify(V)}")`,
        types: ["ArrayBuffer", "ArrayBufferView"]
      });
    };
    webidl.converters.AllowSharedBufferSource = function(V, prefix, argument, flags) {
      if (types.isArrayBuffer(V)) {
        return webidl.converters.ArrayBuffer(V, prefix, argument, flags);
      }
      if (types.isSharedArrayBuffer(V)) {
        return webidl.converters.SharedArrayBuffer(V, prefix, argument, flags);
      }
      if (types.isArrayBufferView(V)) {
        flags |= webidl.attributes.AllowShared;
        return webidl.converters.ArrayBufferView(V, prefix, argument, flags);
      }
      throw webidl.errors.conversionFailed({
        prefix,
        argument: `${argument} ("${webidl.util.Stringify(V)}")`,
        types: ["ArrayBuffer", "SharedArrayBuffer", "ArrayBufferView"]
      });
    };
    webidl.converters["sequence<ByteString>"] = webidl.sequenceConverter(
      webidl.converters.ByteString
    );
    webidl.converters["sequence<sequence<ByteString>>"] = webidl.sequenceConverter(
      webidl.converters["sequence<ByteString>"]
    );
    webidl.converters["record<ByteString, ByteString>"] = webidl.recordConverter(
      webidl.converters.ByteString,
      webidl.converters.ByteString
    );
    webidl.converters.Blob = webidl.interfaceConverter(webidl.is.Blob, "Blob");
    webidl.converters.AbortSignal = webidl.interfaceConverter(
      webidl.is.AbortSignal,
      "AbortSignal"
    );
    webidl.converters.EventHandlerNonNull = function(V) {
      if (webidl.util.Type(V) !== OBJECT) {
        return null;
      }
      if (typeof V === "function") {
        return V;
      }
      return () => {
      };
    };
    webidl.attributes = {
      Clamp: 1 << 0,
      EnforceRange: 1 << 1,
      AllowShared: 1 << 2,
      AllowResizable: 1 << 3,
      LegacyNullToEmptyString: 1 << 4
    };
    module2.exports = {
      webidl
    };
  }
});

// lib/web/fetch/util.js
var require_util2 = __commonJS({
  "lib/web/fetch/util.js"(exports2, module2) {
    "use strict";
    var { Transform } = require("node:stream");
    var zlib = require("node:zlib");
    var { redirectStatusSet, referrerPolicyTokens, badPortsSet } = require_constants3();
    var { getGlobalOrigin } = require_global();
    var { collectAnHTTPQuotedString, parseMIMEType } = require_data_url();
    var { performance: performance2 } = require("node:perf_hooks");
    var { ReadableStreamFrom, isValidHTTPToken, normalizedMethodRecordsBase } = require_util();
    var assert = require("node:assert");
    var { isUint8Array } = require("node:util/types");
    var { webidl } = require_webidl();
    var { isomorphicEncode, collectASequenceOfCodePoints, removeChars } = require_infra();
    function responseURL(response) {
      const urlList = response.urlList;
      const length = urlList.length;
      return length === 0 ? null : urlList[length - 1].toString();
    }
    __name(responseURL, "responseURL");
    function responseLocationURL(response, requestFragment) {
      if (!redirectStatusSet.has(response.status)) {
        return null;
      }
      let location = response.headersList.get("location", true);
      if (location !== null && isValidHeaderValue(location)) {
        if (!isValidEncodedURL(location)) {
          location = normalizeBinaryStringToUtf8(location);
        }
        location = new URL(location, responseURL(response));
      }
      if (location && !location.hash) {
        location.hash = requestFragment;
      }
      return location;
    }
    __name(responseLocationURL, "responseLocationURL");
    function isValidEncodedURL(url) {
      for (let i = 0; i < url.length; ++i) {
        const code = url.charCodeAt(i);
        if (code > 126 || // Non-US-ASCII + DEL
        code < 32) {
          return false;
        }
      }
      return true;
    }
    __name(isValidEncodedURL, "isValidEncodedURL");
    function normalizeBinaryStringToUtf8(value) {
      return Buffer.from(value, "binary").toString("utf8");
    }
    __name(normalizeBinaryStringToUtf8, "normalizeBinaryStringToUtf8");
    function requestCurrentURL(request) {
      return request.urlList[request.urlList.length - 1];
    }
    __name(requestCurrentURL, "requestCurrentURL");
    function requestBadPort(request) {
      const url = requestCurrentURL(request);
      if (urlIsHttpHttpsScheme(url) && badPortsSet.has(url.port)) {
        return "blocked";
      }
      return "allowed";
    }
    __name(requestBadPort, "requestBadPort");
    function isErrorLike(object) {
      return object instanceof Error || (object?.constructor?.name === "Error" || object?.constructor?.name === "DOMException");
    }
    __name(isErrorLike, "isErrorLike");
    function isValidReasonPhrase(statusText) {
      for (let i = 0; i < statusText.length; ++i) {
        const c = statusText.charCodeAt(i);
        if (!(c === 9 || // HTAB
        c >= 32 && c <= 126 || // SP / VCHAR
        c >= 128 && c <= 255)) {
          return false;
        }
      }
      return true;
    }
    __name(isValidReasonPhrase, "isValidReasonPhrase");
    var isValidHeaderName = isValidHTTPToken;
    function isValidHeaderValue(potentialValue) {
      return (potentialValue[0] === "	" || potentialValue[0] === " " || potentialValue[potentialValue.length - 1] === "	" || potentialValue[potentialValue.length - 1] === " " || potentialValue.includes("\n") || potentialValue.includes("\r") || potentialValue.includes("\0")) === false;
    }
    __name(isValidHeaderValue, "isValidHeaderValue");
    function parseReferrerPolicy(actualResponse) {
      const policyHeader = (actualResponse.headersList.get("referrer-policy", true) ?? "").split(",");
      let policy = "";
      if (policyHeader.length) {
        for (let i = policyHeader.length; i !== 0; i--) {
          const token = policyHeader[i - 1].trim();
          if (referrerPolicyTokens.has(token)) {
            policy = token;
            break;
          }
        }
      }
      return policy;
    }
    __name(parseReferrerPolicy, "parseReferrerPolicy");
    function setRequestReferrerPolicyOnRedirect(request, actualResponse) {
      const policy = parseReferrerPolicy(actualResponse);
      if (policy !== "") {
        request.referrerPolicy = policy;
      }
    }
    __name(setRequestReferrerPolicyOnRedirect, "setRequestReferrerPolicyOnRedirect");
    function crossOriginResourcePolicyCheck() {
      return "allowed";
    }
    __name(crossOriginResourcePolicyCheck, "crossOriginResourcePolicyCheck");
    function corsCheck() {
      return "success";
    }
    __name(corsCheck, "corsCheck");
    function TAOCheck() {
      return "success";
    }
    __name(TAOCheck, "TAOCheck");
    function appendFetchMetadata(httpRequest) {
      let header = null;
      header = httpRequest.mode;
      httpRequest.headersList.set("sec-fetch-mode", header, true);
    }
    __name(appendFetchMetadata, "appendFetchMetadata");
    function appendRequestOriginHeader(request) {
      let serializedOrigin = request.origin;
      if (serializedOrigin === "client" || serializedOrigin === void 0) {
        return;
      }
      if (request.responseTainting === "cors" || request.mode === "websocket") {
        request.headersList.append("origin", serializedOrigin, true);
      } else if (request.method !== "GET" && request.method !== "HEAD") {
        switch (request.referrerPolicy) {
          case "no-referrer":
            serializedOrigin = null;
            break;
          case "no-referrer-when-downgrade":
          case "strict-origin":
          case "strict-origin-when-cross-origin":
            if (request.origin && urlHasHttpsScheme(request.origin) && !urlHasHttpsScheme(requestCurrentURL(request))) {
              serializedOrigin = null;
            }
            break;
          case "same-origin":
            if (!sameOrigin(request, requestCurrentURL(request))) {
              serializedOrigin = null;
            }
            break;
          default:
        }
        request.headersList.append("origin", serializedOrigin, true);
      }
    }
    __name(appendRequestOriginHeader, "appendRequestOriginHeader");
    function coarsenTime(timestamp, crossOriginIsolatedCapability) {
      return timestamp;
    }
    __name(coarsenTime, "coarsenTime");
    function clampAndCoarsenConnectionTimingInfo(connectionTimingInfo, defaultStartTime, crossOriginIsolatedCapability) {
      if (!connectionTimingInfo?.startTime || connectionTimingInfo.startTime < defaultStartTime) {
        return {
          domainLookupStartTime: defaultStartTime,
          domainLookupEndTime: defaultStartTime,
          connectionStartTime: defaultStartTime,
          connectionEndTime: defaultStartTime,
          secureConnectionStartTime: defaultStartTime,
          ALPNNegotiatedProtocol: connectionTimingInfo?.ALPNNegotiatedProtocol
        };
      }
      return {
        domainLookupStartTime: coarsenTime(connectionTimingInfo.domainLookupStartTime, crossOriginIsolatedCapability),
        domainLookupEndTime: coarsenTime(connectionTimingInfo.domainLookupEndTime, crossOriginIsolatedCapability),
        connectionStartTime: coarsenTime(connectionTimingInfo.connectionStartTime, crossOriginIsolatedCapability),
        connectionEndTime: coarsenTime(connectionTimingInfo.connectionEndTime, crossOriginIsolatedCapability),
        secureConnectionStartTime: coarsenTime(connectionTimingInfo.secureConnectionStartTime, crossOriginIsolatedCapability),
        ALPNNegotiatedProtocol: connectionTimingInfo.ALPNNegotiatedProtocol
      };
    }
    __name(clampAndCoarsenConnectionTimingInfo, "clampAndCoarsenConnectionTimingInfo");
    function coarsenedSharedCurrentTime(crossOriginIsolatedCapability) {
      return coarsenTime(performance2.now(), crossOriginIsolatedCapability);
    }
    __name(coarsenedSharedCurrentTime, "coarsenedSharedCurrentTime");
    function createOpaqueTimingInfo(timingInfo) {
      return {
        startTime: timingInfo.startTime ?? 0,
        redirectStartTime: 0,
        redirectEndTime: 0,
        postRedirectStartTime: timingInfo.startTime ?? 0,
        finalServiceWorkerStartTime: 0,
        finalNetworkResponseStartTime: 0,
        finalNetworkRequestStartTime: 0,
        endTime: 0,
        encodedBodySize: 0,
        decodedBodySize: 0,
        finalConnectionTimingInfo: null
      };
    }
    __name(createOpaqueTimingInfo, "createOpaqueTimingInfo");
    function makePolicyContainer() {
      return {
        referrerPolicy: "strict-origin-when-cross-origin"
      };
    }
    __name(makePolicyContainer, "makePolicyContainer");
    function clonePolicyContainer(policyContainer) {
      return {
        referrerPolicy: policyContainer.referrerPolicy
      };
    }
    __name(clonePolicyContainer, "clonePolicyContainer");
    function determineRequestsReferrer(request) {
      const policy = request.referrerPolicy;
      assert(policy);
      let referrerSource = null;
      if (request.referrer === "client") {
        const globalOrigin = getGlobalOrigin();
        if (!globalOrigin || globalOrigin.origin === "null") {
          return "no-referrer";
        }
        referrerSource = new URL(globalOrigin);
      } else if (webidl.is.URL(request.referrer)) {
        referrerSource = request.referrer;
      }
      let referrerURL = stripURLForReferrer(referrerSource);
      const referrerOrigin = stripURLForReferrer(referrerSource, true);
      if (referrerURL.toString().length > 4096) {
        referrerURL = referrerOrigin;
      }
      switch (policy) {
        case "no-referrer":
          return "no-referrer";
        case "origin":
          if (referrerOrigin != null) {
            return referrerOrigin;
          }
          return stripURLForReferrer(referrerSource, true);
        case "unsafe-url":
          return referrerURL;
        case "strict-origin": {
          const currentURL = requestCurrentURL(request);
          if (isURLPotentiallyTrustworthy(referrerURL) && !isURLPotentiallyTrustworthy(currentURL)) {
            return "no-referrer";
          }
          return referrerOrigin;
        }
        case "strict-origin-when-cross-origin": {
          const currentURL = requestCurrentURL(request);
          if (sameOrigin(referrerURL, currentURL)) {
            return referrerURL;
          }
          if (isURLPotentiallyTrustworthy(referrerURL) && !isURLPotentiallyTrustworthy(currentURL)) {
            return "no-referrer";
          }
          return referrerOrigin;
        }
        case "same-origin":
          if (sameOrigin(request, referrerURL)) {
            return referrerURL;
          }
          return "no-referrer";
        case "origin-when-cross-origin":
          if (sameOrigin(request, referrerURL)) {
            return referrerURL;
          }
          return referrerOrigin;
        case "no-referrer-when-downgrade": {
          const currentURL = requestCurrentURL(request);
          if (isURLPotentiallyTrustworthy(referrerURL) && !isURLPotentiallyTrustworthy(currentURL)) {
            return "no-referrer";
          }
          return referrerURL;
        }
      }
    }
    __name(determineRequestsReferrer, "determineRequestsReferrer");
    function stripURLForReferrer(url, originOnly = false) {
      assert(webidl.is.URL(url));
      url = new URL(url);
      if (urlIsLocal(url)) {
        return "no-referrer";
      }
      url.username = "";
      url.password = "";
      url.hash = "";
      if (originOnly === true) {
        url.pathname = "";
        url.search = "";
      }
      return url;
    }
    __name(stripURLForReferrer, "stripURLForReferrer");
    var isPotentialleTrustworthyIPv4 = RegExp.prototype.test.bind(/^127\.(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.){2}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)$/);
    var isPotentiallyTrustworthyIPv6 = RegExp.prototype.test.bind(/^(?:(?:0{1,4}:){7}|(?:0{1,4}:){1,6}:|::)0{0,3}1$/);
    function isOriginIPPotentiallyTrustworthy(origin) {
      if (origin.includes(":")) {
        if (origin[0] === "[" && origin[origin.length - 1] === "]") {
          origin = origin.slice(1, -1);
        }
        return isPotentiallyTrustworthyIPv6(origin);
      }
      return isPotentialleTrustworthyIPv4(origin);
    }
    __name(isOriginIPPotentiallyTrustworthy, "isOriginIPPotentiallyTrustworthy");
    function isOriginPotentiallyTrustworthy(origin) {
      if (origin == null || origin === "null") {
        return false;
      }
      origin = new URL(origin);
      if (origin.protocol === "https:" || origin.protocol === "wss:") {
        return true;
      }
      if (isOriginIPPotentiallyTrustworthy(origin.hostname)) {
        return true;
      }
      if (origin.hostname === "localhost" || origin.hostname === "localhost.") {
        return true;
      }
      if (origin.hostname.endsWith(".localhost") || origin.hostname.endsWith(".localhost.")) {
        return true;
      }
      if (origin.protocol === "file:") {
        return true;
      }
      return false;
    }
    __name(isOriginPotentiallyTrustworthy, "isOriginPotentiallyTrustworthy");
    function isURLPotentiallyTrustworthy(url) {
      if (!webidl.is.URL(url)) {
        return false;
      }
      if (url.href === "about:blank" || url.href === "about:srcdoc") {
        return true;
      }
      if (url.protocol === "data:") return true;
      if (url.protocol === "blob:") return true;
      return isOriginPotentiallyTrustworthy(url.origin);
    }
    __name(isURLPotentiallyTrustworthy, "isURLPotentiallyTrustworthy");
    function tryUpgradeRequestToAPotentiallyTrustworthyURL(request) {
    }
    __name(tryUpgradeRequestToAPotentiallyTrustworthyURL, "tryUpgradeRequestToAPotentiallyTrustworthyURL");
    function sameOrigin(A, B) {
      if (A.origin === B.origin && A.origin === "null") {
        return true;
      }
      if (A.protocol === B.protocol && A.hostname === B.hostname && A.port === B.port) {
        return true;
      }
      return false;
    }
    __name(sameOrigin, "sameOrigin");
    function isAborted(fetchParams) {
      return fetchParams.controller.state === "aborted";
    }
    __name(isAborted, "isAborted");
    function isCancelled(fetchParams) {
      return fetchParams.controller.state === "aborted" || fetchParams.controller.state === "terminated";
    }
    __name(isCancelled, "isCancelled");
    function normalizeMethod(method) {
      return normalizedMethodRecordsBase[method.toLowerCase()] ?? method;
    }
    __name(normalizeMethod, "normalizeMethod");
    var esIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
    function createIterator(name, kInternalIterator, keyIndex = 0, valueIndex = 1) {
      class FastIterableIterator {
        static {
          __name(this, "FastIterableIterator");
        }
        /** @type {any} */
        #target;
        /** @type {'key' | 'value' | 'key+value'} */
        #kind;
        /** @type {number} */
        #index;
        /**
         * @see https://webidl.spec.whatwg.org/#dfn-default-iterator-object
         * @param {unknown} target
         * @param {'key' | 'value' | 'key+value'} kind
         */
        constructor(target, kind) {
          this.#target = target;
          this.#kind = kind;
          this.#index = 0;
        }
        next() {
          if (typeof this !== "object" || this === null || !(#target in this)) {
            throw new TypeError(
              `'next' called on an object that does not implement interface ${name} Iterator.`
            );
          }
          const index = this.#index;
          const values = kInternalIterator(this.#target);
          const len = values.length;
          if (index >= len) {
            return {
              value: void 0,
              done: true
            };
          }
          const { [keyIndex]: key, [valueIndex]: value } = values[index];
          this.#index = index + 1;
          let result;
          switch (this.#kind) {
            case "key":
              result = key;
              break;
            case "value":
              result = value;
              break;
            case "key+value":
              result = [key, value];
              break;
          }
          return {
            value: result,
            done: false
          };
        }
      }
      delete FastIterableIterator.prototype.constructor;
      Object.setPrototypeOf(FastIterableIterator.prototype, esIteratorPrototype);
      Object.defineProperties(FastIterableIterator.prototype, {
        [Symbol.toStringTag]: {
          writable: false,
          enumerable: false,
          configurable: true,
          value: `${name} Iterator`
        },
        next: { writable: true, enumerable: true, configurable: true }
      });
      return function(target, kind) {
        return new FastIterableIterator(target, kind);
      };
    }
    __name(createIterator, "createIterator");
    function iteratorMixin(name, object, kInternalIterator, keyIndex = 0, valueIndex = 1) {
      const makeIterator = createIterator(name, kInternalIterator, keyIndex, valueIndex);
      const properties = {
        keys: {
          writable: true,
          enumerable: true,
          configurable: true,
          value: /* @__PURE__ */ __name(function keys() {
            webidl.brandCheck(this, object);
            return makeIterator(this, "key");
          }, "keys")
        },
        values: {
          writable: true,
          enumerable: true,
          configurable: true,
          value: /* @__PURE__ */ __name(function values() {
            webidl.brandCheck(this, object);
            return makeIterator(this, "value");
          }, "values")
        },
        entries: {
          writable: true,
          enumerable: true,
          configurable: true,
          value: /* @__PURE__ */ __name(function entries() {
            webidl.brandCheck(this, object);
            return makeIterator(this, "key+value");
          }, "entries")
        },
        forEach: {
          writable: true,
          enumerable: true,
          configurable: true,
          value: /* @__PURE__ */ __name(function forEach(callbackfn, thisArg = globalThis) {
            webidl.brandCheck(this, object);
            webidl.argumentLengthCheck(arguments, 1, `${name}.forEach`);
            if (typeof callbackfn !== "function") {
              throw new TypeError(
                `Failed to execute 'forEach' on '${name}': parameter 1 is not of type 'Function'.`
              );
            }
            for (const { 0: key, 1: value } of makeIterator(this, "key+value")) {
              callbackfn.call(thisArg, value, key, this);
            }
          }, "forEach")
        }
      };
      return Object.defineProperties(object.prototype, {
        ...properties,
        [Symbol.iterator]: {
          writable: true,
          enumerable: false,
          configurable: true,
          value: properties.entries.value
        }
      });
    }
    __name(iteratorMixin, "iteratorMixin");
    function fullyReadBody(body, processBody, processBodyError) {
      const successSteps = processBody;
      const errorSteps = processBodyError;
      try {
        const reader = body.stream.getReader();
        readAllBytes(reader, successSteps, errorSteps);
      } catch (e) {
        errorSteps(e);
      }
    }
    __name(fullyReadBody, "fullyReadBody");
    function readableStreamClose(controller) {
      try {
        controller.close();
        controller.byobRequest?.respond(0);
      } catch (err) {
        if (!err.message.includes("Controller is already closed") && !err.message.includes("ReadableStream is already closed")) {
          throw err;
        }
      }
    }
    __name(readableStreamClose, "readableStreamClose");
    async function readAllBytes(reader, successSteps, failureSteps) {
      try {
        const bytes = [];
        let byteLength = 0;
        do {
          const { done, value: chunk } = await reader.read();
          if (done) {
            successSteps(Buffer.concat(bytes, byteLength));
            return;
          }
          if (!isUint8Array(chunk)) {
            failureSteps(new TypeError("Received non-Uint8Array chunk"));
            return;
          }
          bytes.push(chunk);
          byteLength += chunk.length;
        } while (true);
      } catch (e) {
        failureSteps(e);
      }
    }
    __name(readAllBytes, "readAllBytes");
    function urlIsLocal(url) {
      assert("protocol" in url);
      const protocol = url.protocol;
      return protocol === "about:" || protocol === "blob:" || protocol === "data:";
    }
    __name(urlIsLocal, "urlIsLocal");
    function urlHasHttpsScheme(url) {
      return typeof url === "string" && url[5] === ":" && url[0] === "h" && url[1] === "t" && url[2] === "t" && url[3] === "p" && url[4] === "s" || url.protocol === "https:";
    }
    __name(urlHasHttpsScheme, "urlHasHttpsScheme");
    function urlIsHttpHttpsScheme(url) {
      assert("protocol" in url);
      const protocol = url.protocol;
      return protocol === "http:" || protocol === "https:";
    }
    __name(urlIsHttpHttpsScheme, "urlIsHttpHttpsScheme");
    function simpleRangeHeaderValue(value, allowWhitespace) {
      const data = value;
      if (!data.startsWith("bytes")) {
        return "failure";
      }
      const position = { position: 5 };
      if (allowWhitespace) {
        collectASequenceOfCodePoints(
          (char) => char === "	" || char === " ",
          data,
          position
        );
      }
      if (data.charCodeAt(position.position) !== 61) {
        return "failure";
      }
      position.position++;
      if (allowWhitespace) {
        collectASequenceOfCodePoints(
          (char) => char === "	" || char === " ",
          data,
          position
        );
      }
      const rangeStart = collectASequenceOfCodePoints(
        (char) => {
          const code = char.charCodeAt(0);
          return code >= 48 && code <= 57;
        },
        data,
        position
      );
      const rangeStartValue = rangeStart.length ? Number(rangeStart) : null;
      if (allowWhitespace) {
        collectASequenceOfCodePoints(
          (char) => char === "	" || char === " ",
          data,
          position
        );
      }
      if (data.charCodeAt(position.position) !== 45) {
        return "failure";
      }
      position.position++;
      if (allowWhitespace) {
        collectASequenceOfCodePoints(
          (char) => char === "	" || char === " ",
          data,
          position
        );
      }
      const rangeEnd = collectASequenceOfCodePoints(
        (char) => {
          const code = char.charCodeAt(0);
          return code >= 48 && code <= 57;
        },
        data,
        position
      );
      const rangeEndValue = rangeEnd.length ? Number(rangeEnd) : null;
      if (position.position < data.length) {
        return "failure";
      }
      if (rangeEndValue === null && rangeStartValue === null) {
        return "failure";
      }
      if (rangeStartValue > rangeEndValue) {
        return "failure";
      }
      return { rangeStartValue, rangeEndValue };
    }
    __name(simpleRangeHeaderValue, "simpleRangeHeaderValue");
    function buildContentRange(rangeStart, rangeEnd, fullLength) {
      let contentRange = "bytes ";
      contentRange += isomorphicEncode(`${rangeStart}`);
      contentRange += "-";
      contentRange += isomorphicEncode(`${rangeEnd}`);
      contentRange += "/";
      contentRange += isomorphicEncode(`${fullLength}`);
      return contentRange;
    }
    __name(buildContentRange, "buildContentRange");
    var InflateStream = class extends Transform {
      static {
        __name(this, "InflateStream");
      }
      #zlibOptions;
      /** @param {zlib.ZlibOptions} [zlibOptions] */
      constructor(zlibOptions) {
        super();
        this.#zlibOptions = zlibOptions;
      }
      _transform(chunk, encoding, callback) {
        if (!this._inflateStream) {
          if (chunk.length === 0) {
            callback();
            return;
          }
          this._inflateStream = (chunk[0] & 15) === 8 ? zlib.createInflate(this.#zlibOptions) : zlib.createInflateRaw(this.#zlibOptions);
          this._inflateStream.on("data", this.push.bind(this));
          this._inflateStream.on("end", () => this.push(null));
          this._inflateStream.on("error", (err) => this.destroy(err));
        }
        this._inflateStream.write(chunk, encoding, callback);
      }
      _final(callback) {
        if (this._inflateStream) {
          this._inflateStream.end();
          this._inflateStream = null;
        }
        callback();
      }
    };
    function createInflate(zlibOptions) {
      return new InflateStream(zlibOptions);
    }
    __name(createInflate, "createInflate");
    function extractMimeType(headers) {
      let charset = null;
      let essence = null;
      let mimeType = null;
      const values = getDecodeSplit("content-type", headers);
      if (values === null) {
        return "failure";
      }
      for (const value of values) {
        const temporaryMimeType = parseMIMEType(value);
        if (temporaryMimeType === "failure" || temporaryMimeType.essence === "*/*") {
          continue;
        }
        mimeType = temporaryMimeType;
        if (mimeType.essence !== essence) {
          charset = null;
          if (mimeType.parameters.has("charset")) {
            charset = mimeType.parameters.get("charset");
          }
          essence = mimeType.essence;
        } else if (!mimeType.parameters.has("charset") && charset !== null) {
          mimeType.parameters.set("charset", charset);
        }
      }
      if (mimeType == null) {
        return "failure";
      }
      return mimeType;
    }
    __name(extractMimeType, "extractMimeType");
    function gettingDecodingSplitting(value) {
      const input = value;
      const position = { position: 0 };
      const values = [];
      let temporaryValue = "";
      while (position.position < input.length) {
        temporaryValue += collectASequenceOfCodePoints(
          (char) => char !== '"' && char !== ",",
          input,
          position
        );
        if (position.position < input.length) {
          if (input.charCodeAt(position.position) === 34) {
            temporaryValue += collectAnHTTPQuotedString(
              input,
              position
            );
            if (position.position < input.length) {
              continue;
            }
          } else {
            assert(input.charCodeAt(position.position) === 44);
            position.position++;
          }
        }
        temporaryValue = removeChars(temporaryValue, true, true, (char) => char === 9 || char === 32);
        values.push(temporaryValue);
        temporaryValue = "";
      }
      return values;
    }
    __name(gettingDecodingSplitting, "gettingDecodingSplitting");
    function getDecodeSplit(name, list) {
      const value = list.get(name, true);
      if (value === null) {
        return null;
      }
      return gettingDecodingSplitting(value);
    }
    __name(getDecodeSplit, "getDecodeSplit");
    function hasAuthenticationEntry(request) {
      return false;
    }
    __name(hasAuthenticationEntry, "hasAuthenticationEntry");
    function includesCredentials(url) {
      return !!(url.username || url.password);
    }
    __name(includesCredentials, "includesCredentials");
    function isTraversableNavigable(navigable) {
      return navigable != null && navigable !== "client" && navigable !== "no-traversable";
    }
    __name(isTraversableNavigable, "isTraversableNavigable");
    var EnvironmentSettingsObjectBase = class {
      static {
        __name(this, "EnvironmentSettingsObjectBase");
      }
      get baseUrl() {
        return getGlobalOrigin();
      }
      get origin() {
        return this.baseUrl?.origin;
      }
      policyContainer = makePolicyContainer();
    };
    var EnvironmentSettingsObject = class {
      static {
        __name(this, "EnvironmentSettingsObject");
      }
      settingsObject = new EnvironmentSettingsObjectBase();
    };
    var environmentSettingsObject = new EnvironmentSettingsObject();
    module2.exports = {
      isAborted,
      isCancelled,
      isValidEncodedURL,
      ReadableStreamFrom,
      tryUpgradeRequestToAPotentiallyTrustworthyURL,
      clampAndCoarsenConnectionTimingInfo,
      coarsenedSharedCurrentTime,
      determineRequestsReferrer,
      makePolicyContainer,
      clonePolicyContainer,
      appendFetchMetadata,
      appendRequestOriginHeader,
      TAOCheck,
      corsCheck,
      crossOriginResourcePolicyCheck,
      createOpaqueTimingInfo,
      setRequestReferrerPolicyOnRedirect,
      isValidHTTPToken,
      requestBadPort,
      requestCurrentURL,
      responseURL,
      responseLocationURL,
      isURLPotentiallyTrustworthy,
      isValidReasonPhrase,
      sameOrigin,
      normalizeMethod,
      iteratorMixin,
      createIterator,
      isValidHeaderName,
      isValidHeaderValue,
      isErrorLike,
      fullyReadBody,
      readableStreamClose,
      urlIsLocal,
      urlHasHttpsScheme,
      urlIsHttpHttpsScheme,
      readAllBytes,
      simpleRangeHeaderValue,
      buildContentRange,
      createInflate,
      extractMimeType,
      getDecodeSplit,
      environmentSettingsObject,
      isOriginIPPotentiallyTrustworthy,
      hasAuthenticationEntry,
      includesCredentials,
      isTraversableNavigable
    };
  }
});

// lib/web/fetch/formdata.js
var require_formdata = __commonJS({
  "lib/web/fetch/formdata.js"(exports2, module2) {
    "use strict";
    var { iteratorMixin } = require_util2();
    var { kEnumerableProperty } = require_util();
    var { webidl } = require_webidl();
    var nodeUtil = require("node:util");
    var FormData = class _FormData {
      static {
        __name(this, "FormData");
      }
      #state = [];
      constructor(form = void 0) {
        webidl.util.markAsUncloneable(this);
        if (form !== void 0) {
          throw webidl.errors.conversionFailed({
            prefix: "FormData constructor",
            argument: "Argument 1",
            types: ["undefined"]
          });
        }
      }
      append(name, value, filename = void 0) {
        webidl.brandCheck(this, _FormData);
        const prefix = "FormData.append";
        webidl.argumentLengthCheck(arguments, 2, prefix);
        name = webidl.converters.USVString(name);
        if (arguments.length === 3 || webidl.is.Blob(value)) {
          value = webidl.converters.Blob(value, prefix, "value");
          if (filename !== void 0) {
            filename = webidl.converters.USVString(filename);
          }
        } else {
          value = webidl.converters.USVString(value);
        }
        const entry = makeEntry(name, value, filename);
        this.#state.push(entry);
      }
      delete(name) {
        webidl.brandCheck(this, _FormData);
        const prefix = "FormData.delete";
        webidl.argumentLengthCheck(arguments, 1, prefix);
        name = webidl.converters.USVString(name);
        this.#state = this.#state.filter((entry) => entry.name !== name);
      }
      get(name) {
        webidl.brandCheck(this, _FormData);
        const prefix = "FormData.get";
        webidl.argumentLengthCheck(arguments, 1, prefix);
        name = webidl.converters.USVString(name);
        const idx = this.#state.findIndex((entry) => entry.name === name);
        if (idx === -1) {
          return null;
        }
        return this.#state[idx].value;
      }
      getAll(name) {
        webidl.brandCheck(this, _FormData);
        const prefix = "FormData.getAll";
        webidl.argumentLengthCheck(arguments, 1, prefix);
        name = webidl.converters.USVString(name);
        return this.#state.filter((entry) => entry.name === name).map((entry) => entry.value);
      }
      has(name) {
        webidl.brandCheck(this, _FormData);
        const prefix = "FormData.has";
        webidl.argumentLengthCheck(arguments, 1, prefix);
        name = webidl.converters.USVString(name);
        return this.#state.findIndex((entry) => entry.name === name) !== -1;
      }
      set(name, value, filename = void 0) {
        webidl.brandCheck(this, _FormData);
        const prefix = "FormData.set";
        webidl.argumentLengthCheck(arguments, 2, prefix);
        name = webidl.converters.USVString(name);
        if (arguments.length === 3 || webidl.is.Blob(value)) {
          value = webidl.converters.Blob(value, prefix, "value");
          if (filename !== void 0) {
            filename = webidl.converters.USVString(filename);
          }
        } else {
          value = webidl.converters.USVString(value);
        }
        const entry = makeEntry(name, value, filename);
        const idx = this.#state.findIndex((entry2) => entry2.name === name);
        if (idx !== -1) {
          this.#state = [
            ...this.#state.slice(0, idx),
            entry,
            ...this.#state.slice(idx + 1).filter((entry2) => entry2.name !== name)
          ];
        } else {
          this.#state.push(entry);
        }
      }
      [nodeUtil.inspect.custom](depth, options) {
        const state = this.#state.reduce((a, b) => {
          if (a[b.name]) {
            if (Array.isArray(a[b.name])) {
              a[b.name].push(b.value);
            } else {
              a[b.name] = [a[b.name], b.value];
            }
          } else {
            a[b.name] = b.value;
          }
          return a;
        }, { __proto__: null });
        options.depth ??= depth;
        options.colors ??= true;
        const output = nodeUtil.formatWithOptions(options, state);
        return `FormData ${output.slice(output.indexOf("]") + 2)}`;
      }
      /**
       * @param {FormData} formData
       */
      static getFormDataState(formData) {
        return formData.#state;
      }
      /**
       * @param {FormData} formData
       * @param {any[]} newState
       */
      static setFormDataState(formData, newState) {
        formData.#state = newState;
      }
    };
    var { getFormDataState, setFormDataState } = FormData;
    Reflect.deleteProperty(FormData, "getFormDataState");
    Reflect.deleteProperty(FormData, "setFormDataState");
    iteratorMixin("FormData", FormData, getFormDataState, "name", "value");
    Object.defineProperties(FormData.prototype, {
      append: kEnumerableProperty,
      delete: kEnumerableProperty,
      get: kEnumerableProperty,
      getAll: kEnumerableProperty,
      has: kEnumerableProperty,
      set: kEnumerableProperty,
      [Symbol.toStringTag]: {
        value: "FormData",
        configurable: true
      }
    });
    function makeEntry(name, value, filename) {
      if (typeof value === "string") {
      } else {
        if (!webidl.is.File(value)) {
          value = new File([value], "blob", { type: value.type });
        }
        if (filename !== void 0) {
          const options = {
            type: value.type,
            lastModified: value.lastModified
          };
          value = new File([value], filename, options);
        }
      }
      return { name, value };
    }
    __name(makeEntry, "makeEntry");
    webidl.is.FormData = webidl.util.MakeTypeAssertion(FormData);
    module2.exports = { FormData, makeEntry, setFormDataState };
  }
});

// lib/web/fetch/formdata-parser.js
var require_formdata_parser = __commonJS({
  "lib/web/fetch/formdata-parser.js"(exports2, module2) {
    "use strict";
    var { bufferToLowerCasedHeaderName } = require_util();
    var { HTTP_TOKEN_CODEPOINTS } = require_data_url();
    var { makeEntry } = require_formdata();
    var { webidl } = require_webidl();
    var assert = require("node:assert");
    var { isomorphicDecode } = require_infra();
    var dd = Buffer.from("--");
    var decoder = new TextDecoder();
    var decoderIgnoreBOM = new TextDecoder("utf-8", { ignoreBOM: true });
    function isAsciiString(chars) {
      for (let i = 0; i < chars.length; ++i) {
        if ((chars.charCodeAt(i) & ~127) !== 0) {
          return false;
        }
      }
      return true;
    }
    __name(isAsciiString, "isAsciiString");
    function validateBoundary(boundary) {
      const length = boundary.length;
      if (length < 27 || length > 70) {
        return false;
      }
      for (let i = 0; i < length; ++i) {
        const cp = boundary.charCodeAt(i);
        if (!(cp >= 48 && cp <= 57 || cp >= 65 && cp <= 90 || cp >= 97 && cp <= 122 || cp === 39 || cp === 45 || cp === 95)) {
          return false;
        }
      }
      return true;
    }
    __name(validateBoundary, "validateBoundary");
    function multipartFormDataParser(input, mimeType) {
      assert(mimeType !== "failure" && mimeType.essence === "multipart/form-data");
      const boundaryString = mimeType.parameters.get("boundary");
      if (boundaryString === void 0) {
        throw parsingError("missing boundary in content-type header");
      }
      const boundary = Buffer.from(`--${boundaryString}`, "utf8");
      const entryList = [];
      const position = { position: 0 };
      const firstBoundaryIndex = input.indexOf(boundary);
      if (firstBoundaryIndex === -1) {
        throw parsingError("no boundary found in multipart body");
      }
      position.position = firstBoundaryIndex;
      while (true) {
        if (input.subarray(position.position, position.position + boundary.length).equals(boundary)) {
          position.position += boundary.length;
        } else {
          throw parsingError("expected a value starting with -- and the boundary");
        }
        if (bufferStartsWith(input, dd, position)) {
          return entryList;
        }
        if (input[position.position] !== 13 || input[position.position + 1] !== 10) {
          throw parsingError("expected CRLF");
        }
        position.position += 2;
        const result = parseMultipartFormDataHeaders(input, position);
        let { name, filename, contentType, encoding } = result;
        position.position += 2;
        let body;
        {
          const boundaryIndex = input.indexOf(boundary.subarray(2), position.position);
          if (boundaryIndex === -1) {
            throw parsingError("expected boundary after body");
          }
          body = input.subarray(position.position, boundaryIndex - 4);
          position.position += body.length;
          if (encoding === "base64") {
            body = Buffer.from(body.toString(), "base64");
          }
        }
        if (input[position.position] !== 13 || input[position.position + 1] !== 10) {
          throw parsingError("expected CRLF");
        } else {
          position.position += 2;
        }
        let value;
        if (filename !== null) {
          contentType ??= "text/plain";
          if (!isAsciiString(contentType)) {
            contentType = "";
          }
          value = new File([body], filename, { type: contentType });
        } else {
          value = decoderIgnoreBOM.decode(Buffer.from(body));
        }
        assert(webidl.is.USVString(name));
        assert(typeof value === "string" && webidl.is.USVString(value) || webidl.is.File(value));
        entryList.push(makeEntry(name, value, filename));
      }
    }
    __name(multipartFormDataParser, "multipartFormDataParser");
    function parseContentDispositionAttribute(input, position) {
      if (input[position.position] === 59) {
        position.position++;
      }
      collectASequenceOfBytes(
        (char) => char === 32 || char === 9,
        input,
        position
      );
      const attributeName = collectASequenceOfBytes(
        (char) => isToken(char) && char !== 61 && char !== 42,
        // not = or *
        input,
        position
      );
      if (attributeName.length === 0) {
        return null;
      }
      const attrNameStr = attributeName.toString("ascii").toLowerCase();
      const isExtended = input[position.position] === 42;
      if (isExtended) {
        position.position++;
      }
      if (input[position.position] !== 61) {
        return null;
      }
      position.position++;
      collectASequenceOfBytes(
        (char) => char === 32 || char === 9,
        input,
        position
      );
      let value;
      if (isExtended) {
        const headerValue = collectASequenceOfBytes(
          (char) => char !== 32 && char !== 13 && char !== 10 && char !== 59,
          // not space, CRLF, or ;
          input,
          position
        );
        if (headerValue[0] !== 117 && headerValue[0] !== 85 || // u or U
        headerValue[1] !== 116 && headerValue[1] !== 84 || // t or T
        headerValue[2] !== 102 && headerValue[2] !== 70 || // f or F
        headerValue[3] !== 45 || // -
        headerValue[4] !== 56) {
          throw parsingError("unknown encoding, expected utf-8''");
        }
        value = decodeURIComponent(decoder.decode(headerValue.subarray(7)));
      } else if (input[position.position] === 34) {
        position.position++;
        const quotedValue = collectASequenceOfBytes(
          (char) => char !== 10 && char !== 13 && char !== 34,
          // not LF, CR, or "
          input,
          position
        );
        if (input[position.position] !== 34) {
          throw parsingError("Closing quote not found");
        }
        position.position++;
        value = decoder.decode(quotedValue).replace(/%0A/ig, "\n").replace(/%0D/ig, "\r").replace(/%22/g, '"');
      } else {
        const tokenValue = collectASequenceOfBytes(
          (char) => isToken(char) && char !== 59,
          // not ;
          input,
          position
        );
        value = decoder.decode(tokenValue);
      }
      return { name: attrNameStr, value };
    }
    __name(parseContentDispositionAttribute, "parseContentDispositionAttribute");
    function parseMultipartFormDataHeaders(input, position) {
      let name = null;
      let filename = null;
      let contentType = null;
      let encoding = null;
      while (true) {
        if (input[position.position] === 13 && input[position.position + 1] === 10) {
          if (name === null) {
            throw parsingError("header name is null");
          }
          return { name, filename, contentType, encoding };
        }
        let headerName = collectASequenceOfBytes(
          (char) => char !== 10 && char !== 13 && char !== 58,
          input,
          position
        );
        headerName = removeChars(headerName, true, true, (char) => char === 9 || char === 32);
        if (!HTTP_TOKEN_CODEPOINTS.test(headerName.toString())) {
          throw parsingError("header name does not match the field-name token production");
        }
        if (input[position.position] !== 58) {
          throw parsingError("expected :");
        }
        position.position++;
        collectASequenceOfBytes(
          (char) => char === 32 || char === 9,
          input,
          position
        );
        switch (bufferToLowerCasedHeaderName(headerName)) {
          case "content-disposition": {
            name = filename = null;
            const dispositionType = collectASequenceOfBytes(
              (char) => isToken(char),
              input,
              position
            );
            if (dispositionType.toString("ascii").toLowerCase() !== "form-data") {
              throw parsingError("expected form-data for content-disposition header");
            }
            while (position.position < input.length && input[position.position] !== 13 && input[position.position + 1] !== 10) {
              const attribute = parseContentDispositionAttribute(input, position);
              if (!attribute) {
                break;
              }
              if (attribute.name === "name") {
                name = attribute.value;
              } else if (attribute.name === "filename") {
                filename = attribute.value;
              }
            }
            if (name === null) {
              throw parsingError("name attribute is required in content-disposition header");
            }
            break;
          }
          case "content-type": {
            let headerValue = collectASequenceOfBytes(
              (char) => char !== 10 && char !== 13,
              input,
              position
            );
            headerValue = removeChars(headerValue, false, true, (char) => char === 9 || char === 32);
            contentType = isomorphicDecode(headerValue);
            break;
          }
          case "content-transfer-encoding": {
            let headerValue = collectASequenceOfBytes(
              (char) => char !== 10 && char !== 13,
              input,
              position
            );
            headerValue = removeChars(headerValue, false, true, (char) => char === 9 || char === 32);
            encoding = isomorphicDecode(headerValue);
            break;
          }
          default: {
            collectASequenceOfBytes(
              (char) => char !== 10 && char !== 13,
              input,
              position
            );
          }
        }
        if (input[position.position] !== 13 && input[position.position + 1] !== 10) {
          throw parsingError("expected CRLF");
        } else {
          position.position += 2;
        }
      }
    }
    __name(parseMultipartFormDataHeaders, "parseMultipartFormDataHeaders");
    function collectASequenceOfBytes(condition, input, position) {
      let start = position.position;
      while (start < input.length && condition(input[start])) {
        ++start;
      }
      return input.subarray(position.position, position.position = start);
    }
    __name(collectASequenceOfBytes, "collectASequenceOfBytes");
    function removeChars(buf, leading, trailing, predicate) {
      let lead = 0;
      let trail = buf.length - 1;
      if (leading) {
        while (lead < buf.length && predicate(buf[lead])) lead++;
      }
      if (trailing) {
        while (trail > 0 && predicate(buf[trail])) trail--;
      }
      return lead === 0 && trail === buf.length - 1 ? buf : buf.subarray(lead, trail + 1);
    }
    __name(removeChars, "removeChars");
    function bufferStartsWith(buffer, start, position) {
      if (buffer.length < start.length) {
        return false;
      }
      for (let i = 0; i < start.length; i++) {
        if (start[i] !== buffer[position.position + i]) {
          return false;
        }
      }
      return true;
    }
    __name(bufferStartsWith, "bufferStartsWith");
    function parsingError(cause) {
      return new TypeError("Failed to parse body as FormData.", { cause: new TypeError(cause) });
    }
    __name(parsingError, "parsingError");
    function isCTL(char) {
      return char <= 31 || char === 127;
    }
    __name(isCTL, "isCTL");
    function isTSpecial(char) {
      return char === 40 || // (
      char === 41 || // )
      char === 60 || // <
      char === 62 || // >
      char === 64 || // @
      char === 44 || // ,
      char === 59 || // ;
      char === 58 || // :
      char === 92 || // \
      char === 34 || // "
      char === 47 || // /
      char === 91 || // [
      char === 93 || // ]
      char === 63 || // ?
      char === 61;
    }
    __name(isTSpecial, "isTSpecial");
    function isToken(char) {
      return char <= 127 && // ascii
      char !== 32 && // space
      char !== 9 && !isCTL(char) && !isTSpecial(char);
    }
    __name(isToken, "isToken");
    module2.exports = {
      multipartFormDataParser,
      validateBoundary
    };
  }
});

// lib/util/promise.js
var require_promise = __commonJS({
  "lib/util/promise.js"(exports2, module2) {
    "use strict";
    function createDeferredPromise() {
      let res;
      let rej;
      const promise = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
      });
      return { promise, resolve: res, reject: rej };
    }
    __name(createDeferredPromise, "createDeferredPromise");
    module2.exports = {
      createDeferredPromise
    };
  }
});

// lib/web/fetch/body.js
var require_body = __commonJS({
  "lib/web/fetch/body.js"(exports2, module2) {
    "use strict";
    var util = require_util();
    var {
      ReadableStreamFrom,
      readableStreamClose,
      fullyReadBody,
      extractMimeType
    } = require_util2();
    var { FormData, setFormDataState } = require_formdata();
    var { webidl } = require_webidl();
    var assert = require("node:assert");
    var { isErrored, isDisturbed } = require("node:stream");
    var { isUint8Array } = require("node:util/types");
    var { serializeAMimeType } = require_data_url();
    var { multipartFormDataParser } = require_formdata_parser();
    var { createDeferredPromise } = require_promise();
    var { parseJSONFromBytes } = require_infra();
    var { utf8DecodeBytes } = require_encoding();
    var { runtimeFeatures } = require_runtime_features();
    var random = runtimeFeatures.has("crypto") ? require("node:crypto").randomInt : (max) => Math.floor(Math.random() * max);
    var textEncoder = new TextEncoder();
    function noop() {
    }
    __name(noop, "noop");
    var streamRegistry = new FinalizationRegistry((weakRef) => {
      const stream = weakRef.deref();
      if (stream && !stream.locked && !isDisturbed(stream) && !isErrored(stream)) {
        stream.cancel("Response object has been garbage collected").catch(noop);
      }
    });
    function extractBody(object, keepalive = false) {
      let stream = null;
      let controller = null;
      if (webidl.is.ReadableStream(object)) {
        stream = object;
      } else if (webidl.is.Blob(object)) {
        stream = object.stream();
      } else {
        stream = new ReadableStream({
          pull() {
          },
          start(c) {
            controller = c;
          },
          cancel() {
          },
          type: "bytes"
        });
      }
      assert(webidl.is.ReadableStream(stream));
      let action = null;
      let source = null;
      let length = null;
      let type = null;
      if (typeof object === "string") {
        source = object;
        type = "text/plain;charset=UTF-8";
      } else if (webidl.is.URLSearchParams(object)) {
        source = object.toString();
        type = "application/x-www-form-urlencoded;charset=UTF-8";
      } else if (webidl.is.BufferSource(object)) {
        source = webidl.util.getCopyOfBytesHeldByBufferSource(object);
      } else if (webidl.is.FormData(object)) {
        const boundary = `----formdata-undici-0${`${random(1e11)}`.padStart(11, "0")}`;
        const prefix = `--${boundary}\r
Content-Disposition: form-data`;
        const formdataEscape = /* @__PURE__ */ __name((str) => str.replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), "formdataEscape");
        const normalizeLinefeeds = /* @__PURE__ */ __name((value) => value.replace(/\r?\n|\r/g, "\r\n"), "normalizeLinefeeds");
        const blobParts = [];
        const rn = new Uint8Array([13, 10]);
        length = 0;
        let hasUnknownSizeValue = false;
        for (const [name, value] of object) {
          if (typeof value === "string") {
            const chunk2 = textEncoder.encode(prefix + `; name="${formdataEscape(normalizeLinefeeds(name))}"\r
\r
${normalizeLinefeeds(value)}\r
`);
            blobParts.push(chunk2);
            length += chunk2.byteLength;
          } else {
            const chunk2 = textEncoder.encode(`${prefix}; name="${formdataEscape(normalizeLinefeeds(name))}"` + (value.name ? `; filename="${formdataEscape(value.name)}"` : "") + `\r
Content-Type: ${value.type || "application/octet-stream"}\r
\r
`);
            blobParts.push(chunk2, value, rn);
            if (typeof value.size === "number") {
              length += chunk2.byteLength + value.size + rn.byteLength;
            } else {
              hasUnknownSizeValue = true;
            }
          }
        }
        const chunk = textEncoder.encode(`--${boundary}--\r
`);
        blobParts.push(chunk);
        length += chunk.byteLength;
        if (hasUnknownSizeValue) {
          length = null;
        }
        source = object;
        action = /* @__PURE__ */ __name(async function* () {
          for (const part of blobParts) {
            if (part.stream) {
              yield* part.stream();
            } else {
              yield part;
            }
          }
        }, "action");
        type = `multipart/form-data; boundary=${boundary}`;
      } else if (webidl.is.Blob(object)) {
        source = object;
        length = object.size;
        if (object.type) {
          type = object.type;
        }
      } else if (typeof object[Symbol.asyncIterator] === "function") {
        if (keepalive) {
          throw new TypeError("keepalive");
        }
        if (util.isDisturbed(object) || object.locked) {
          throw new TypeError(
            "Response body object should not be disturbed or locked"
          );
        }
        stream = webidl.is.ReadableStream(object) ? object : ReadableStreamFrom(object);
      }
      if (typeof source === "string" || isUint8Array(source)) {
        action = /* @__PURE__ */ __name(() => {
          length = typeof source === "string" ? Buffer.byteLength(source) : source.length;
          return source;
        }, "action");
      }
      if (action != null) {
        ;
        (async () => {
          const result = action();
          const iterator = result?.[Symbol.asyncIterator]?.();
          if (iterator) {
            for await (const bytes of iterator) {
              if (isErrored(stream)) break;
              if (bytes.length) {
                controller.enqueue(new Uint8Array(bytes));
              }
            }
          } else if (result?.length && !isErrored(stream)) {
            controller.enqueue(typeof result === "string" ? textEncoder.encode(result) : new Uint8Array(result));
          }
          queueMicrotask(() => readableStreamClose(controller));
        })();
      }
      const body = { stream, source, length };
      return [body, type];
    }
    __name(extractBody, "extractBody");
    function safelyExtractBody(object, keepalive = false) {
      if (webidl.is.ReadableStream(object)) {
        assert(!util.isDisturbed(object), "The body has already been consumed.");
        assert(!object.locked, "The stream is locked.");
      }
      return extractBody(object, keepalive);
    }
    __name(safelyExtractBody, "safelyExtractBody");
    function cloneBody(body) {
      const { 0: out1, 1: out2 } = body.stream.tee();
      body.stream = out1;
      return {
        stream: out2,
        length: body.length,
        source: body.source
      };
    }
    __name(cloneBody, "cloneBody");
    function bodyMixinMethods(instance, getInternalState) {
      const methods = {
        blob() {
          return consumeBody(this, (bytes) => {
            let mimeType = bodyMimeType(getInternalState(this));
            if (mimeType === null) {
              mimeType = "";
            } else if (mimeType) {
              mimeType = serializeAMimeType(mimeType);
            }
            return new Blob([bytes], { type: mimeType });
          }, instance, getInternalState);
        },
        arrayBuffer() {
          return consumeBody(this, (bytes) => {
            return new Uint8Array(bytes).buffer;
          }, instance, getInternalState);
        },
        text() {
          return consumeBody(this, utf8DecodeBytes, instance, getInternalState);
        },
        json() {
          return consumeBody(this, parseJSONFromBytes, instance, getInternalState);
        },
        formData() {
          return consumeBody(this, (value) => {
            const mimeType = bodyMimeType(getInternalState(this));
            if (mimeType !== null) {
              switch (mimeType.essence) {
                case "multipart/form-data": {
                  const parsed = multipartFormDataParser(value, mimeType);
                  const fd = new FormData();
                  setFormDataState(fd, parsed);
                  return fd;
                }
                case "application/x-www-form-urlencoded": {
                  const entries = new URLSearchParams(value.toString());
                  const fd = new FormData();
                  for (const [name, value2] of entries) {
                    fd.append(name, value2);
                  }
                  return fd;
                }
              }
            }
            throw new TypeError(
              'Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded".'
            );
          }, instance, getInternalState);
        },
        bytes() {
          return consumeBody(this, (bytes) => {
            return new Uint8Array(bytes);
          }, instance, getInternalState);
        }
      };
      return methods;
    }
    __name(bodyMixinMethods, "bodyMixinMethods");
    function mixinBody(prototype, getInternalState) {
      Object.assign(prototype.prototype, bodyMixinMethods(prototype, getInternalState));
    }
    __name(mixinBody, "mixinBody");
    function consumeBody(object, convertBytesToJSValue, instance, getInternalState) {
      try {
        webidl.brandCheck(object, instance);
      } catch (e) {
        return Promise.reject(e);
      }
      object = getInternalState(object);
      if (bodyUnusable(object)) {
        return Promise.reject(new TypeError("Body is unusable: Body has already been read"));
      }
      const promise = createDeferredPromise();
      const errorSteps = promise.reject;
      const successSteps = /* @__PURE__ */ __name((data) => {
        try {
          promise.resolve(convertBytesToJSValue(data));
        } catch (e) {
          errorSteps(e);
        }
      }, "successSteps");
      if (object.body == null) {
        successSteps(Buffer.allocUnsafe(0));
        return promise.promise;
      }
      fullyReadBody(object.body, successSteps, errorSteps);
      return promise.promise;
    }
    __name(consumeBody, "consumeBody");
    function bodyUnusable(object) {
      const body = object.body;
      return body != null && (body.stream.locked || util.isDisturbed(body.stream));
    }
    __name(bodyUnusable, "bodyUnusable");
    function bodyMimeType(requestOrResponse) {
      const headers = requestOrResponse.headersList;
      const mimeType = extractMimeType(headers);
      if (mimeType === "failure") {
        return null;
      }
      return mimeType;
    }
    __name(bodyMimeType, "bodyMimeType");
    module2.exports = {
      extractBody,
      safelyExtractBody,
      cloneBody,
      mixinBody,
      streamRegistry,
      bodyUnusable
    };
  }
});

// lib/dispatcher/client-h1.js
var require_client_h1 = __commonJS({
  "lib/dispatcher/client-h1.js"(exports2, module2) {
    "use strict";
    var assert = require("node:assert");
    var util = require_util();
    var { channels } = require_diagnostics();
    var timers = require_timers();
    var {
      RequestContentLengthMismatchError,
      ResponseContentLengthMismatchError,
      RequestAbortedError,
      HeadersTimeoutError,
      HeadersOverflowError,
      SocketError,
      InformationalError,
      BodyTimeoutError,
      HTTPParserError,
      ResponseExceededMaxSizeError
    } = require_errors();
    var {
      kUrl,
      kReset,
      kClient,
      kParser,
      kBlocking,
      kRunning,
      kPending,
      kSize,
      kWriting,
      kQueue,
      kNoRef,
      kKeepAliveDefaultTimeout,
      kHostHeader,
      kPendingIdx,
      kRunningIdx,
      kError,
      kPipelining,
      kSocket,
      kKeepAliveTimeoutValue,
      kMaxHeadersSize,
      kKeepAliveMaxTimeout,
      kKeepAliveTimeoutThreshold,
      kHeadersTimeout,
      kBodyTimeout,
      kStrictContentLength,
      kMaxRequests,
      kCounter,
      kMaxResponseSize,
      kOnError,
      kResume,
      kHTTPContext,
      kClosed
    } = require_symbols();
    var constants = require_constants2();
    var EMPTY_BUF = Buffer.alloc(0);
    var FastBuffer = Buffer[Symbol.species];
    var removeAllListeners = util.removeAllListeners;
    var extractBody;
    function lazyllhttp() {
      const llhttpWasmData = process.env.JEST_WORKER_ID ? require_llhttp_wasm() : void 0;
      let mod;
      let useWasmSIMD = process.arch !== "ppc64";
      if (process.env.UNDICI_NO_WASM_SIMD === "1") {
        useWasmSIMD = true;
      } else if (process.env.UNDICI_NO_WASM_SIMD === "0") {
        useWasmSIMD = false;
      }
      if (useWasmSIMD) {
        try {
          mod = new WebAssembly.Module(require_llhttp_simd_wasm());
        } catch {
        }
      }
      if (!mod) {
        mod = new WebAssembly.Module(llhttpWasmData || require_llhttp_wasm());
      }
      return new WebAssembly.Instance(mod, {
        env: {
          /**
           * @param {number} p
           * @param {number} at
           * @param {number} len
           * @returns {number}
           */
          wasm_on_url: /* @__PURE__ */ __name((p, at, len) => {
            return 0;
          }, "wasm_on_url"),
          /**
           * @param {number} p
           * @param {number} at
           * @param {number} len
           * @returns {number}
           */
          wasm_on_status: /* @__PURE__ */ __name((p, at, len) => {
            assert(currentParser.ptr === p);
            const start = at - currentBufferPtr + currentBufferRef.byteOffset;
            return currentParser.onStatus(new FastBuffer(currentBufferRef.buffer, start, len));
          }, "wasm_on_status"),
          /**
           * @param {number} p
           * @returns {number}
           */
          wasm_on_message_begin: /* @__PURE__ */ __name((p) => {
            assert(currentParser.ptr === p);
            return currentParser.onMessageBegin();
          }, "wasm_on_message_begin"),
          /**
           * @param {number} p
           * @param {number} at
           * @param {number} len
           * @returns {number}
           */
          wasm_on_header_field: /* @__PURE__ */ __name((p, at, len) => {
            assert(currentParser.ptr === p);
            const start = at - currentBufferPtr + currentBufferRef.byteOffset;
            return currentParser.onHeaderField(new FastBuffer(currentBufferRef.buffer, start, len));
          }, "wasm_on_header_field"),
          /**
           * @param {number} p
           * @param {number} at
           * @param {number} len
           * @returns {number}
           */
          wasm_on_header_value: /* @__PURE__ */ __name((p, at, len) => {
            assert(currentParser.ptr === p);
            const start = at - currentBufferPtr + currentBufferRef.byteOffset;
            return currentParser.onHeaderValue(new FastBuffer(currentBufferRef.buffer, start, len));
          }, "wasm_on_header_value"),
          /**
           * @param {number} p
           * @param {number} statusCode
           * @param {0|1} upgrade
           * @param {0|1} shouldKeepAlive
           * @returns {number}
           */
          wasm_on_headers_complete: /* @__PURE__ */ __name((p, statusCode, upgrade, shouldKeepAlive) => {
            assert(currentParser.ptr === p);
            return currentParser.onHeadersComplete(statusCode, upgrade === 1, shouldKeepAlive === 1);
          }, "wasm_on_headers_complete"),
          /**
           * @param {number} p
           * @param {number} at
           * @param {number} len
           * @returns {number}
           */
          wasm_on_body: /* @__PURE__ */ __name((p, at, len) => {
            assert(currentParser.ptr === p);
            const start = at - currentBufferPtr + currentBufferRef.byteOffset;
            return currentParser.onBody(new FastBuffer(currentBufferRef.buffer, start, len));
          }, "wasm_on_body"),
          /**
           * @param {number} p
           * @returns {number}
           */
          wasm_on_message_complete: /* @__PURE__ */ __name((p) => {
            assert(currentParser.ptr === p);
            return currentParser.onMessageComplete();
          }, "wasm_on_message_complete")
        }
      });
    }
    __name(lazyllhttp, "lazyllhttp");
    var llhttpInstance = null;
    var currentParser = null;
    var currentBufferRef = null;
    var currentBufferSize = 0;
    var currentBufferPtr = null;
    var USE_NATIVE_TIMER = 0;
    var USE_FAST_TIMER = 1;
    var TIMEOUT_HEADERS = 2 | USE_FAST_TIMER;
    var TIMEOUT_BODY = 4 | USE_FAST_TIMER;
    var TIMEOUT_KEEP_ALIVE = 8 | USE_NATIVE_TIMER;
    var Parser = class {
      static {
        __name(this, "Parser");
      }
      /**
         * @param {import('./client.js')} client
         * @param {import('net').Socket} socket
         * @param {*} llhttp
         */
      constructor(client, socket, { exports: exports3 }) {
        this.llhttp = exports3;
        this.ptr = this.llhttp.llhttp_alloc(constants.TYPE.RESPONSE);
        this.client = client;
        this.socket = socket;
        this.timeout = null;
        this.timeoutValue = null;
        this.timeoutType = null;
        this.statusCode = 0;
        this.statusText = "";
        this.upgrade = false;
        this.headers = [];
        this.headersSize = 0;
        this.headersMaxSize = client[kMaxHeadersSize];
        this.shouldKeepAlive = false;
        this.paused = false;
        this.resume = this.resume.bind(this);
        this.bytesRead = 0;
        this.keepAlive = "";
        this.contentLength = "";
        this.connection = "";
        this.maxResponseSize = client[kMaxResponseSize];
      }
      setTimeout(delay, type) {
        if (delay !== this.timeoutValue || type & USE_FAST_TIMER ^ this.timeoutType & USE_FAST_TIMER) {
          if (this.timeout) {
            timers.clearTimeout(this.timeout);
            this.timeout = null;
          }
          if (delay) {
            if (type & USE_FAST_TIMER) {
              this.timeout = timers.setFastTimeout(onParserTimeout, delay, new WeakRef(this));
            } else {
              this.timeout = setTimeout(onParserTimeout, delay, new WeakRef(this));
              this.timeout?.unref();
            }
          }
          this.timeoutValue = delay;
        } else if (this.timeout) {
          if (this.timeout.refresh) {
            this.timeout.refresh();
          }
        }
        this.timeoutType = type;
      }
      resume() {
        if (this.socket.destroyed || !this.paused) {
          return;
        }
        assert(this.ptr != null);
        assert(currentParser === null);
        this.llhttp.llhttp_resume(this.ptr);
        assert(this.timeoutType === TIMEOUT_BODY);
        if (this.timeout) {
          if (this.timeout.refresh) {
            this.timeout.refresh();
          }
        }
        this.paused = false;
        this.execute(this.socket.read() || EMPTY_BUF);
        this.readMore();
      }
      readMore() {
        while (!this.paused && this.ptr) {
          const chunk = this.socket.read();
          if (chunk === null) {
            break;
          }
          this.execute(chunk);
        }
      }
      /**
       * @param {Buffer} chunk
       */
      execute(chunk) {
        assert(currentParser === null);
        assert(this.ptr != null);
        assert(!this.paused);
        const { socket, llhttp } = this;
        if (chunk.length > currentBufferSize) {
          if (currentBufferPtr) {
            llhttp.free(currentBufferPtr);
          }
          currentBufferSize = Math.ceil(chunk.length / 4096) * 4096;
          currentBufferPtr = llhttp.malloc(currentBufferSize);
        }
        new Uint8Array(llhttp.memory.buffer, currentBufferPtr, currentBufferSize).set(chunk);
        try {
          let ret;
          try {
            currentBufferRef = chunk;
            currentParser = this;
            ret = llhttp.llhttp_execute(this.ptr, currentBufferPtr, chunk.length);
          } finally {
            currentParser = null;
            currentBufferRef = null;
          }
          if (ret !== constants.ERROR.OK) {
            const data = chunk.subarray(llhttp.llhttp_get_error_pos(this.ptr) - currentBufferPtr);
            if (ret === constants.ERROR.PAUSED_UPGRADE) {
              this.onUpgrade(data);
            } else if (ret === constants.ERROR.PAUSED) {
              this.paused = true;
              socket.unshift(data);
            } else {
              const ptr = llhttp.llhttp_get_error_reason(this.ptr);
              let message = "";
              if (ptr) {
                const len = new Uint8Array(llhttp.memory.buffer, ptr).indexOf(0);
                message = "Response does not match the HTTP/1.1 protocol (" + Buffer.from(llhttp.memory.buffer, ptr, len).toString() + ")";
              }
              throw new HTTPParserError(message, constants.ERROR[ret], data);
            }
          }
        } catch (err) {
          util.destroy(socket, err);
        }
      }
      destroy() {
        assert(currentParser === null);
        assert(this.ptr != null);
        this.llhttp.llhttp_free(this.ptr);
        this.ptr = null;
        this.timeout && timers.clearTimeout(this.timeout);
        this.timeout = null;
        this.timeoutValue = null;
        this.timeoutType = null;
        this.paused = false;
      }
      /**
       * @param {Buffer} buf
       * @returns {0}
       */
      onStatus(buf) {
        this.statusText = buf.toString();
        return 0;
      }
      /**
       * @returns {0|-1}
       */
      onMessageBegin() {
        const { socket, client } = this;
        if (socket.destroyed) {
          return -1;
        }
        const request = client[kQueue][client[kRunningIdx]];
        if (!request) {
          return -1;
        }
        request.onResponseStarted();
        return 0;
      }
      /**
       * @param {Buffer} buf
       * @returns {number}
       */
      onHeaderField(buf) {
        const len = this.headers.length;
        if ((len & 1) === 0) {
          this.headers.push(buf);
        } else {
          this.headers[len - 1] = Buffer.concat([this.headers[len - 1], buf]);
        }
        this.trackHeader(buf.length);
        return 0;
      }
      /**
       * @param {Buffer} buf
       * @returns {number}
       */
      onHeaderValue(buf) {
        let len = this.headers.length;
        if ((len & 1) === 1) {
          this.headers.push(buf);
          len += 1;
        } else {
          this.headers[len - 1] = Buffer.concat([this.headers[len - 1], buf]);
        }
        const key = this.headers[len - 2];
        if (key.length === 10) {
          const headerName = util.bufferToLowerCasedHeaderName(key);
          if (headerName === "keep-alive") {
            this.keepAlive += buf.toString();
          } else if (headerName === "connection") {
            this.connection += buf.toString();
          }
        } else if (key.length === 14 && util.bufferToLowerCasedHeaderName(key) === "content-length") {
          this.contentLength += buf.toString();
        }
        this.trackHeader(buf.length);
        return 0;
      }
      /**
       * @param {number} len
       */
      trackHeader(len) {
        this.headersSize += len;
        if (this.headersSize >= this.headersMaxSize) {
          util.destroy(this.socket, new HeadersOverflowError());
        }
      }
      /**
       * @param {Buffer} head
       */
      onUpgrade(head) {
        const { upgrade, client, socket, headers, statusCode } = this;
        assert(upgrade);
        assert(client[kSocket] === socket);
        assert(!socket.destroyed);
        assert(!this.paused);
        assert((headers.length & 1) === 0);
        const request = client[kQueue][client[kRunningIdx]];
        assert(request);
        assert(request.upgrade || request.method === "CONNECT");
        this.statusCode = 0;
        this.statusText = "";
        this.shouldKeepAlive = false;
        this.headers = [];
        this.headersSize = 0;
        socket.unshift(head);
        socket[kParser].destroy();
        socket[kParser] = null;
        socket[kClient] = null;
        socket[kError] = null;
        removeAllListeners(socket);
        client[kSocket] = null;
        client[kHTTPContext] = null;
        client[kQueue][client[kRunningIdx]++] = null;
        client.emit("disconnect", client[kUrl], [client], new InformationalError("upgrade"));
        try {
          request.onUpgrade(statusCode, headers, socket);
        } catch (err) {
          util.destroy(socket, err);
        }
        client[kResume]();
      }
      /**
       * @param {number} statusCode
       * @param {boolean} upgrade
       * @param {boolean} shouldKeepAlive
       * @returns {number}
       */
      onHeadersComplete(statusCode, upgrade, shouldKeepAlive) {
        const { client, socket, headers, statusText } = this;
        if (socket.destroyed) {
          return -1;
        }
        const request = client[kQueue][client[kRunningIdx]];
        if (!request) {
          return -1;
        }
        assert(!this.upgrade);
        assert(this.statusCode < 200);
        if (statusCode === 100) {
          util.destroy(socket, new SocketError("bad response", util.getSocketInfo(socket)));
          return -1;
        }
        if (upgrade && !request.upgrade) {
          util.destroy(socket, new SocketError("bad upgrade", util.getSocketInfo(socket)));
          return -1;
        }
        assert(this.timeoutType === TIMEOUT_HEADERS);
        this.statusCode = statusCode;
        this.shouldKeepAlive = shouldKeepAlive || // Override llhttp value which does not allow keepAlive for HEAD.
        request.method === "HEAD" && !socket[kReset] && this.connection.toLowerCase() === "keep-alive";
        if (this.statusCode >= 200) {
          const bodyTimeout = request.bodyTimeout != null ? request.bodyTimeout : client[kBodyTimeout];
          this.setTimeout(bodyTimeout, TIMEOUT_BODY);
        } else if (this.timeout) {
          if (this.timeout.refresh) {
            this.timeout.refresh();
          }
        }
        if (request.method === "CONNECT") {
          assert(client[kRunning] === 1);
          this.upgrade = true;
          return 2;
        }
        if (upgrade) {
          assert(client[kRunning] === 1);
          this.upgrade = true;
          return 2;
        }
        assert((this.headers.length & 1) === 0);
        this.headers = [];
        this.headersSize = 0;
        if (this.shouldKeepAlive && client[kPipelining]) {
          const keepAliveTimeout = this.keepAlive ? util.parseKeepAliveTimeout(this.keepAlive) : null;
          if (keepAliveTimeout != null) {
            const timeout = Math.min(
              keepAliveTimeout - client[kKeepAliveTimeoutThreshold],
              client[kKeepAliveMaxTimeout]
            );
            if (timeout <= 0) {
              socket[kReset] = true;
            } else {
              client[kKeepAliveTimeoutValue] = timeout;
            }
          } else {
            client[kKeepAliveTimeoutValue] = client[kKeepAliveDefaultTimeout];
          }
        } else {
          socket[kReset] = true;
        }
        const pause = request.onHeaders(statusCode, headers, this.resume, statusText) === false;
        if (request.aborted) {
          return -1;
        }
        if (request.method === "HEAD") {
          return 1;
        }
        if (statusCode < 200) {
          return 1;
        }
        if (socket[kBlocking]) {
          socket[kBlocking] = false;
          client[kResume]();
        }
        return pause ? constants.ERROR.PAUSED : 0;
      }
      /**
       * @param {Buffer} buf
       * @returns {number}
       */
      onBody(buf) {
        const { client, socket, statusCode, maxResponseSize } = this;
        if (socket.destroyed) {
          return -1;
        }
        const request = client[kQueue][client[kRunningIdx]];
        assert(request);
        assert(this.timeoutType === TIMEOUT_BODY);
        if (this.timeout) {
          if (this.timeout.refresh) {
            this.timeout.refresh();
          }
        }
        assert(statusCode >= 200);
        if (maxResponseSize > -1 && this.bytesRead + buf.length > maxResponseSize) {
          util.destroy(socket, new ResponseExceededMaxSizeError());
          return -1;
        }
        this.bytesRead += buf.length;
        if (request.onData(buf) === false) {
          return constants.ERROR.PAUSED;
        }
        return 0;
      }
      /**
       * @returns {number}
       */
      onMessageComplete() {
        const { client, socket, statusCode, upgrade, headers, contentLength, bytesRead, shouldKeepAlive } = this;
        if (socket.destroyed && (!statusCode || shouldKeepAlive)) {
          return -1;
        }
        if (upgrade) {
          return 0;
        }
        assert(statusCode >= 100);
        assert((this.headers.length & 1) === 0);
        const request = client[kQueue][client[kRunningIdx]];
        assert(request);
        this.statusCode = 0;
        this.statusText = "";
        this.bytesRead = 0;
        this.contentLength = "";
        this.keepAlive = "";
        this.connection = "";
        this.headers = [];
        this.headersSize = 0;
        if (statusCode < 200) {
          return 0;
        }
        if (request.method !== "HEAD" && contentLength && bytesRead !== parseInt(contentLength, 10)) {
          util.destroy(socket, new ResponseContentLengthMismatchError());
          return -1;
        }
        request.onComplete(headers);
        client[kQueue][client[kRunningIdx]++] = null;
        if (socket[kWriting]) {
          assert(client[kRunning] === 0);
          util.destroy(socket, new InformationalError("reset"));
          return constants.ERROR.PAUSED;
        } else if (!shouldKeepAlive) {
          util.destroy(socket, new InformationalError("reset"));
          return constants.ERROR.PAUSED;
        } else if (socket[kReset] && client[kRunning] === 0) {
          util.destroy(socket, new InformationalError("reset"));
          return constants.ERROR.PAUSED;
        } else if (client[kPipelining] == null || client[kPipelining] === 1) {
          setImmediate(client[kResume]);
        } else {
          client[kResume]();
        }
        return 0;
      }
    };
    function onParserTimeout(parserWeakRef) {
      const parser = parserWeakRef.deref();
      if (!parser) {
        return;
      }
      const { socket, timeoutType, client, paused } = parser;
      if (timeoutType === TIMEOUT_HEADERS) {
        if (!socket[kWriting] || socket.writableNeedDrain || client[kRunning] > 1) {
          assert(!paused, "cannot be paused while waiting for headers");
          util.destroy(socket, new HeadersTimeoutError());
        }
      } else if (timeoutType === TIMEOUT_BODY) {
        if (!paused) {
          util.destroy(socket, new BodyTimeoutError());
        }
      } else if (timeoutType === TIMEOUT_KEEP_ALIVE) {
        assert(client[kRunning] === 0 && client[kKeepAliveTimeoutValue]);
        util.destroy(socket, new InformationalError("socket idle timeout"));
      }
    }
    __name(onParserTimeout, "onParserTimeout");
    function connectH1(client, socket) {
      client[kSocket] = socket;
      if (!llhttpInstance) {
        llhttpInstance = lazyllhttp();
      }
      if (socket.errored) {
        throw socket.errored;
      }
      if (socket.destroyed) {
        throw new SocketError("destroyed");
      }
      socket[kNoRef] = false;
      socket[kWriting] = false;
      socket[kReset] = false;
      socket[kBlocking] = false;
      socket[kParser] = new Parser(client, socket, llhttpInstance);
      util.addListener(socket, "error", onHttpSocketError);
      util.addListener(socket, "readable", onHttpSocketReadable);
      util.addListener(socket, "end", onHttpSocketEnd);
      util.addListener(socket, "close", onHttpSocketClose);
      socket[kClosed] = false;
      socket.on("close", onSocketClose);
      return {
        version: "h1",
        defaultPipelining: 1,
        write(request) {
          return writeH1(client, request);
        },
        resume() {
          resumeH1(client);
        },
        /**
         * @param {Error|undefined} err
         * @param {() => void} callback
         */
        destroy(err, callback) {
          if (socket[kClosed]) {
            queueMicrotask(callback);
          } else {
            socket.on("close", callback);
            socket.destroy(err);
          }
        },
        /**
         * @returns {boolean}
         */
        get destroyed() {
          return socket.destroyed;
        },
        /**
         * @param {import('../core/request.js')} request
         * @returns {boolean}
         */
        busy(request) {
          if (socket[kWriting] || socket[kReset] || socket[kBlocking]) {
            return true;
          }
          if (request) {
            if (client[kRunning] > 0 && !request.idempotent) {
              return true;
            }
            if (client[kRunning] > 0 && (request.upgrade || request.method === "CONNECT")) {
              return true;
            }
            if (client[kRunning] > 0 && util.bodyLength(request.body) !== 0 && (util.isStream(request.body) || util.isAsyncIterable(request.body) || util.isFormDataLike(request.body))) {
              return true;
            }
          }
          return false;
        }
      };
    }
    __name(connectH1, "connectH1");
    function onHttpSocketError(err) {
      assert(err.code !== "ERR_TLS_CERT_ALTNAME_INVALID");
      const parser = this[kParser];
      if (err.code === "ECONNRESET" && parser.statusCode && !parser.shouldKeepAlive) {
        parser.onMessageComplete();
        return;
      }
      this[kError] = err;
      this[kClient][kOnError](err);
    }
    __name(onHttpSocketError, "onHttpSocketError");
    function onHttpSocketReadable() {
      this[kParser]?.readMore();
    }
    __name(onHttpSocketReadable, "onHttpSocketReadable");
    function onHttpSocketEnd() {
      const parser = this[kParser];
      if (parser.statusCode && !parser.shouldKeepAlive) {
        parser.onMessageComplete();
        return;
      }
      util.destroy(this, new SocketError("other side closed", util.getSocketInfo(this)));
    }
    __name(onHttpSocketEnd, "onHttpSocketEnd");
    function onHttpSocketClose() {
      const parser = this[kParser];
      if (parser) {
        if (!this[kError] && parser.statusCode && !parser.shouldKeepAlive) {
          parser.onMessageComplete();
        }
        this[kParser].destroy();
        this[kParser] = null;
      }
      const err = this[kError] || new SocketError("closed", util.getSocketInfo(this));
      const client = this[kClient];
      client[kSocket] = null;
      client[kHTTPContext] = null;
      if (client.destroyed) {
        assert(client[kPending] === 0);
        const requests = client[kQueue].splice(client[kRunningIdx]);
        for (let i = 0; i < requests.length; i++) {
          const request = requests[i];
          util.errorRequest(client, request, err);
        }
      } else if (client[kRunning] > 0 && err.code !== "UND_ERR_INFO") {
        const request = client[kQueue][client[kRunningIdx]];
        client[kQueue][client[kRunningIdx]++] = null;
        util.errorRequest(client, request, err);
      }
      client[kPendingIdx] = client[kRunningIdx];
      assert(client[kRunning] === 0);
      client.emit("disconnect", client[kUrl], [client], err);
      client[kResume]();
    }
    __name(onHttpSocketClose, "onHttpSocketClose");
    function onSocketClose() {
      this[kClosed] = true;
    }
    __name(onSocketClose, "onSocketClose");
    function resumeH1(client) {
      const socket = client[kSocket];
      if (socket && !socket.destroyed) {
        if (client[kSize] === 0) {
          if (!socket[kNoRef] && socket.unref) {
            socket.unref();
            socket[kNoRef] = true;
          }
        } else if (socket[kNoRef] && socket.ref) {
          socket.ref();
          socket[kNoRef] = false;
        }
        if (client[kSize] === 0) {
          if (socket[kParser].timeoutType !== TIMEOUT_KEEP_ALIVE) {
            socket[kParser].setTimeout(client[kKeepAliveTimeoutValue], TIMEOUT_KEEP_ALIVE);
          }
        } else if (client[kRunning] > 0 && socket[kParser].statusCode < 200) {
          if (socket[kParser].timeoutType !== TIMEOUT_HEADERS) {
            const request = client[kQueue][client[kRunningIdx]];
            const headersTimeout = request.headersTimeout != null ? request.headersTimeout : client[kHeadersTimeout];
            socket[kParser].setTimeout(headersTimeout, TIMEOUT_HEADERS);
          }
        }
      }
    }
    __name(resumeH1, "resumeH1");
    function shouldSendContentLength(method) {
      return method !== "GET" && method !== "HEAD" && method !== "OPTIONS" && method !== "TRACE" && method !== "CONNECT";
    }
    __name(shouldSendContentLength, "shouldSendContentLength");
    function writeH1(client, request) {
      const { method, path, host, upgrade, blocking, reset } = request;
      let { body, headers, contentLength } = request;
      const expectsPayload = method === "PUT" || method === "POST" || method === "PATCH" || method === "QUERY" || method === "PROPFIND" || method === "PROPPATCH";
      if (util.isFormDataLike(body)) {
        if (!extractBody) {
          extractBody = require_body().extractBody;
        }
        const [bodyStream, contentType] = extractBody(body);
        if (request.contentType == null) {
          headers.push("content-type", contentType);
        }
        body = bodyStream.stream;
        contentLength = bodyStream.length;
      } else if (util.isBlobLike(body) && request.contentType == null && body.type) {
        headers.push("content-type", body.type);
      }
      if (body && typeof body.read === "function") {
        body.read(0);
      }
      const bodyLength = util.bodyLength(body);
      contentLength = bodyLength ?? contentLength;
      if (contentLength === null) {
        contentLength = request.contentLength;
      }
      if (contentLength === 0 && !expectsPayload) {
        contentLength = null;
      }
      if (shouldSendContentLength(method) && contentLength > 0 && request.contentLength !== null && request.contentLength !== contentLength) {
        if (client[kStrictContentLength]) {
          util.errorRequest(client, request, new RequestContentLengthMismatchError());
          return false;
        }
        process.emitWarning(new RequestContentLengthMismatchError());
      }
      const socket = client[kSocket];
      const abort = /* @__PURE__ */ __name((err) => {
        if (request.aborted || request.completed) {
          return;
        }
        util.errorRequest(client, request, err || new RequestAbortedError());
        util.destroy(body);
        util.destroy(socket, new InformationalError("aborted"));
      }, "abort");
      try {
        request.onConnect(abort);
      } catch (err) {
        util.errorRequest(client, request, err);
      }
      if (request.aborted) {
        return false;
      }
      if (method === "HEAD") {
        socket[kReset] = true;
      }
      if (upgrade || method === "CONNECT") {
        socket[kReset] = true;
      }
      if (reset != null) {
        socket[kReset] = reset;
      }
      if (client[kMaxRequests] && socket[kCounter]++ >= client[kMaxRequests]) {
        socket[kReset] = true;
      }
      if (blocking) {
        socket[kBlocking] = true;
      }
      if (socket.setTypeOfService) {
        socket.setTypeOfService(request.typeOfService);
      }
      let header = `${method} ${path} HTTP/1.1\r
`;
      if (typeof host === "string") {
        header += `host: ${host}\r
`;
      } else {
        header += client[kHostHeader];
      }
      if (upgrade) {
        header += `connection: upgrade\r
upgrade: ${upgrade}\r
`;
      } else if (client[kPipelining] && !socket[kReset]) {
        header += "connection: keep-alive\r\n";
      } else {
        header += "connection: close\r\n";
      }
      if (Array.isArray(headers)) {
        for (let n = 0; n < headers.length; n += 2) {
          const key = headers[n + 0];
          const val = headers[n + 1];
          if (Array.isArray(val)) {
            for (let i = 0; i < val.length; i++) {
              header += `${key}: ${val[i]}\r
`;
            }
          } else {
            header += `${key}: ${val}\r
`;
          }
        }
      }
      if (channels.sendHeaders.hasSubscribers) {
        channels.sendHeaders.publish({ request, headers: header, socket });
      }
      if (!body || bodyLength === 0) {
        writeBuffer(abort, null, client, request, socket, contentLength, header, expectsPayload);
      } else if (util.isBuffer(body)) {
        writeBuffer(abort, body, client, request, socket, contentLength, header, expectsPayload);
      } else if (util.isBlobLike(body)) {
        if (typeof body.stream === "function") {
          writeIterable(abort, body.stream(), client, request, socket, contentLength, header, expectsPayload);
        } else {
          writeBlob(abort, body, client, request, socket, contentLength, header, expectsPayload);
        }
      } else if (util.isStream(body)) {
        writeStream(abort, body, client, request, socket, contentLength, header, expectsPayload);
      } else if (util.isIterable(body)) {
        writeIterable(abort, body, client, request, socket, contentLength, header, expectsPayload);
      } else {
        assert(false);
      }
      return true;
    }
    __name(writeH1, "writeH1");
    function writeStream(abort, body, client, request, socket, contentLength, header, expectsPayload) {
      assert(contentLength !== 0 || client[kRunning] === 0, "stream body cannot be pipelined");
      let finished = false;
      const writer = new AsyncWriter({ abort, socket, request, contentLength, client, expectsPayload, header });
      const onData = /* @__PURE__ */ __name(function(chunk) {
        if (finished) {
          return;
        }
        try {
          if (!writer.write(chunk) && this.pause) {
            this.pause();
          }
        } catch (err) {
          util.destroy(this, err);
        }
      }, "onData");
      const onDrain = /* @__PURE__ */ __name(function() {
        if (finished) {
          return;
        }
        if (body.resume) {
          body.resume();
        }
      }, "onDrain");
      const onClose = /* @__PURE__ */ __name(function() {
        queueMicrotask(() => {
          body.removeListener("error", onFinished);
        });
        if (!finished) {
          const err = new RequestAbortedError();
          queueMicrotask(() => onFinished(err));
        }
      }, "onClose");
      const onFinished = /* @__PURE__ */ __name(function(err) {
        if (finished) {
          return;
        }
        finished = true;
        assert(socket.destroyed || socket[kWriting] && client[kRunning] <= 1);
        socket.off("drain", onDrain).off("error", onFinished);
        body.removeListener("data", onData).removeListener("end", onFinished).removeListener("close", onClose);
        if (!err) {
          try {
            writer.end();
          } catch (er) {
            err = er;
          }
        }
        writer.destroy(err);
        if (err && (err.code !== "UND_ERR_INFO" || err.message !== "reset")) {
          util.destroy(body, err);
        } else {
          util.destroy(body);
        }
      }, "onFinished");
      body.on("data", onData).on("end", onFinished).on("error", onFinished).on("close", onClose);
      if (body.resume) {
        body.resume();
      }
      socket.on("drain", onDrain).on("error", onFinished);
      if (body.errorEmitted ?? body.errored) {
        setImmediate(onFinished, body.errored);
      } else if (body.endEmitted ?? body.readableEnded) {
        setImmediate(onFinished, null);
      }
      if (body.closeEmitted ?? body.closed) {
        setImmediate(onClose);
      }
    }
    __name(writeStream, "writeStream");
    function writeBuffer(abort, body, client, request, socket, contentLength, header, expectsPayload) {
      try {
        if (!body) {
          if (contentLength === 0) {
            socket.write(`${header}content-length: 0\r
\r
`, "latin1");
          } else {
            assert(contentLength === null, "no body must not have content length");
            socket.write(`${header}\r
`, "latin1");
          }
        } else if (util.isBuffer(body)) {
          assert(contentLength === body.byteLength, "buffer body must have content length");
          socket.cork();
          socket.write(`${header}content-length: ${contentLength}\r
\r
`, "latin1");
          socket.write(body);
          socket.uncork();
          request.onBodySent(body);
          if (!expectsPayload && request.reset !== false) {
            socket[kReset] = true;
          }
        }
        request.onRequestSent();
        client[kResume]();
      } catch (err) {
        abort(err);
      }
    }
    __name(writeBuffer, "writeBuffer");
    async function writeBlob(abort, body, client, request, socket, contentLength, header, expectsPayload) {
      assert(contentLength === body.size, "blob body must have content length");
      try {
        if (contentLength != null && contentLength !== body.size) {
          throw new RequestContentLengthMismatchError();
        }
        const buffer = Buffer.from(await body.arrayBuffer());
        socket.cork();
        socket.write(`${header}content-length: ${contentLength}\r
\r
`, "latin1");
        socket.write(buffer);
        socket.uncork();
        request.onBodySent(buffer);
        request.onRequestSent();
        if (!expectsPayload && request.reset !== false) {
          socket[kReset] = true;
        }
        client[kResume]();
      } catch (err) {
        abort(err);
      }
    }
    __name(writeBlob, "writeBlob");
    async function writeIterable(abort, body, client, request, socket, contentLength, header, expectsPayload) {
      assert(contentLength !== 0 || client[kRunning] === 0, "iterator body cannot be pipelined");
      let callback = null;
      function onDrain() {
        if (callback) {
          const cb = callback;
          callback = null;
          cb();
        }
      }
      __name(onDrain, "onDrain");
      const waitForDrain = /* @__PURE__ */ __name(() => new Promise((resolve, reject) => {
        assert(callback === null);
        if (socket[kError]) {
          reject(socket[kError]);
        } else {
          callback = resolve;
        }
      }), "waitForDrain");
      socket.on("close", onDrain).on("drain", onDrain);
      const writer = new AsyncWriter({ abort, socket, request, contentLength, client, expectsPayload, header });
      try {
        for await (const chunk of body) {
          if (socket[kError]) {
            throw socket[kError];
          }
          if (!writer.write(chunk)) {
            await waitForDrain();
          }
        }
        writer.end();
      } catch (err) {
        writer.destroy(err);
      } finally {
        socket.off("close", onDrain).off("drain", onDrain);
      }
    }
    __name(writeIterable, "writeIterable");
    var AsyncWriter = class {
      static {
        __name(this, "AsyncWriter");
      }
      /**
       *
       * @param {object} arg
       * @param {AbortCallback} arg.abort
       * @param {import('net').Socket} arg.socket
       * @param {import('../core/request.js')} arg.request
       * @param {number} arg.contentLength
       * @param {import('./client.js')} arg.client
       * @param {boolean} arg.expectsPayload
       * @param {string} arg.header
       */
      constructor({ abort, socket, request, contentLength, client, expectsPayload, header }) {
        this.socket = socket;
        this.request = request;
        this.contentLength = contentLength;
        this.client = client;
        this.bytesWritten = 0;
        this.expectsPayload = expectsPayload;
        this.header = header;
        this.abort = abort;
        socket[kWriting] = true;
      }
      /**
       * @param {Buffer} chunk
       * @returns
       */
      write(chunk) {
        const { socket, request, contentLength, client, bytesWritten, expectsPayload, header } = this;
        if (socket[kError]) {
          throw socket[kError];
        }
        if (socket.destroyed) {
          return false;
        }
        const len = Buffer.byteLength(chunk);
        if (!len) {
          return true;
        }
        if (contentLength !== null && bytesWritten + len > contentLength) {
          if (client[kStrictContentLength]) {
            throw new RequestContentLengthMismatchError();
          }
          process.emitWarning(new RequestContentLengthMismatchError());
        }
        socket.cork();
        if (bytesWritten === 0) {
          if (!expectsPayload && request.reset !== false) {
            socket[kReset] = true;
          }
          if (contentLength === null) {
            socket.write(`${header}transfer-encoding: chunked\r
`, "latin1");
          } else {
            socket.write(`${header}content-length: ${contentLength}\r
\r
`, "latin1");
          }
        }
        if (contentLength === null) {
          socket.write(`\r
${len.toString(16)}\r
`, "latin1");
        }
        this.bytesWritten += len;
        const ret = socket.write(chunk);
        socket.uncork();
        request.onBodySent(chunk);
        if (!ret) {
          if (socket[kParser].timeout && socket[kParser].timeoutType === TIMEOUT_HEADERS) {
            if (socket[kParser].timeout.refresh) {
              socket[kParser].timeout.refresh();
            }
          }
        }
        return ret;
      }
      /**
       * @returns {void}
       */
      end() {
        const { socket, contentLength, client, bytesWritten, expectsPayload, header, request } = this;
        request.onRequestSent();
        socket[kWriting] = false;
        if (socket[kError]) {
          throw socket[kError];
        }
        if (socket.destroyed) {
          return;
        }
        if (bytesWritten === 0) {
          if (expectsPayload) {
            socket.write(`${header}content-length: 0\r
\r
`, "latin1");
          } else {
            socket.write(`${header}\r
`, "latin1");
          }
        } else if (contentLength === null) {
          socket.write("\r\n0\r\n\r\n", "latin1");
        }
        if (contentLength !== null && bytesWritten !== contentLength) {
          if (client[kStrictContentLength]) {
            throw new RequestContentLengthMismatchError();
          } else {
            process.emitWarning(new RequestContentLengthMismatchError());
          }
        }
        if (socket[kParser].timeout && socket[kParser].timeoutType === TIMEOUT_HEADERS) {
          if (socket[kParser].timeout.refresh) {
            socket[kParser].timeout.refresh();
          }
        }
        client[kResume]();
      }
      /**
       * @param {Error} [err]
       * @returns {void}
       */
      destroy(err) {
        const { socket, client, abort } = this;
        socket[kWriting] = false;
        if (err) {
          assert(client[kRunning] <= 1, "pipeline should only contain this request");
          abort(err);
        }
      }
    };
    module2.exports = connectH1;
  }
});

// lib/dispatcher/client-h2.js
var require_client_h2 = __commonJS({
  "lib/dispatcher/client-h2.js"(exports2, module2) {
    "use strict";
    var assert = require("node:assert");
    var { pipeline } = require("node:stream");
    var util = require_util();
    var {
      RequestContentLengthMismatchError,
      RequestAbortedError,
      SocketError,
      InformationalError,
      InvalidArgumentError
    } = require_errors();
    var {
      kUrl,
      kReset,
      kClient,
      kRunning,
      kPending,
      kQueue,
      kPendingIdx,
      kRunningIdx,
      kError,
      kSocket,
      kStrictContentLength,
      kOnError,
      kMaxConcurrentStreams,
      kPingInterval,
      kHTTP2Session,
      kHTTP2InitialWindowSize,
      kHTTP2ConnectionWindowSize,
      kResume,
      kSize,
      kHTTPContext,
      kClosed,
      kBodyTimeout,
      kEnableConnectProtocol,
      kRemoteSettings,
      kHTTP2Stream,
      kHTTP2SessionState
    } = require_symbols();
    var { channels } = require_diagnostics();
    var kOpenStreams = /* @__PURE__ */ Symbol("open streams");
    var extractBody;
    var http2;
    try {
      http2 = require("node:http2");
    } catch {
      http2 = { constants: {} };
    }
    var {
      constants: {
        HTTP2_HEADER_AUTHORITY,
        HTTP2_HEADER_METHOD,
        HTTP2_HEADER_PATH,
        HTTP2_HEADER_SCHEME,
        HTTP2_HEADER_CONTENT_LENGTH,
        HTTP2_HEADER_EXPECT,
        HTTP2_HEADER_STATUS,
        HTTP2_HEADER_PROTOCOL,
        NGHTTP2_REFUSED_STREAM,
        NGHTTP2_CANCEL
      }
    } = http2;
    function parseH2Headers(headers) {
      const result = [];
      for (const [name, value] of Object.entries(headers)) {
        if (Array.isArray(value)) {
          for (const subvalue of value) {
            result.push(Buffer.from(name), Buffer.from(subvalue));
          }
        } else {
          result.push(Buffer.from(name), Buffer.from(value));
        }
      }
      return result;
    }
    __name(parseH2Headers, "parseH2Headers");
    function connectH2(client, socket) {
      client[kSocket] = socket;
      const http2InitialWindowSize = client[kHTTP2InitialWindowSize];
      const http2ConnectionWindowSize = client[kHTTP2ConnectionWindowSize];
      const session = http2.connect(client[kUrl], {
        createConnection: /* @__PURE__ */ __name(() => socket, "createConnection"),
        peerMaxConcurrentStreams: client[kMaxConcurrentStreams],
        settings: {
          // TODO(metcoder95): add support for PUSH
          enablePush: false,
          ...http2InitialWindowSize != null ? { initialWindowSize: http2InitialWindowSize } : null
        }
      });
      client[kSocket] = socket;
      session[kOpenStreams] = 0;
      session[kClient] = client;
      session[kSocket] = socket;
      session[kHTTP2SessionState] = {
        ping: {
          interval: client[kPingInterval] === 0 ? null : setInterval(onHttp2SendPing, client[kPingInterval], session).unref()
        }
      };
      session[kEnableConnectProtocol] = false;
      session[kRemoteSettings] = false;
      if (http2ConnectionWindowSize) {
        util.addListener(session, "connect", applyConnectionWindowSize.bind(session, http2ConnectionWindowSize));
      }
      util.addListener(session, "error", onHttp2SessionError);
      util.addListener(session, "frameError", onHttp2FrameError);
      util.addListener(session, "end", onHttp2SessionEnd);
      util.addListener(session, "goaway", onHttp2SessionGoAway);
      util.addListener(session, "close", onHttp2SessionClose);
      util.addListener(session, "remoteSettings", onHttp2RemoteSettings);
      session.unref();
      client[kHTTP2Session] = session;
      socket[kHTTP2Session] = session;
      util.addListener(socket, "error", onHttp2SocketError);
      util.addListener(socket, "end", onHttp2SocketEnd);
      util.addListener(socket, "close", onHttp2SocketClose);
      socket[kClosed] = false;
      socket.on("close", onSocketClose);
      return {
        version: "h2",
        defaultPipelining: Infinity,
        /**
         * @param {import('../core/request.js')} request
         * @returns {boolean}
        */
        write(request) {
          return writeH2(client, request);
        },
        /**
         * @returns {void}
         */
        resume() {
          resumeH2(client);
        },
        /**
         * @param {Error | null} err
         * @param {() => void} callback
         */
        destroy(err, callback) {
          if (socket[kClosed]) {
            queueMicrotask(callback);
          } else {
            socket.destroy(err).on("close", callback);
          }
        },
        /**
         * @type {boolean}
         */
        get destroyed() {
          return socket.destroyed;
        },
        /**
         * @param {import('../core/request.js')} request
         * @returns {boolean}
        */
        busy(request) {
          if (request != null) {
            if (client[kRunning] > 0) {
              if (request.idempotent === false) return true;
              if ((request.upgrade === "websocket" || request.method === "CONNECT") && session[kRemoteSettings] === false) return true;
              if (util.bodyLength(request.body) !== 0 && (util.isStream(request.body) || util.isAsyncIterable(request.body) || util.isFormDataLike(request.body))) return true;
            } else {
              return (request.upgrade === "websocket" || request.method === "CONNECT") && session[kRemoteSettings] === false;
            }
          }
          return false;
        }
      };
    }
    __name(connectH2, "connectH2");
    function resumeH2(client) {
      const socket = client[kSocket];
      if (socket?.destroyed === false) {
        if (client[kSize] === 0 || client[kMaxConcurrentStreams] === 0) {
          socket.unref();
          client[kHTTP2Session].unref();
        } else {
          socket.ref();
          client[kHTTP2Session].ref();
        }
      }
    }
    __name(resumeH2, "resumeH2");
    function applyConnectionWindowSize(connectionWindowSize) {
      try {
        if (typeof this.setLocalWindowSize === "function") {
          this.setLocalWindowSize(connectionWindowSize);
        }
      } catch {
      }
    }
    __name(applyConnectionWindowSize, "applyConnectionWindowSize");
    function onHttp2RemoteSettings(settings) {
      this[kClient][kMaxConcurrentStreams] = settings.maxConcurrentStreams ?? this[kClient][kMaxConcurrentStreams];
      if (this[kRemoteSettings] === true && this[kEnableConnectProtocol] === true && settings.enableConnectProtocol === false) {
        const err = new InformationalError("HTTP/2: Server disabled extended CONNECT protocol against RFC-8441");
        this[kSocket][kError] = err;
        this[kClient][kOnError](err);
        return;
      }
      this[kEnableConnectProtocol] = settings.enableConnectProtocol ?? this[kEnableConnectProtocol];
      this[kRemoteSettings] = true;
      this[kClient][kResume]();
    }
    __name(onHttp2RemoteSettings, "onHttp2RemoteSettings");
    function onHttp2SendPing(session) {
      const state = session[kHTTP2SessionState];
      if ((session.closed || session.destroyed) && state.ping.interval != null) {
        clearInterval(state.ping.interval);
        state.ping.interval = null;
        return;
      }
      session.ping(onPing.bind(session));
      function onPing(err, duration) {
        const client = this[kClient];
        const socket = this[kClient];
        if (err != null) {
          const error = new InformationalError(`HTTP/2: "PING" errored - type ${err.message}`);
          socket[kError] = error;
          client[kOnError](error);
        } else {
          client.emit("ping", duration);
        }
      }
      __name(onPing, "onPing");
    }
    __name(onHttp2SendPing, "onHttp2SendPing");
    function onHttp2SessionError(err) {
      assert(err.code !== "ERR_TLS_CERT_ALTNAME_INVALID");
      this[kSocket][kError] = err;
      this[kClient][kOnError](err);
    }
    __name(onHttp2SessionError, "onHttp2SessionError");
    function onHttp2FrameError(type, code, id) {
      if (id === 0) {
        const err = new InformationalError(`HTTP/2: "frameError" received - type ${type}, code ${code}`);
        this[kSocket][kError] = err;
        this[kClient][kOnError](err);
      }
    }
    __name(onHttp2FrameError, "onHttp2FrameError");
    function onHttp2SessionEnd() {
      const err = new SocketError("other side closed", util.getSocketInfo(this[kSocket]));
      this.destroy(err);
      util.destroy(this[kSocket], err);
    }
    __name(onHttp2SessionEnd, "onHttp2SessionEnd");
    function onHttp2SessionGoAway(errorCode) {
      const err = this[kError] || new SocketError(`HTTP/2: "GOAWAY" frame received with code ${errorCode}`, util.getSocketInfo(this[kSocket]));
      const client = this[kClient];
      client[kSocket] = null;
      client[kHTTPContext] = null;
      this.close();
      this[kHTTP2Session] = null;
      util.destroy(this[kSocket], err);
      if (client[kRunningIdx] < client[kQueue].length) {
        const request = client[kQueue][client[kRunningIdx]];
        client[kQueue][client[kRunningIdx]++] = null;
        util.errorRequest(client, request, err);
        client[kPendingIdx] = client[kRunningIdx];
      }
      assert(client[kRunning] === 0);
      client.emit("disconnect", client[kUrl], [client], err);
      client.emit("connectionError", client[kUrl], [client], err);
      client[kResume]();
    }
    __name(onHttp2SessionGoAway, "onHttp2SessionGoAway");
    function onHttp2SessionClose() {
      const { [kClient]: client, [kHTTP2SessionState]: state } = this;
      const { [kSocket]: socket } = client;
      const err = this[kSocket][kError] || this[kError] || new SocketError("closed", util.getSocketInfo(socket));
      client[kSocket] = null;
      client[kHTTPContext] = null;
      if (state.ping.interval != null) {
        clearInterval(state.ping.interval);
        state.ping.interval = null;
      }
      if (client.destroyed) {
        assert(client[kPending] === 0);
        const requests = client[kQueue].splice(client[kRunningIdx]);
        for (let i = 0; i < requests.length; i++) {
          const request = requests[i];
          util.errorRequest(client, request, err);
        }
      }
    }
    __name(onHttp2SessionClose, "onHttp2SessionClose");
    function onHttp2SocketClose() {
      const err = this[kError] || new SocketError("closed", util.getSocketInfo(this));
      const client = this[kHTTP2Session][kClient];
      client[kSocket] = null;
      client[kHTTPContext] = null;
      if (this[kHTTP2Session] !== null) {
        this[kHTTP2Session].destroy(err);
      }
      client[kPendingIdx] = client[kRunningIdx];
      assert(client[kRunning] === 0);
      client.emit("disconnect", client[kUrl], [client], err);
      client[kResume]();
    }
    __name(onHttp2SocketClose, "onHttp2SocketClose");
    function onHttp2SocketError(err) {
      assert(err.code !== "ERR_TLS_CERT_ALTNAME_INVALID");
      this[kError] = err;
      this[kClient][kOnError](err);
    }
    __name(onHttp2SocketError, "onHttp2SocketError");
    function onHttp2SocketEnd() {
      util.destroy(this, new SocketError("other side closed", util.getSocketInfo(this)));
    }
    __name(onHttp2SocketEnd, "onHttp2SocketEnd");
    function onSocketClose() {
      this[kClosed] = true;
    }
    __name(onSocketClose, "onSocketClose");
    function shouldSendContentLength(method) {
      return method !== "GET" && method !== "HEAD" && method !== "OPTIONS" && method !== "TRACE" && method !== "CONNECT";
    }
    __name(shouldSendContentLength, "shouldSendContentLength");
    function writeH2(client, request) {
      const requestTimeout = request.bodyTimeout ?? client[kBodyTimeout];
      const session = client[kHTTP2Session];
      const { method, path, host, upgrade, expectContinue, signal, protocol, headers: reqHeaders } = request;
      let { body } = request;
      if (upgrade != null && upgrade !== "websocket") {
        util.errorRequest(client, request, new InvalidArgumentError(`Custom upgrade "${upgrade}" not supported over HTTP/2`));
        return false;
      }
      const headers = {};
      for (let n = 0; n < reqHeaders.length; n += 2) {
        const key = reqHeaders[n + 0];
        const val = reqHeaders[n + 1];
        if (key === "cookie") {
          if (headers[key] != null) {
            headers[key] = Array.isArray(headers[key]) ? (headers[key].push(val), headers[key]) : [headers[key], val];
          } else {
            headers[key] = val;
          }
          continue;
        }
        if (Array.isArray(val)) {
          for (let i = 0; i < val.length; i++) {
            if (headers[key]) {
              headers[key] += `, ${val[i]}`;
            } else {
              headers[key] = val[i];
            }
          }
        } else if (headers[key]) {
          headers[key] += `, ${val}`;
        } else {
          headers[key] = val;
        }
      }
      let stream = null;
      const { hostname, port } = client[kUrl];
      headers[HTTP2_HEADER_AUTHORITY] = host || `${hostname}${port ? `:${port}` : ""}`;
      headers[HTTP2_HEADER_METHOD] = method;
      const abort = /* @__PURE__ */ __name((err) => {
        if (request.aborted || request.completed) {
          return;
        }
        err = err || new RequestAbortedError();
        util.errorRequest(client, request, err);
        if (stream != null) {
          stream.removeAllListeners("data");
          stream.close();
          client[kOnError](err);
          client[kResume]();
        }
        util.destroy(body, err);
      }, "abort");
      try {
        request.onConnect(abort);
      } catch (err) {
        util.errorRequest(client, request, err);
      }
      if (request.aborted) {
        return false;
      }
      if (upgrade || method === "CONNECT") {
        session.ref();
        if (upgrade === "websocket") {
          if (session[kEnableConnectProtocol] === false) {
            util.errorRequest(client, request, new InformationalError("HTTP/2: Extended CONNECT protocol not supported by server"));
            session.unref();
            return false;
          }
          headers[HTTP2_HEADER_METHOD] = "CONNECT";
          headers[HTTP2_HEADER_PROTOCOL] = "websocket";
          headers[HTTP2_HEADER_PATH] = path;
          if (protocol === "ws:" || protocol === "wss:") {
            headers[HTTP2_HEADER_SCHEME] = protocol === "ws:" ? "http" : "https";
          } else {
            headers[HTTP2_HEADER_SCHEME] = protocol === "http:" ? "http" : "https";
          }
          stream = session.request(headers, { endStream: false, signal });
          stream[kHTTP2Stream] = true;
          stream.once("response", (headers2, _flags) => {
            const { [HTTP2_HEADER_STATUS]: statusCode, ...realHeaders } = headers2;
            request.onUpgrade(statusCode, parseH2Headers(realHeaders), stream);
            ++session[kOpenStreams];
            client[kQueue][client[kRunningIdx]++] = null;
          });
          stream.on("error", () => {
            if (stream.rstCode === NGHTTP2_REFUSED_STREAM || stream.rstCode === NGHTTP2_CANCEL) {
              abort(new InformationalError(`HTTP/2: "stream error" received - code ${stream.rstCode}`));
            }
          });
          stream.once("close", () => {
            session[kOpenStreams] -= 1;
            if (session[kOpenStreams] === 0) session.unref();
          });
          stream.setTimeout(requestTimeout);
          return true;
        }
        stream = session.request(headers, { endStream: false, signal });
        stream[kHTTP2Stream] = true;
        stream.on("response", (headers2) => {
          const { [HTTP2_HEADER_STATUS]: statusCode, ...realHeaders } = headers2;
          request.onUpgrade(statusCode, parseH2Headers(realHeaders), stream);
          ++session[kOpenStreams];
          client[kQueue][client[kRunningIdx]++] = null;
        });
        stream.once("close", () => {
          session[kOpenStreams] -= 1;
          if (session[kOpenStreams] === 0) session.unref();
        });
        stream.setTimeout(requestTimeout);
        return true;
      }
      headers[HTTP2_HEADER_PATH] = path;
      headers[HTTP2_HEADER_SCHEME] = protocol === "http:" ? "http" : "https";
      const expectsPayload = method === "PUT" || method === "POST" || method === "PATCH";
      if (body && typeof body.read === "function") {
        body.read(0);
      }
      let contentLength = util.bodyLength(body);
      if (util.isFormDataLike(body)) {
        extractBody ??= require_body().extractBody;
        const [bodyStream, contentType] = extractBody(body);
        headers["content-type"] = contentType;
        body = bodyStream.stream;
        contentLength = bodyStream.length;
      }
      if (contentLength == null) {
        contentLength = request.contentLength;
      }
      if (!expectsPayload) {
        contentLength = null;
      }
      if (shouldSendContentLength(method) && contentLength > 0 && request.contentLength != null && request.contentLength !== contentLength) {
        if (client[kStrictContentLength]) {
          util.errorRequest(client, request, new RequestContentLengthMismatchError());
          return false;
        }
        process.emitWarning(new RequestContentLengthMismatchError());
      }
      if (contentLength != null) {
        assert(body || contentLength === 0, "no body must not have content length");
        headers[HTTP2_HEADER_CONTENT_LENGTH] = `${contentLength}`;
      }
      session.ref();
      if (channels.sendHeaders.hasSubscribers) {
        let header = "";
        for (const key in headers) {
          header += `${key}: ${headers[key]}\r
`;
        }
        channels.sendHeaders.publish({ request, headers: header, socket: session[kSocket] });
      }
      const shouldEndStream = method === "GET" || method === "HEAD" || body === null;
      if (expectContinue) {
        headers[HTTP2_HEADER_EXPECT] = "100-continue";
        stream = session.request(headers, { endStream: shouldEndStream, signal });
        stream[kHTTP2Stream] = true;
        stream.once("continue", writeBodyH2);
      } else {
        stream = session.request(headers, {
          endStream: shouldEndStream,
          signal
        });
        stream[kHTTP2Stream] = true;
        writeBodyH2();
      }
      ++session[kOpenStreams];
      stream.setTimeout(requestTimeout);
      let responseReceived = false;
      stream.once("response", (headers2) => {
        const { [HTTP2_HEADER_STATUS]: statusCode, ...realHeaders } = headers2;
        request.onResponseStarted();
        responseReceived = true;
        if (request.aborted) {
          stream.removeAllListeners("data");
          return;
        }
        if (request.onHeaders(Number(statusCode), parseH2Headers(realHeaders), stream.resume.bind(stream), "") === false) {
          stream.pause();
        }
        stream.on("data", (chunk) => {
          if (request.aborted || request.completed) {
            return;
          }
          if (request.onData(chunk) === false) {
            stream.pause();
          }
        });
      });
      stream.once("end", () => {
        stream.removeAllListeners("data");
        if (responseReceived) {
          if (!request.aborted && !request.completed) {
            request.onComplete({});
          }
          client[kQueue][client[kRunningIdx]++] = null;
          client[kResume]();
        } else {
          abort(new InformationalError("HTTP/2: stream half-closed (remote)"));
          client[kQueue][client[kRunningIdx]++] = null;
          client[kPendingIdx] = client[kRunningIdx];
          client[kResume]();
        }
      });
      stream.once("close", () => {
        stream.removeAllListeners("data");
        session[kOpenStreams] -= 1;
        if (session[kOpenStreams] === 0) {
          session.unref();
        }
      });
      stream.once("error", function(err) {
        stream.removeAllListeners("data");
        abort(err);
      });
      stream.once("frameError", (type, code) => {
        stream.removeAllListeners("data");
        abort(new InformationalError(`HTTP/2: "frameError" received - type ${type}, code ${code}`));
      });
      stream.on("aborted", () => {
        stream.removeAllListeners("data");
      });
      stream.on("timeout", () => {
        const err = new InformationalError(`HTTP/2: "stream timeout after ${requestTimeout}"`);
        stream.removeAllListeners("data");
        session[kOpenStreams] -= 1;
        if (session[kOpenStreams] === 0) {
          session.unref();
        }
        abort(err);
      });
      stream.once("trailers", (trailers) => {
        if (request.aborted || request.completed) {
          return;
        }
        stream.removeAllListeners("data");
        request.onComplete(trailers);
      });
      return true;
      function writeBodyH2() {
        if (!body || contentLength === 0) {
          writeBuffer(
            abort,
            stream,
            null,
            client,
            request,
            client[kSocket],
            contentLength,
            expectsPayload
          );
        } else if (util.isBuffer(body)) {
          writeBuffer(
            abort,
            stream,
            body,
            client,
            request,
            client[kSocket],
            contentLength,
            expectsPayload
          );
        } else if (util.isBlobLike(body)) {
          if (typeof body.stream === "function") {
            writeIterable(
              abort,
              stream,
              body.stream(),
              client,
              request,
              client[kSocket],
              contentLength,
              expectsPayload
            );
          } else {
            writeBlob(
              abort,
              stream,
              body,
              client,
              request,
              client[kSocket],
              contentLength,
              expectsPayload
            );
          }
        } else if (util.isStream(body)) {
          writeStream(
            abort,
            client[kSocket],
            expectsPayload,
            stream,
            body,
            client,
            request,
            contentLength
          );
        } else if (util.isIterable(body)) {
          writeIterable(
            abort,
            stream,
            body,
            client,
            request,
            client[kSocket],
            contentLength,
            expectsPayload
          );
        } else {
          assert(false);
        }
      }
      __name(writeBodyH2, "writeBodyH2");
    }
    __name(writeH2, "writeH2");
    function writeBuffer(abort, h2stream, body, client, request, socket, contentLength, expectsPayload) {
      try {
        if (body != null && util.isBuffer(body)) {
          assert(contentLength === body.byteLength, "buffer body must have content length");
          h2stream.cork();
          h2stream.write(body);
          h2stream.uncork();
          h2stream.end();
          request.onBodySent(body);
        }
        if (!expectsPayload) {
          socket[kReset] = true;
        }
        request.onRequestSent();
        client[kResume]();
      } catch (error) {
        abort(error);
      }
    }
    __name(writeBuffer, "writeBuffer");
    function writeStream(abort, socket, expectsPayload, h2stream, body, client, request, contentLength) {
      assert(contentLength !== 0 || client[kRunning] === 0, "stream body cannot be pipelined");
      const pipe = pipeline(
        body,
        h2stream,
        (err) => {
          if (err) {
            util.destroy(pipe, err);
            abort(err);
          } else {
            util.removeAllListeners(pipe);
            request.onRequestSent();
            if (!expectsPayload) {
              socket[kReset] = true;
            }
            client[kResume]();
          }
        }
      );
      util.addListener(pipe, "data", onPipeData);
      function onPipeData(chunk) {
        request.onBodySent(chunk);
      }
      __name(onPipeData, "onPipeData");
    }
    __name(writeStream, "writeStream");
    async function writeBlob(abort, h2stream, body, client, request, socket, contentLength, expectsPayload) {
      assert(contentLength === body.size, "blob body must have content length");
      try {
        if (contentLength != null && contentLength !== body.size) {
          throw new RequestContentLengthMismatchError();
        }
        const buffer = Buffer.from(await body.arrayBuffer());
        h2stream.cork();
        h2stream.write(buffer);
        h2stream.uncork();
        h2stream.end();
        request.onBodySent(buffer);
        request.onRequestSent();
        if (!expectsPayload) {
          socket[kReset] = true;
        }
        client[kResume]();
      } catch (err) {
        abort(err);
      }
    }
    __name(writeBlob, "writeBlob");
    async function writeIterable(abort, h2stream, body, client, request, socket, contentLength, expectsPayload) {
      assert(contentLength !== 0 || client[kRunning] === 0, "iterator body cannot be pipelined");
      let callback = null;
      function onDrain() {
        if (callback) {
          const cb = callback;
          callback = null;
          cb();
        }
      }
      __name(onDrain, "onDrain");
      const waitForDrain = /* @__PURE__ */ __name(() => new Promise((resolve, reject) => {
        assert(callback === null);
        if (socket[kError]) {
          reject(socket[kError]);
        } else {
          callback = resolve;
        }
      }), "waitForDrain");
      h2stream.on("close", onDrain).on("drain", onDrain);
      try {
        for await (const chunk of body) {
          if (socket[kError]) {
            throw socket[kError];
          }
          const res = h2stream.write(chunk);
          request.onBodySent(chunk);
          if (!res) {
            await waitForDrain();
          }
        }
        h2stream.end();
        request.onRequestSent();
        if (!expectsPayload) {
          socket[kReset] = true;
        }
        client[kResume]();
      } catch (err) {
        abort(err);
      } finally {
        h2stream.off("close", onDrain).off("drain", onDrain);
      }
    }
    __name(writeIterable, "writeIterable");
    module2.exports = connectH2;
  }
});

// lib/dispatcher/client.js
var require_client = __commonJS({
  "lib/dispatcher/client.js"(exports2, module2) {
    "use strict";
    var assert = require("node:assert");
    var net = require("node:net");
    var http = require("node:http");
    var util = require_util();
    var { ClientStats } = require_stats();
    var { channels } = require_diagnostics();
    var Request = require_request();
    var DispatcherBase = require_dispatcher_base();
    var {
      InvalidArgumentError,
      InformationalError,
      ClientDestroyedError
    } = require_errors();
    var buildConnector = require_connect();
    var {
      kUrl,
      kServerName,
      kClient,
      kBusy,
      kConnect,
      kResuming,
      kRunning,
      kPending,
      kSize,
      kQueue,
      kConnected,
      kConnecting,
      kNeedDrain,
      kKeepAliveDefaultTimeout,
      kHostHeader,
      kPendingIdx,
      kRunningIdx,
      kError,
      kPipelining,
      kKeepAliveTimeoutValue,
      kMaxHeadersSize,
      kKeepAliveMaxTimeout,
      kKeepAliveTimeoutThreshold,
      kHeadersTimeout,
      kBodyTimeout,
      kStrictContentLength,
      kConnector,
      kMaxRequests,
      kCounter,
      kClose,
      kDestroy,
      kDispatch,
      kLocalAddress,
      kMaxResponseSize,
      kOnError,
      kHTTPContext,
      kMaxConcurrentStreams,
      kHTTP2InitialWindowSize,
      kHTTP2ConnectionWindowSize,
      kResume,
      kPingInterval
    } = require_symbols();
    var connectH1 = require_client_h1();
    var connectH2 = require_client_h2();
    var kClosedResolve = /* @__PURE__ */ Symbol("kClosedResolve");
    var getDefaultNodeMaxHeaderSize = http && http.maxHeaderSize && Number.isInteger(http.maxHeaderSize) && http.maxHeaderSize > 0 ? () => http.maxHeaderSize : () => {
      throw new InvalidArgumentError("http module not available or http.maxHeaderSize invalid");
    };
    var noop = /* @__PURE__ */ __name(() => {
    }, "noop");
    function getPipelining(client) {
      return client[kPipelining] ?? client[kHTTPContext]?.defaultPipelining ?? 1;
    }
    __name(getPipelining, "getPipelining");
    var Client = class extends DispatcherBase {
      static {
        __name(this, "Client");
      }
      /**
       *
       * @param {string|URL} url
       * @param {import('../../types/client.js').Client.Options} options
       */
      constructor(url, {
        maxHeaderSize,
        headersTimeout,
        socketTimeout,
        requestTimeout,
        connectTimeout,
        bodyTimeout,
        idleTimeout,
        keepAlive,
        keepAliveTimeout,
        maxKeepAliveTimeout,
        keepAliveMaxTimeout,
        keepAliveTimeoutThreshold,
        socketPath,
        pipelining,
        tls,
        strictContentLength,
        maxCachedSessions,
        connect: connect2,
        maxRequestsPerClient,
        localAddress,
        maxResponseSize,
        autoSelectFamily,
        autoSelectFamilyAttemptTimeout,
        // h2
        maxConcurrentStreams,
        allowH2,
        useH2c,
        initialWindowSize,
        connectionWindowSize,
        pingInterval
      } = {}) {
        if (keepAlive !== void 0) {
          throw new InvalidArgumentError("unsupported keepAlive, use pipelining=0 instead");
        }
        if (socketTimeout !== void 0) {
          throw new InvalidArgumentError("unsupported socketTimeout, use headersTimeout & bodyTimeout instead");
        }
        if (requestTimeout !== void 0) {
          throw new InvalidArgumentError("unsupported requestTimeout, use headersTimeout & bodyTimeout instead");
        }
        if (idleTimeout !== void 0) {
          throw new InvalidArgumentError("unsupported idleTimeout, use keepAliveTimeout instead");
        }
        if (maxKeepAliveTimeout !== void 0) {
          throw new InvalidArgumentError("unsupported maxKeepAliveTimeout, use keepAliveMaxTimeout instead");
        }
        if (maxHeaderSize != null) {
          if (!Number.isInteger(maxHeaderSize) || maxHeaderSize < 1) {
            throw new InvalidArgumentError("invalid maxHeaderSize");
          }
        } else {
          maxHeaderSize = getDefaultNodeMaxHeaderSize();
        }
        if (socketPath != null && typeof socketPath !== "string") {
          throw new InvalidArgumentError("invalid socketPath");
        }
        if (connectTimeout != null && (!Number.isFinite(connectTimeout) || connectTimeout < 0)) {
          throw new InvalidArgumentError("invalid connectTimeout");
        }
        if (keepAliveTimeout != null && (!Number.isFinite(keepAliveTimeout) || keepAliveTimeout <= 0)) {
          throw new InvalidArgumentError("invalid keepAliveTimeout");
        }
        if (keepAliveMaxTimeout != null && (!Number.isFinite(keepAliveMaxTimeout) || keepAliveMaxTimeout <= 0)) {
          throw new InvalidArgumentError("invalid keepAliveMaxTimeout");
        }
        if (keepAliveTimeoutThreshold != null && !Number.isFinite(keepAliveTimeoutThreshold)) {
          throw new InvalidArgumentError("invalid keepAliveTimeoutThreshold");
        }
        if (headersTimeout != null && (!Number.isInteger(headersTimeout) || headersTimeout < 0)) {
          throw new InvalidArgumentError("headersTimeout must be a positive integer or zero");
        }
        if (bodyTimeout != null && (!Number.isInteger(bodyTimeout) || bodyTimeout < 0)) {
          throw new InvalidArgumentError("bodyTimeout must be a positive integer or zero");
        }
        if (connect2 != null && typeof connect2 !== "function" && typeof connect2 !== "object") {
          throw new InvalidArgumentError("connect must be a function or an object");
        }
        if (maxRequestsPerClient != null && (!Number.isInteger(maxRequestsPerClient) || maxRequestsPerClient < 0)) {
          throw new InvalidArgumentError("maxRequestsPerClient must be a positive number");
        }
        if (localAddress != null && (typeof localAddress !== "string" || net.isIP(localAddress) === 0)) {
          throw new InvalidArgumentError("localAddress must be valid string IP address");
        }
        if (maxResponseSize != null && (!Number.isInteger(maxResponseSize) || maxResponseSize < -1)) {
          throw new InvalidArgumentError("maxResponseSize must be a positive number");
        }
        if (autoSelectFamilyAttemptTimeout != null && (!Number.isInteger(autoSelectFamilyAttemptTimeout) || autoSelectFamilyAttemptTimeout < -1)) {
          throw new InvalidArgumentError("autoSelectFamilyAttemptTimeout must be a positive number");
        }
        if (allowH2 != null && typeof allowH2 !== "boolean") {
          throw new InvalidArgumentError("allowH2 must be a valid boolean value");
        }
        if (maxConcurrentStreams != null && (typeof maxConcurrentStreams !== "number" || maxConcurrentStreams < 1)) {
          throw new InvalidArgumentError("maxConcurrentStreams must be a positive integer, greater than 0");
        }
        if (useH2c != null && typeof useH2c !== "boolean") {
          throw new InvalidArgumentError("useH2c must be a valid boolean value");
        }
        if (initialWindowSize != null && (!Number.isInteger(initialWindowSize) || initialWindowSize < 1)) {
          throw new InvalidArgumentError("initialWindowSize must be a positive integer, greater than 0");
        }
        if (connectionWindowSize != null && (!Number.isInteger(connectionWindowSize) || connectionWindowSize < 1)) {
          throw new InvalidArgumentError("connectionWindowSize must be a positive integer, greater than 0");
        }
        if (pingInterval != null && (typeof pingInterval !== "number" || !Number.isInteger(pingInterval) || pingInterval < 0)) {
          throw new InvalidArgumentError("pingInterval must be a positive integer, greater or equal to 0");
        }
        super();
        if (typeof connect2 !== "function") {
          connect2 = buildConnector({
            ...tls,
            maxCachedSessions,
            allowH2,
            useH2c,
            socketPath,
            timeout: connectTimeout,
            ...typeof autoSelectFamily === "boolean" ? { autoSelectFamily, autoSelectFamilyAttemptTimeout } : void 0,
            ...connect2
          });
        } else if (socketPath != null) {
          const customConnect = connect2;
          connect2 = /* @__PURE__ */ __name((opts, callback) => customConnect({ ...opts, socketPath }, callback), "connect");
        }
        this[kUrl] = util.parseOrigin(url);
        this[kConnector] = connect2;
        this[kPipelining] = pipelining != null ? pipelining : 1;
        this[kMaxHeadersSize] = maxHeaderSize;
        this[kKeepAliveDefaultTimeout] = keepAliveTimeout == null ? 4e3 : keepAliveTimeout;
        this[kKeepAliveMaxTimeout] = keepAliveMaxTimeout == null ? 6e5 : keepAliveMaxTimeout;
        this[kKeepAliveTimeoutThreshold] = keepAliveTimeoutThreshold == null ? 2e3 : keepAliveTimeoutThreshold;
        this[kKeepAliveTimeoutValue] = this[kKeepAliveDefaultTimeout];
        this[kServerName] = null;
        this[kLocalAddress] = localAddress != null ? localAddress : null;
        this[kResuming] = 0;
        this[kNeedDrain] = 0;
        this[kHostHeader] = `host: ${this[kUrl].hostname}${this[kUrl].port ? `:${this[kUrl].port}` : ""}\r
`;
        this[kBodyTimeout] = bodyTimeout != null ? bodyTimeout : 3e5;
        this[kHeadersTimeout] = headersTimeout != null ? headersTimeout : 3e5;
        this[kStrictContentLength] = strictContentLength == null ? true : strictContentLength;
        this[kMaxRequests] = maxRequestsPerClient;
        this[kClosedResolve] = null;
        this[kMaxResponseSize] = maxResponseSize > -1 ? maxResponseSize : -1;
        this[kHTTPContext] = null;
        this[kMaxConcurrentStreams] = maxConcurrentStreams != null ? maxConcurrentStreams : 100;
        this[kHTTP2InitialWindowSize] = initialWindowSize != null ? initialWindowSize : 262144;
        this[kHTTP2ConnectionWindowSize] = connectionWindowSize != null ? connectionWindowSize : 524288;
        this[kPingInterval] = pingInterval != null ? pingInterval : 6e4;
        this[kQueue] = [];
        this[kRunningIdx] = 0;
        this[kPendingIdx] = 0;
        this[kResume] = (sync) => resume(this, sync);
        this[kOnError] = (err) => onError(this, err);
      }
      get pipelining() {
        return this[kPipelining];
      }
      set pipelining(value) {
        this[kPipelining] = value;
        this[kResume](true);
      }
      get stats() {
        return new ClientStats(this);
      }
      get [kPending]() {
        return this[kQueue].length - this[kPendingIdx];
      }
      get [kRunning]() {
        return this[kPendingIdx] - this[kRunningIdx];
      }
      get [kSize]() {
        return this[kQueue].length - this[kRunningIdx];
      }
      get [kConnected]() {
        return !!this[kHTTPContext] && !this[kConnecting] && !this[kHTTPContext].destroyed;
      }
      get [kBusy]() {
        return Boolean(
          this[kHTTPContext]?.busy(null) || this[kSize] >= (getPipelining(this) || 1) || this[kPending] > 0
        );
      }
      [kConnect](cb) {
        connect(this);
        this.once("connect", cb);
      }
      [kDispatch](opts, handler) {
        const request = new Request(this[kUrl].origin, opts, handler);
        this[kQueue].push(request);
        if (this[kResuming]) {
        } else if (util.bodyLength(request.body) == null && util.isIterable(request.body)) {
          this[kResuming] = 1;
          queueMicrotask(() => resume(this));
        } else {
          this[kResume](true);
        }
        if (this[kResuming] && this[kNeedDrain] !== 2 && this[kBusy]) {
          this[kNeedDrain] = 2;
        }
        return this[kNeedDrain] < 2;
      }
      [kClose]() {
        return new Promise((resolve) => {
          if (this[kSize]) {
            this[kClosedResolve] = resolve;
          } else {
            resolve(null);
          }
        });
      }
      [kDestroy](err) {
        return new Promise((resolve) => {
          const requests = this[kQueue].splice(this[kPendingIdx]);
          for (let i = 0; i < requests.length; i++) {
            const request = requests[i];
            util.errorRequest(this, request, err);
          }
          const callback = /* @__PURE__ */ __name(() => {
            if (this[kClosedResolve]) {
              this[kClosedResolve]();
              this[kClosedResolve] = null;
            }
            resolve(null);
          }, "callback");
          if (this[kHTTPContext]) {
            this[kHTTPContext].destroy(err, callback);
            this[kHTTPContext] = null;
          } else {
            queueMicrotask(callback);
          }
          this[kResume]();
        });
      }
    };
    function onError(client, err) {
      if (client[kRunning] === 0 && err.code !== "UND_ERR_INFO" && err.code !== "UND_ERR_SOCKET") {
        assert(client[kPendingIdx] === client[kRunningIdx]);
        const requests = client[kQueue].splice(client[kRunningIdx]);
        for (let i = 0; i < requests.length; i++) {
          const request = requests[i];
          util.errorRequest(client, request, err);
        }
        assert(client[kSize] === 0);
      }
    }
    __name(onError, "onError");
    function connect(client) {
      assert(!client[kConnecting]);
      assert(!client[kHTTPContext]);
      let { host, hostname, protocol, port } = client[kUrl];
      if (hostname[0] === "[") {
        const idx = hostname.indexOf("]");
        assert(idx !== -1);
        const ip = hostname.substring(1, idx);
        assert(net.isIPv6(ip));
        hostname = ip;
      }
      client[kConnecting] = true;
      if (channels.beforeConnect.hasSubscribers) {
        channels.beforeConnect.publish({
          connectParams: {
            host,
            hostname,
            protocol,
            port,
            version: client[kHTTPContext]?.version,
            servername: client[kServerName],
            localAddress: client[kLocalAddress]
          },
          connector: client[kConnector]
        });
      }
      try {
        client[kConnector]({
          host,
          hostname,
          protocol,
          port,
          servername: client[kServerName],
          localAddress: client[kLocalAddress]
        }, (err, socket) => {
          if (err) {
            handleConnectError(client, err, { host, hostname, protocol, port });
            client[kResume]();
            return;
          }
          if (client.destroyed) {
            util.destroy(socket.on("error", noop), new ClientDestroyedError());
            client[kResume]();
            return;
          }
          assert(socket);
          try {
            client[kHTTPContext] = socket.alpnProtocol === "h2" ? connectH2(client, socket) : connectH1(client, socket);
          } catch (err2) {
            socket.destroy().on("error", noop);
            handleConnectError(client, err2, { host, hostname, protocol, port });
            client[kResume]();
            return;
          }
          client[kConnecting] = false;
          socket[kCounter] = 0;
          socket[kMaxRequests] = client[kMaxRequests];
          socket[kClient] = client;
          socket[kError] = null;
          if (channels.connected.hasSubscribers) {
            channels.connected.publish({
              connectParams: {
                host,
                hostname,
                protocol,
                port,
                version: client[kHTTPContext]?.version,
                servername: client[kServerName],
                localAddress: client[kLocalAddress]
              },
              connector: client[kConnector],
              socket
            });
          }
          client.emit("connect", client[kUrl], [client]);
          client[kResume]();
        });
      } catch (err) {
        handleConnectError(client, err, { host, hostname, protocol, port });
        client[kResume]();
      }
    }
    __name(connect, "connect");
    function handleConnectError(client, err, { host, hostname, protocol, port }) {
      if (client.destroyed) {
        return;
      }
      client[kConnecting] = false;
      if (channels.connectError.hasSubscribers) {
        channels.connectError.publish({
          connectParams: {
            host,
            hostname,
            protocol,
            port,
            version: client[kHTTPContext]?.version,
            servername: client[kServerName],
            localAddress: client[kLocalAddress]
          },
          connector: client[kConnector],
          error: err
        });
      }
      if (err.code === "ERR_TLS_CERT_ALTNAME_INVALID") {
        assert(client[kRunning] === 0);
        while (client[kPending] > 0 && client[kQueue][client[kPendingIdx]].servername === client[kServerName]) {
          const request = client[kQueue][client[kPendingIdx]++];
          util.errorRequest(client, request, err);
        }
      } else {
        onError(client, err);
      }
      client.emit("connectionError", client[kUrl], [client], err);
    }
    __name(handleConnectError, "handleConnectError");
    function emitDrain(client) {
      client[kNeedDrain] = 0;
      client.emit("drain", client[kUrl], [client]);
    }
    __name(emitDrain, "emitDrain");
    function resume(client, sync) {
      if (client[kResuming] === 2) {
        return;
      }
      client[kResuming] = 2;
      _resume(client, sync);
      client[kResuming] = 0;
      if (client[kRunningIdx] > 256) {
        client[kQueue].splice(0, client[kRunningIdx]);
        client[kPendingIdx] -= client[kRunningIdx];
        client[kRunningIdx] = 0;
      }
    }
    __name(resume, "resume");
    function _resume(client, sync) {
      while (true) {
        if (client.destroyed) {
          assert(client[kPending] === 0);
          return;
        }
        if (client[kClosedResolve] && !client[kSize]) {
          client[kClosedResolve]();
          client[kClosedResolve] = null;
          return;
        }
        if (client[kHTTPContext]) {
          client[kHTTPContext].resume();
        }
        if (client[kBusy]) {
          client[kNeedDrain] = 2;
        } else if (client[kNeedDrain] === 2) {
          if (sync) {
            client[kNeedDrain] = 1;
            queueMicrotask(() => emitDrain(client));
          } else {
            emitDrain(client);
          }
          continue;
        }
        if (client[kPending] === 0) {
          return;
        }
        if (client[kRunning] >= (getPipelining(client) || 1)) {
          return;
        }
        const request = client[kQueue][client[kPendingIdx]];
        if (request === null) {
          return;
        }
        if (client[kUrl].protocol === "https:" && client[kServerName] !== request.servername) {
          if (client[kRunning] > 0) {
            return;
          }
          client[kServerName] = request.servername;
          client[kHTTPContext]?.destroy(new InformationalError("servername changed"), () => {
            client[kHTTPContext] = null;
            resume(client);
          });
        }
        if (client[kConnecting]) {
          return;
        }
        if (!client[kHTTPContext]) {
          connect(client);
          return;
        }
        if (client[kHTTPContext].destroyed) {
          return;
        }
        if (client[kHTTPContext].busy(request)) {
          return;
        }
        if (!request.aborted && client[kHTTPContext].write(request)) {
          client[kPendingIdx]++;
        } else {
          client[kQueue].splice(client[kPendingIdx], 1);
        }
      }
    }
    __name(_resume, "_resume");
    module2.exports = Client;
  }
});

// lib/dispatcher/pool.js
var require_pool = __commonJS({
  "lib/dispatcher/pool.js"(exports2, module2) {
    "use strict";
    var {
      PoolBase,
      kClients,
      kNeedDrain,
      kAddClient,
      kGetDispatcher,
      kRemoveClient
    } = require_pool_base();
    var Client = require_client();
    var {
      InvalidArgumentError
    } = require_errors();
    var util = require_util();
    var { kUrl } = require_symbols();
    var buildConnector = require_connect();
    var kOptions = /* @__PURE__ */ Symbol("options");
    var kConnections = /* @__PURE__ */ Symbol("connections");
    var kFactory = /* @__PURE__ */ Symbol("factory");
    function defaultFactory(origin, opts) {
      return new Client(origin, opts);
    }
    __name(defaultFactory, "defaultFactory");
    var Pool = class extends PoolBase {
      static {
        __name(this, "Pool");
      }
      constructor(origin, {
        connections,
        factory = defaultFactory,
        connect,
        connectTimeout,
        tls,
        maxCachedSessions,
        socketPath,
        autoSelectFamily,
        autoSelectFamilyAttemptTimeout,
        allowH2,
        clientTtl,
        ...options
      } = {}) {
        if (connections != null && (!Number.isFinite(connections) || connections < 0)) {
          throw new InvalidArgumentError("invalid connections");
        }
        if (typeof factory !== "function") {
          throw new InvalidArgumentError("factory must be a function.");
        }
        if (connect != null && typeof connect !== "function" && typeof connect !== "object") {
          throw new InvalidArgumentError("connect must be a function or an object");
        }
        if (typeof connect !== "function") {
          connect = buildConnector({
            ...tls,
            maxCachedSessions,
            allowH2,
            socketPath,
            timeout: connectTimeout,
            ...typeof autoSelectFamily === "boolean" ? { autoSelectFamily, autoSelectFamilyAttemptTimeout } : void 0,
            ...connect
          });
        }
        super();
        this[kConnections] = connections || null;
        this[kUrl] = util.parseOrigin(origin);
        this[kOptions] = { ...util.deepClone(options), connect, allowH2, clientTtl, socketPath };
        this[kOptions].interceptors = options.interceptors ? { ...options.interceptors } : void 0;
        this[kFactory] = factory;
        this.on("connect", (origin2, targets) => {
          if (clientTtl != null && clientTtl > 0) {
            for (const target of targets) {
              Object.assign(target, { ttl: Date.now() });
            }
          }
        });
        this.on("connectionError", (origin2, targets, error) => {
          for (const target of targets) {
            const idx = this[kClients].indexOf(target);
            if (idx !== -1) {
              this[kClients].splice(idx, 1);
            }
          }
        });
      }
      [kGetDispatcher]() {
        const clientTtlOption = this[kOptions].clientTtl;
        for (const client of this[kClients]) {
          if (clientTtlOption != null && clientTtlOption > 0 && client.ttl && Date.now() - client.ttl > clientTtlOption) {
            this[kRemoveClient](client);
          } else if (!client[kNeedDrain]) {
            return client;
          }
        }
        if (!this[kConnections] || this[kClients].length < this[kConnections]) {
          const dispatcher = this[kFactory](this[kUrl], this[kOptions]);
          this[kAddClient](dispatcher);
          return dispatcher;
        }
      }
    };
    module2.exports = Pool;
  }
});

// lib/dispatcher/agent.js
var require_agent = __commonJS({
  "lib/dispatcher/agent.js"(exports2, module2) {
    "use strict";
    var { InvalidArgumentError, MaxOriginsReachedError } = require_errors();
    var { kClients, kRunning, kClose, kDestroy, kDispatch, kUrl } = require_symbols();
    var DispatcherBase = require_dispatcher_base();
    var Pool = require_pool();
    var Client = require_client();
    var util = require_util();
    var kOnConnect = /* @__PURE__ */ Symbol("onConnect");
    var kOnDisconnect = /* @__PURE__ */ Symbol("onDisconnect");
    var kOnConnectionError = /* @__PURE__ */ Symbol("onConnectionError");
    var kOnDrain = /* @__PURE__ */ Symbol("onDrain");
    var kFactory = /* @__PURE__ */ Symbol("factory");
    var kOptions = /* @__PURE__ */ Symbol("options");
    var kOrigins = /* @__PURE__ */ Symbol("origins");
    function defaultFactory(origin, opts) {
      return opts && opts.connections === 1 ? new Client(origin, opts) : new Pool(origin, opts);
    }
    __name(defaultFactory, "defaultFactory");
    var Agent = class extends DispatcherBase {
      static {
        __name(this, "Agent");
      }
      constructor({ factory = defaultFactory, maxOrigins = Infinity, connect, ...options } = {}) {
        if (typeof factory !== "function") {
          throw new InvalidArgumentError("factory must be a function.");
        }
        if (connect != null && typeof connect !== "function" && typeof connect !== "object") {
          throw new InvalidArgumentError("connect must be a function or an object");
        }
        if (typeof maxOrigins !== "number" || Number.isNaN(maxOrigins) || maxOrigins <= 0) {
          throw new InvalidArgumentError("maxOrigins must be a number greater than 0");
        }
        super();
        if (connect && typeof connect !== "function") {
          connect = { ...connect };
        }
        this[kOptions] = { ...util.deepClone(options), maxOrigins, connect };
        this[kFactory] = factory;
        this[kClients] = /* @__PURE__ */ new Map();
        this[kOrigins] = /* @__PURE__ */ new Set();
        this[kOnDrain] = (origin, targets) => {
          this.emit("drain", origin, [this, ...targets]);
        };
        this[kOnConnect] = (origin, targets) => {
          this.emit("connect", origin, [this, ...targets]);
        };
        this[kOnDisconnect] = (origin, targets, err) => {
          this.emit("disconnect", origin, [this, ...targets], err);
        };
        this[kOnConnectionError] = (origin, targets, err) => {
          this.emit("connectionError", origin, [this, ...targets], err);
        };
      }
      get [kRunning]() {
        let ret = 0;
        for (const { dispatcher } of this[kClients].values()) {
          ret += dispatcher[kRunning];
        }
        return ret;
      }
      [kDispatch](opts, handler) {
        let key;
        if (opts.origin && (typeof opts.origin === "string" || opts.origin instanceof URL)) {
          key = String(opts.origin);
        } else {
          throw new InvalidArgumentError("opts.origin must be a non-empty string or URL.");
        }
        if (this[kOrigins].size >= this[kOptions].maxOrigins && !this[kOrigins].has(key)) {
          throw new MaxOriginsReachedError();
        }
        const result = this[kClients].get(key);
        let dispatcher = result && result.dispatcher;
        if (!dispatcher) {
          const closeClientIfUnused = /* @__PURE__ */ __name((connected) => {
            const result2 = this[kClients].get(key);
            if (result2) {
              if (connected) result2.count -= 1;
              if (result2.count <= 0) {
                this[kClients].delete(key);
                if (!result2.dispatcher.destroyed) {
                  result2.dispatcher.close();
                }
              }
              this[kOrigins].delete(key);
            }
          }, "closeClientIfUnused");
          dispatcher = this[kFactory](opts.origin, this[kOptions]).on("drain", this[kOnDrain]).on("connect", (origin, targets) => {
            const result2 = this[kClients].get(key);
            if (result2) {
              result2.count += 1;
            }
            this[kOnConnect](origin, targets);
          }).on("disconnect", (origin, targets, err) => {
            closeClientIfUnused(true);
            this[kOnDisconnect](origin, targets, err);
          }).on("connectionError", (origin, targets, err) => {
            closeClientIfUnused(false);
            this[kOnConnectionError](origin, targets, err);
          });
          this[kClients].set(key, { count: 0, dispatcher });
          this[kOrigins].add(key);
        }
        return dispatcher.dispatch(opts, handler);
      }
      [kClose]() {
        const closePromises = [];
        for (const { dispatcher } of this[kClients].values()) {
          closePromises.push(dispatcher.close());
        }
        this[kClients].clear();
        return Promise.all(closePromises);
      }
      [kDestroy](err) {
        const destroyPromises = [];
        for (const { dispatcher } of this[kClients].values()) {
          destroyPromises.push(dispatcher.destroy(err));
        }
        this[kClients].clear();
        return Promise.all(destroyPromises);
      }
      get stats() {
        const allClientStats = {};
        for (const { dispatcher } of this[kClients].values()) {
          if (dispatcher.stats) {
            allClientStats[dispatcher[kUrl].origin] = dispatcher.stats;
          }
        }
        return allClientStats;
      }
    };
    module2.exports = Agent;
  }
});

// lib/global.js
var require_global2 = __commonJS({
  "lib/global.js"(exports2, module2) {
    "use strict";
    var globalDispatcher = /* @__PURE__ */ Symbol.for("undici.globalDispatcher.1");
    var { InvalidArgumentError } = require_errors();
    var Agent = require_agent();
    if (getGlobalDispatcher2() === void 0) {
      setGlobalDispatcher2(new Agent());
    }
    function setGlobalDispatcher2(agent) {
      if (!agent || typeof agent.dispatch !== "function") {
        throw new InvalidArgumentError("Argument agent must implement Agent");
      }
      Object.defineProperty(globalThis, globalDispatcher, {
        value: agent,
        writable: true,
        enumerable: false,
        configurable: false
      });
    }
    __name(setGlobalDispatcher2, "setGlobalDispatcher");
    function getGlobalDispatcher2() {
      return globalThis[globalDispatcher];
    }
    __name(getGlobalDispatcher2, "getGlobalDispatcher");
    var installedExports = (
      /** @type {const} */
      [
        "fetch",
        "Headers",
        "Response",
        "Request",
        "FormData",
        "WebSocket",
        "CloseEvent",
        "ErrorEvent",
        "MessageEvent",
        "EventSource"
      ]
    );
    module2.exports = {
      setGlobalDispatcher: setGlobalDispatcher2,
      getGlobalDispatcher: getGlobalDispatcher2,
      installedExports
    };
  }
});

// lib/core/socks5-utils.js
var require_socks5_utils = __commonJS({
  "lib/core/socks5-utils.js"(exports2, module2) {
    "use strict";
    var { Buffer: Buffer2 } = require("node:buffer");
    var net = require("node:net");
    var { InvalidArgumentError } = require_errors();
    function parseAddress(address) {
      if (net.isIPv4(address)) {
        const parts = address.split(".").map(Number);
        return {
          type: 1,
          // IPv4
          buffer: Buffer2.from(parts)
        };
      }
      if (net.isIPv6(address)) {
        return {
          type: 4,
          // IPv6
          buffer: parseIPv6(address)
        };
      }
      const domainBuffer = Buffer2.from(address, "utf8");
      if (domainBuffer.length > 255) {
        throw new InvalidArgumentError("Domain name too long (max 255 bytes)");
      }
      return {
        type: 3,
        // Domain
        buffer: Buffer2.concat([Buffer2.from([domainBuffer.length]), domainBuffer])
      };
    }
    __name(parseAddress, "parseAddress");
    function parseIPv6(address) {
      const buffer = Buffer2.alloc(16);
      const parts = address.split(":");
      let partIndex = 0;
      let bufferIndex = 0;
      const doubleColonIndex = address.indexOf("::");
      if (doubleColonIndex !== -1) {
        const nonEmptyParts = parts.filter((p) => p.length > 0).length;
        const skipParts = 8 - nonEmptyParts;
        for (let i = 0; i < parts.length; i++) {
          if (parts[i] === "" && i === doubleColonIndex / 3) {
            bufferIndex += skipParts * 2;
          } else if (parts[i] !== "") {
            const value = parseInt(parts[i], 16);
            buffer.writeUInt16BE(value, bufferIndex);
            bufferIndex += 2;
          }
        }
      } else {
        for (const part of parts) {
          if (part === "") continue;
          const value = parseInt(part, 16);
          buffer.writeUInt16BE(value, partIndex * 2);
          partIndex++;
        }
      }
      return buffer;
    }
    __name(parseIPv6, "parseIPv6");
    function buildAddressBuffer(type, addressBuffer, port) {
      const portBuffer = Buffer2.allocUnsafe(2);
      portBuffer.writeUInt16BE(port, 0);
      return Buffer2.concat([
        Buffer2.from([type]),
        addressBuffer,
        portBuffer
      ]);
    }
    __name(buildAddressBuffer, "buildAddressBuffer");
    function parseResponseAddress(buffer, offset = 0) {
      if (buffer.length < offset + 1) {
        throw new InvalidArgumentError("Buffer too small to contain address type");
      }
      const addressType = buffer[offset];
      let address;
      let currentOffset = offset + 1;
      switch (addressType) {
        case 1: {
          if (buffer.length < currentOffset + 6) {
            throw new InvalidArgumentError("Buffer too small for IPv4 address");
          }
          address = Array.from(buffer.subarray(currentOffset, currentOffset + 4)).join(".");
          currentOffset += 4;
          break;
        }
        case 3: {
          if (buffer.length < currentOffset + 1) {
            throw new InvalidArgumentError("Buffer too small for domain length");
          }
          const domainLength = buffer[currentOffset];
          currentOffset += 1;
          if (buffer.length < currentOffset + domainLength + 2) {
            throw new InvalidArgumentError("Buffer too small for domain address");
          }
          address = buffer.subarray(currentOffset, currentOffset + domainLength).toString("utf8");
          currentOffset += domainLength;
          break;
        }
        case 4: {
          if (buffer.length < currentOffset + 18) {
            throw new InvalidArgumentError("Buffer too small for IPv6 address");
          }
          const parts = [];
          for (let i = 0; i < 8; i++) {
            const value = buffer.readUInt16BE(currentOffset + i * 2);
            parts.push(value.toString(16));
          }
          address = parts.join(":");
          currentOffset += 16;
          break;
        }
        default:
          throw new InvalidArgumentError(`Invalid address type: ${addressType}`);
      }
      if (buffer.length < currentOffset + 2) {
        throw new InvalidArgumentError("Buffer too small for port");
      }
      const port = buffer.readUInt16BE(currentOffset);
      currentOffset += 2;
      return {
        address,
        port,
        bytesRead: currentOffset - offset
      };
    }
    __name(parseResponseAddress, "parseResponseAddress");
    function createReplyError(replyCode) {
      const messages = {
        1: "General SOCKS server failure",
        2: "Connection not allowed by ruleset",
        3: "Network unreachable",
        4: "Host unreachable",
        5: "Connection refused",
        6: "TTL expired",
        7: "Command not supported",
        8: "Address type not supported"
      };
      const message = messages[replyCode] || `Unknown SOCKS5 error code: ${replyCode}`;
      const error = new Error(message);
      error.code = `SOCKS5_${replyCode}`;
      return error;
    }
    __name(createReplyError, "createReplyError");
    module2.exports = {
      parseAddress,
      parseIPv6,
      buildAddressBuffer,
      parseResponseAddress,
      createReplyError
    };
  }
});

// lib/core/socks5-client.js
var require_socks5_client = __commonJS({
  "lib/core/socks5-client.js"(exports2, module2) {
    "use strict";
    var { EventEmitter } = require("node:events");
    var { Buffer: Buffer2 } = require("node:buffer");
    var { InvalidArgumentError, Socks5ProxyError } = require_errors();
    var { debuglog } = require("node:util");
    var { parseAddress } = require_socks5_utils();
    var debug = debuglog("undici:socks5");
    var SOCKS_VERSION = 5;
    var AUTH_METHODS = {
      NO_AUTH: 0,
      GSSAPI: 1,
      USERNAME_PASSWORD: 2,
      NO_ACCEPTABLE: 255
    };
    var COMMANDS = {
      CONNECT: 1,
      BIND: 2,
      UDP_ASSOCIATE: 3
    };
    var ADDRESS_TYPES = {
      IPV4: 1,
      DOMAIN: 3,
      IPV6: 4
    };
    var REPLY_CODES = {
      SUCCEEDED: 0,
      GENERAL_FAILURE: 1,
      CONNECTION_NOT_ALLOWED: 2,
      NETWORK_UNREACHABLE: 3,
      HOST_UNREACHABLE: 4,
      CONNECTION_REFUSED: 5,
      TTL_EXPIRED: 6,
      COMMAND_NOT_SUPPORTED: 7,
      ADDRESS_TYPE_NOT_SUPPORTED: 8
    };
    var STATES = {
      INITIAL: "initial",
      HANDSHAKING: "handshaking",
      AUTHENTICATING: "authenticating",
      CONNECTING: "connecting",
      CONNECTED: "connected",
      ERROR: "error",
      CLOSED: "closed"
    };
    var Socks5Client = class extends EventEmitter {
      static {
        __name(this, "Socks5Client");
      }
      constructor(socket, options = {}) {
        super();
        if (!socket) {
          throw new InvalidArgumentError("socket is required");
        }
        this.socket = socket;
        this.options = options;
        this.state = STATES.INITIAL;
        this.buffer = Buffer2.alloc(0);
        this.authMethods = [];
        if (options.username && options.password) {
          this.authMethods.push(AUTH_METHODS.USERNAME_PASSWORD);
        }
        this.authMethods.push(AUTH_METHODS.NO_AUTH);
        this.socket.on("data", this.onData.bind(this));
        this.socket.on("error", this.onError.bind(this));
        this.socket.on("close", this.onClose.bind(this));
      }
      /**
       * Handle incoming data from the socket
       */
      onData(data) {
        debug("received data", data.length, "bytes in state", this.state);
        this.buffer = Buffer2.concat([this.buffer, data]);
        try {
          switch (this.state) {
            case STATES.HANDSHAKING:
              this.handleHandshakeResponse();
              break;
            case STATES.AUTHENTICATING:
              this.handleAuthResponse();
              break;
            case STATES.CONNECTING:
              this.handleConnectResponse();
              break;
          }
        } catch (err) {
          this.onError(err);
        }
      }
      /**
       * Handle socket errors
       */
      onError(err) {
        debug("socket error", err);
        this.state = STATES.ERROR;
        this.emit("error", err);
        this.destroy();
      }
      /**
       * Handle socket close
       */
      onClose() {
        debug("socket closed");
        this.state = STATES.CLOSED;
        this.emit("close");
      }
      /**
       * Destroy the client and underlying socket
       */
      destroy() {
        if (this.socket && !this.socket.destroyed) {
          this.socket.destroy();
        }
      }
      /**
       * Start the SOCKS5 handshake
       */
      handshake() {
        if (this.state !== STATES.INITIAL) {
          throw new InvalidArgumentError("Handshake already started");
        }
        debug("starting handshake with", this.authMethods.length, "auth methods");
        this.state = STATES.HANDSHAKING;
        const request = Buffer2.alloc(2 + this.authMethods.length);
        request[0] = SOCKS_VERSION;
        request[1] = this.authMethods.length;
        this.authMethods.forEach((method, i) => {
          request[2 + i] = method;
        });
        this.socket.write(request);
      }
      /**
       * Handle handshake response from server
       */
      handleHandshakeResponse() {
        if (this.buffer.length < 2) {
          return;
        }
        const version = this.buffer[0];
        const method = this.buffer[1];
        if (version !== SOCKS_VERSION) {
          throw new Socks5ProxyError(`Invalid SOCKS version: ${version}`, "UND_ERR_SOCKS5_VERSION");
        }
        if (method === AUTH_METHODS.NO_ACCEPTABLE) {
          throw new Socks5ProxyError("No acceptable authentication method", "UND_ERR_SOCKS5_AUTH_REJECTED");
        }
        this.buffer = this.buffer.subarray(2);
        debug("server selected auth method", method);
        if (method === AUTH_METHODS.NO_AUTH) {
          this.emit("authenticated");
        } else if (method === AUTH_METHODS.USERNAME_PASSWORD) {
          this.state = STATES.AUTHENTICATING;
          this.sendAuthRequest();
        } else {
          throw new Socks5ProxyError(`Unsupported authentication method: ${method}`, "UND_ERR_SOCKS5_AUTH_METHOD");
        }
      }
      /**
       * Send username/password authentication request
       */
      sendAuthRequest() {
        const { username, password } = this.options;
        if (!username || !password) {
          throw new InvalidArgumentError("Username and password required for authentication");
        }
        debug("sending username/password auth");
        const usernameBuffer = Buffer2.from(username);
        const passwordBuffer = Buffer2.from(password);
        if (usernameBuffer.length > 255 || passwordBuffer.length > 255) {
          throw new InvalidArgumentError("Username or password too long");
        }
        const request = Buffer2.alloc(3 + usernameBuffer.length + passwordBuffer.length);
        request[0] = 1;
        request[1] = usernameBuffer.length;
        usernameBuffer.copy(request, 2);
        request[2 + usernameBuffer.length] = passwordBuffer.length;
        passwordBuffer.copy(request, 3 + usernameBuffer.length);
        this.socket.write(request);
      }
      /**
       * Handle authentication response
       */
      handleAuthResponse() {
        if (this.buffer.length < 2) {
          return;
        }
        const version = this.buffer[0];
        const status = this.buffer[1];
        if (version !== 1) {
          throw new Socks5ProxyError(`Invalid auth sub-negotiation version: ${version}`, "UND_ERR_SOCKS5_AUTH_VERSION");
        }
        if (status !== 0) {
          throw new Socks5ProxyError("Authentication failed", "UND_ERR_SOCKS5_AUTH_FAILED");
        }
        this.buffer = this.buffer.subarray(2);
        debug("authentication successful");
        this.emit("authenticated");
      }
      /**
       * Send CONNECT command
       * @param {string} address - Target address (IP or domain)
       * @param {number} port - Target port
       */
      connect(address, port) {
        if (this.state === STATES.CONNECTED) {
          throw new InvalidArgumentError("Already connected");
        }
        debug("connecting to", address, port);
        this.state = STATES.CONNECTING;
        const request = this.buildConnectRequest(COMMANDS.CONNECT, address, port);
        this.socket.write(request);
      }
      /**
       * Build a SOCKS5 request
       */
      buildConnectRequest(command, address, port) {
        const { type: addressType, buffer: addressBuffer } = parseAddress(address);
        const request = Buffer2.alloc(4 + addressBuffer.length + 2);
        request[0] = SOCKS_VERSION;
        request[1] = command;
        request[2] = 0;
        request[3] = addressType;
        addressBuffer.copy(request, 4);
        request.writeUInt16BE(port, 4 + addressBuffer.length);
        return request;
      }
      /**
       * Handle CONNECT response
       */
      handleConnectResponse() {
        if (this.buffer.length < 4) {
          return;
        }
        const version = this.buffer[0];
        const reply = this.buffer[1];
        const addressType = this.buffer[3];
        if (version !== SOCKS_VERSION) {
          throw new Socks5ProxyError(`Invalid SOCKS version in reply: ${version}`, "UND_ERR_SOCKS5_REPLY_VERSION");
        }
        let responseLength = 4;
        if (addressType === ADDRESS_TYPES.IPV4) {
          responseLength += 4 + 2;
        } else if (addressType === ADDRESS_TYPES.DOMAIN) {
          if (this.buffer.length < 5) {
            return;
          }
          responseLength += 1 + this.buffer[4] + 2;
        } else if (addressType === ADDRESS_TYPES.IPV6) {
          responseLength += 16 + 2;
        } else {
          throw new Socks5ProxyError(`Invalid address type in reply: ${addressType}`, "UND_ERR_SOCKS5_ADDR_TYPE");
        }
        if (this.buffer.length < responseLength) {
          return;
        }
        if (reply !== REPLY_CODES.SUCCEEDED) {
          const errorMessage = this.getReplyErrorMessage(reply);
          throw new Socks5ProxyError(`SOCKS5 connection failed: ${errorMessage}`, `UND_ERR_SOCKS5_REPLY_${reply}`);
        }
        let boundAddress;
        let offset = 4;
        if (addressType === ADDRESS_TYPES.IPV4) {
          boundAddress = Array.from(this.buffer.subarray(offset, offset + 4)).join(".");
          offset += 4;
        } else if (addressType === ADDRESS_TYPES.DOMAIN) {
          const domainLength = this.buffer[offset];
          offset += 1;
          boundAddress = this.buffer.subarray(offset, offset + domainLength).toString();
          offset += domainLength;
        } else if (addressType === ADDRESS_TYPES.IPV6) {
          const parts = [];
          for (let i = 0; i < 8; i++) {
            const value = this.buffer.readUInt16BE(offset + i * 2);
            parts.push(value.toString(16));
          }
          boundAddress = parts.join(":");
          offset += 16;
        }
        const boundPort = this.buffer.readUInt16BE(offset);
        this.buffer = this.buffer.subarray(responseLength);
        this.state = STATES.CONNECTED;
        debug("connected, bound address:", boundAddress, "port:", boundPort);
        this.emit("connected", { address: boundAddress, port: boundPort });
      }
      /**
       * Get human-readable error message for reply code
       */
      getReplyErrorMessage(reply) {
        switch (reply) {
          case REPLY_CODES.GENERAL_FAILURE:
            return "General SOCKS server failure";
          case REPLY_CODES.CONNECTION_NOT_ALLOWED:
            return "Connection not allowed by ruleset";
          case REPLY_CODES.NETWORK_UNREACHABLE:
            return "Network unreachable";
          case REPLY_CODES.HOST_UNREACHABLE:
            return "Host unreachable";
          case REPLY_CODES.CONNECTION_REFUSED:
            return "Connection refused";
          case REPLY_CODES.TTL_EXPIRED:
            return "TTL expired";
          case REPLY_CODES.COMMAND_NOT_SUPPORTED:
            return "Command not supported";
          case REPLY_CODES.ADDRESS_TYPE_NOT_SUPPORTED:
            return "Address type not supported";
          default:
            return `Unknown error code: ${reply}`;
        }
      }
    };
    module2.exports = {
      Socks5Client,
      AUTH_METHODS,
      COMMANDS,
      ADDRESS_TYPES,
      REPLY_CODES,
      STATES
    };
  }
});

// lib/dispatcher/socks5-proxy-agent.js
var require_socks5_proxy_agent = __commonJS({
  "lib/dispatcher/socks5-proxy-agent.js"(exports2, module2) {
    "use strict";
    var net = require("node:net");
    var { URL: URL2 } = require("node:url");
    var tls;
    var DispatcherBase = require_dispatcher_base();
    var { InvalidArgumentError } = require_errors();
    var { Socks5Client } = require_socks5_client();
    var { kDispatch, kClose, kDestroy } = require_symbols();
    var Pool = require_pool();
    var buildConnector = require_connect();
    var { debuglog } = require("node:util");
    var debug = debuglog("undici:socks5-proxy");
    var kProxyUrl = /* @__PURE__ */ Symbol("proxy url");
    var kProxyHeaders = /* @__PURE__ */ Symbol("proxy headers");
    var kProxyAuth = /* @__PURE__ */ Symbol("proxy auth");
    var kPool = /* @__PURE__ */ Symbol("pool");
    var kConnector = /* @__PURE__ */ Symbol("connector");
    var experimentalWarningEmitted = false;
    var Socks5ProxyAgent = class extends DispatcherBase {
      static {
        __name(this, "Socks5ProxyAgent");
      }
      constructor(proxyUrl, options = {}) {
        super();
        if (!experimentalWarningEmitted) {
          process.emitWarning(
            "SOCKS5 proxy support is experimental and subject to change",
            "ExperimentalWarning"
          );
          experimentalWarningEmitted = true;
        }
        if (!proxyUrl) {
          throw new InvalidArgumentError("Proxy URL is mandatory");
        }
        const url = typeof proxyUrl === "string" ? new URL2(proxyUrl) : proxyUrl;
        if (url.protocol !== "socks5:" && url.protocol !== "socks:") {
          throw new InvalidArgumentError("Proxy URL must use socks5:// or socks:// protocol");
        }
        this[kProxyUrl] = url;
        this[kProxyHeaders] = options.headers || {};
        this[kProxyAuth] = {
          username: options.username || (url.username ? decodeURIComponent(url.username) : null),
          password: options.password || (url.password ? decodeURIComponent(url.password) : null)
        };
        this[kConnector] = options.connect || buildConnector({
          ...options.proxyTls,
          servername: options.proxyTls?.servername || url.hostname
        });
        this[kPool] = null;
      }
      /**
       * Create a SOCKS5 connection to the proxy
       */
      async createSocks5Connection(targetHost, targetPort) {
        const proxyHost = this[kProxyUrl].hostname;
        const proxyPort = parseInt(this[kProxyUrl].port) || 1080;
        debug("creating SOCKS5 connection to", proxyHost, proxyPort);
        const socket = await new Promise((resolve, reject) => {
          const onConnect = /* @__PURE__ */ __name(() => {
            socket2.removeListener("error", onError);
            resolve(socket2);
          }, "onConnect");
          const onError = /* @__PURE__ */ __name((err) => {
            socket2.removeListener("connect", onConnect);
            reject(err);
          }, "onError");
          const socket2 = net.connect({
            host: proxyHost,
            port: proxyPort
          });
          socket2.once("connect", onConnect);
          socket2.once("error", onError);
        });
        const socks5Client = new Socks5Client(socket, this[kProxyAuth]);
        socks5Client.on("error", (err) => {
          debug("SOCKS5 error:", err);
          socket.destroy();
        });
        await socks5Client.handshake();
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("SOCKS5 authentication timeout"));
          }, 5e3);
          const onAuthenticated = /* @__PURE__ */ __name(() => {
            clearTimeout(timeout);
            socks5Client.removeListener("error", onError);
            resolve();
          }, "onAuthenticated");
          const onError = /* @__PURE__ */ __name((err) => {
            clearTimeout(timeout);
            socks5Client.removeListener("authenticated", onAuthenticated);
            reject(err);
          }, "onError");
          if (socks5Client.state === "authenticated") {
            clearTimeout(timeout);
            resolve();
          } else {
            socks5Client.once("authenticated", onAuthenticated);
            socks5Client.once("error", onError);
          }
        });
        await socks5Client.connect(targetHost, targetPort);
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("SOCKS5 connection timeout"));
          }, 5e3);
          const onConnected = /* @__PURE__ */ __name((info) => {
            debug("SOCKS5 tunnel established to", targetHost, targetPort, "via", info);
            clearTimeout(timeout);
            socks5Client.removeListener("error", onError);
            resolve();
          }, "onConnected");
          const onError = /* @__PURE__ */ __name((err) => {
            clearTimeout(timeout);
            socks5Client.removeListener("connected", onConnected);
            reject(err);
          }, "onError");
          socks5Client.once("connected", onConnected);
          socks5Client.once("error", onError);
        });
        return socket;
      }
      /**
       * Dispatch a request through the SOCKS5 proxy
       */
      async [kDispatch](opts, handler) {
        const { origin } = opts;
        debug("dispatching request to", origin, "via SOCKS5");
        try {
          if (!this[kPool] || this[kPool].destroyed || this[kPool].closed) {
            this[kPool] = new Pool(origin, {
              pipelining: opts.pipelining,
              connections: opts.connections,
              connect: /* @__PURE__ */ __name(async (connectOpts, callback) => {
                try {
                  const url = new URL2(origin);
                  const targetHost = url.hostname;
                  const targetPort = parseInt(url.port) || (url.protocol === "https:" ? 443 : 80);
                  debug("establishing SOCKS5 connection to", targetHost, targetPort);
                  const socket = await this.createSocks5Connection(targetHost, targetPort);
                  let finalSocket = socket;
                  if (url.protocol === "https:") {
                    if (!tls) {
                      tls = require("node:tls");
                    }
                    debug("upgrading to TLS");
                    finalSocket = tls.connect({
                      socket,
                      servername: targetHost,
                      ...connectOpts.tls || {}
                    });
                    await new Promise((resolve, reject) => {
                      finalSocket.once("secureConnect", resolve);
                      finalSocket.once("error", reject);
                    });
                  }
                  callback(null, finalSocket);
                } catch (err) {
                  debug("SOCKS5 connection error:", err);
                  callback(err);
                }
              }, "connect")
            });
          }
          return this[kPool][kDispatch](opts, handler);
        } catch (err) {
          debug("dispatch error:", err);
          if (typeof handler.onError === "function") {
            handler.onError(err);
          } else {
            throw err;
          }
        }
      }
      async [kClose]() {
        if (this[kPool]) {
          await this[kPool].close();
        }
      }
      async [kDestroy](err) {
        if (this[kPool]) {
          await this[kPool].destroy(err);
        }
      }
    };
    module2.exports = Socks5ProxyAgent;
  }
});

// lib/dispatcher/proxy-agent.js
var require_proxy_agent = __commonJS({
  "lib/dispatcher/proxy-agent.js"(exports2, module2) {
    "use strict";
    var { kProxy, kClose, kDestroy, kDispatch } = require_symbols();
    var Agent = require_agent();
    var Pool = require_pool();
    var DispatcherBase = require_dispatcher_base();
    var { InvalidArgumentError, RequestAbortedError, SecureProxyConnectionError } = require_errors();
    var buildConnector = require_connect();
    var Client = require_client();
    var { channels } = require_diagnostics();
    var Socks5ProxyAgent = require_socks5_proxy_agent();
    var kAgent = /* @__PURE__ */ Symbol("proxy agent");
    var kClient = /* @__PURE__ */ Symbol("proxy client");
    var kProxyHeaders = /* @__PURE__ */ Symbol("proxy headers");
    var kRequestTls = /* @__PURE__ */ Symbol("request tls settings");
    var kProxyTls = /* @__PURE__ */ Symbol("proxy tls settings");
    var kConnectEndpoint = /* @__PURE__ */ Symbol("connect endpoint function");
    var kTunnelProxy = /* @__PURE__ */ Symbol("tunnel proxy");
    function defaultProtocolPort(protocol) {
      return protocol === "https:" ? 443 : 80;
    }
    __name(defaultProtocolPort, "defaultProtocolPort");
    function defaultFactory(origin, opts) {
      return new Pool(origin, opts);
    }
    __name(defaultFactory, "defaultFactory");
    var noop = /* @__PURE__ */ __name(() => {
    }, "noop");
    function defaultAgentFactory(origin, opts) {
      if (opts.connections === 1) {
        return new Client(origin, opts);
      }
      return new Pool(origin, opts);
    }
    __name(defaultAgentFactory, "defaultAgentFactory");
    var Http1ProxyWrapper = class extends DispatcherBase {
      static {
        __name(this, "Http1ProxyWrapper");
      }
      #client;
      constructor(proxyUrl, { headers = {}, connect, factory }) {
        if (!proxyUrl) {
          throw new InvalidArgumentError("Proxy URL is mandatory");
        }
        super();
        this[kProxyHeaders] = headers;
        if (factory) {
          this.#client = factory(proxyUrl, { connect });
        } else {
          this.#client = new Client(proxyUrl, { connect });
        }
      }
      [kDispatch](opts, handler) {
        const onHeaders = handler.onHeaders;
        handler.onHeaders = function(statusCode, data, resume) {
          if (statusCode === 407) {
            if (typeof handler.onError === "function") {
              handler.onError(new InvalidArgumentError("Proxy Authentication Required (407)"));
            }
            return;
          }
          if (onHeaders) onHeaders.call(this, statusCode, data, resume);
        };
        const {
          origin,
          path = "/",
          headers = {}
        } = opts;
        opts.path = origin + path;
        if (!("host" in headers) && !("Host" in headers)) {
          const { host } = new URL(origin);
          headers.host = host;
        }
        opts.headers = { ...this[kProxyHeaders], ...headers };
        return this.#client[kDispatch](opts, handler);
      }
      [kClose]() {
        return this.#client.close();
      }
      [kDestroy](err) {
        return this.#client.destroy(err);
      }
    };
    var ProxyAgent = class extends DispatcherBase {
      static {
        __name(this, "ProxyAgent");
      }
      constructor(opts) {
        if (!opts || typeof opts === "object" && !(opts instanceof URL) && !opts.uri) {
          throw new InvalidArgumentError("Proxy uri is mandatory");
        }
        const { clientFactory = defaultFactory } = opts;
        if (typeof clientFactory !== "function") {
          throw new InvalidArgumentError("Proxy opts.clientFactory must be a function.");
        }
        const { proxyTunnel = true } = opts;
        super();
        const url = this.#getUrl(opts);
        const { href, origin, port, protocol, username, password, hostname: proxyHostname } = url;
        this[kProxy] = { uri: href, protocol };
        this[kRequestTls] = opts.requestTls;
        this[kProxyTls] = opts.proxyTls;
        this[kProxyHeaders] = opts.headers || {};
        this[kTunnelProxy] = proxyTunnel;
        if (opts.auth && opts.token) {
          throw new InvalidArgumentError("opts.auth cannot be used in combination with opts.token");
        } else if (opts.auth) {
          this[kProxyHeaders]["proxy-authorization"] = `Basic ${opts.auth}`;
        } else if (opts.token) {
          this[kProxyHeaders]["proxy-authorization"] = opts.token;
        } else if (username && password) {
          this[kProxyHeaders]["proxy-authorization"] = `Basic ${Buffer.from(`${decodeURIComponent(username)}:${decodeURIComponent(password)}`).toString("base64")}`;
        }
        const connect = buildConnector({ ...opts.proxyTls });
        this[kConnectEndpoint] = buildConnector({ ...opts.requestTls });
        const agentFactory = opts.factory || defaultAgentFactory;
        const factory = /* @__PURE__ */ __name((origin2, options) => {
          const { protocol: protocol2 } = new URL(origin2);
          if (this[kProxy].protocol === "socks5:" || this[kProxy].protocol === "socks:") {
            return new Socks5ProxyAgent(this[kProxy].uri, {
              headers: this[kProxyHeaders],
              connect,
              factory: agentFactory,
              username: opts.username || username,
              password: opts.password || password,
              proxyTls: opts.proxyTls
            });
          }
          if (!this[kTunnelProxy] && protocol2 === "http:" && this[kProxy].protocol === "http:") {
            return new Http1ProxyWrapper(this[kProxy].uri, {
              headers: this[kProxyHeaders],
              connect,
              factory: agentFactory
            });
          }
          return agentFactory(origin2, options);
        }, "factory");
        if (protocol === "socks5:" || protocol === "socks:") {
          this[kClient] = null;
        } else {
          this[kClient] = clientFactory(url, { connect });
        }
        this[kAgent] = new Agent({
          ...opts,
          factory,
          connect: /* @__PURE__ */ __name(async (opts2, callback) => {
            if (!this[kClient]) {
              callback(new InvalidArgumentError("Cannot establish tunnel connection without a proxy client"));
              return;
            }
            let requestedPath = opts2.host;
            if (!opts2.port) {
              requestedPath += `:${defaultProtocolPort(opts2.protocol)}`;
            }
            try {
              const connectParams = {
                origin,
                port,
                path: requestedPath,
                signal: opts2.signal,
                headers: {
                  ...this[kProxyHeaders],
                  host: opts2.host,
                  ...opts2.connections == null || opts2.connections > 0 ? { "proxy-connection": "keep-alive" } : {}
                },
                servername: this[kProxyTls]?.servername || proxyHostname
              };
              const { socket, statusCode } = await this[kClient].connect(connectParams);
              if (statusCode !== 200) {
                socket.on("error", noop).destroy();
                callback(new RequestAbortedError(`Proxy response (${statusCode}) !== 200 when HTTP Tunneling`));
                return;
              }
              if (channels.proxyConnected.hasSubscribers) {
                channels.proxyConnected.publish({
                  socket,
                  connectParams
                });
              }
              if (opts2.protocol !== "https:") {
                callback(null, socket);
                return;
              }
              let servername;
              if (this[kRequestTls]) {
                servername = this[kRequestTls].servername;
              } else {
                servername = opts2.servername;
              }
              this[kConnectEndpoint]({ ...opts2, servername, httpSocket: socket }, callback);
            } catch (err) {
              if (err.code === "ERR_TLS_CERT_ALTNAME_INVALID") {
                callback(new SecureProxyConnectionError(err));
              } else {
                callback(err);
              }
            }
          }, "connect")
        });
      }
      dispatch(opts, handler) {
        const headers = buildHeaders(opts.headers);
        throwIfProxyAuthIsSent(headers);
        if (headers && !("host" in headers) && !("Host" in headers)) {
          const { host } = new URL(opts.origin);
          headers.host = host;
        }
        return this[kAgent].dispatch(
          {
            ...opts,
            headers
          },
          handler
        );
      }
      /**
       * @param {import('../../types/proxy-agent').ProxyAgent.Options | string | URL} opts
       * @returns {URL}
       */
      #getUrl(opts) {
        if (typeof opts === "string") {
          return new URL(opts);
        } else if (opts instanceof URL) {
          return opts;
        } else {
          return new URL(opts.uri);
        }
      }
      [kClose]() {
        const promises = [this[kAgent].close()];
        if (this[kClient]) {
          promises.push(this[kClient].close());
        }
        return Promise.all(promises);
      }
      [kDestroy]() {
        const promises = [this[kAgent].destroy()];
        if (this[kClient]) {
          promises.push(this[kClient].destroy());
        }
        return Promise.all(promises);
      }
    };
    function buildHeaders(headers) {
      if (Array.isArray(headers)) {
        const headersPair = {};
        for (let i = 0; i < headers.length; i += 2) {
          headersPair[headers[i]] = headers[i + 1];
        }
        return headersPair;
      }
      return headers;
    }
    __name(buildHeaders, "buildHeaders");
    function throwIfProxyAuthIsSent(headers) {
      const existProxyAuth = headers && Object.keys(headers).find((key) => key.toLowerCase() === "proxy-authorization");
      if (existProxyAuth) {
        throw new InvalidArgumentError("Proxy-Authorization should be sent in ProxyAgent constructor");
      }
    }
    __name(throwIfProxyAuthIsSent, "throwIfProxyAuthIsSent");
    module2.exports = ProxyAgent;
  }
});

// lib/dispatcher/env-http-proxy-agent.js
var require_env_http_proxy_agent = __commonJS({
  "lib/dispatcher/env-http-proxy-agent.js"(exports2, module2) {
    "use strict";
    var DispatcherBase = require_dispatcher_base();
    var { kClose, kDestroy, kClosed, kDestroyed, kDispatch, kNoProxyAgent, kHttpProxyAgent, kHttpsProxyAgent } = require_symbols();
    var ProxyAgent = require_proxy_agent();
    var Agent = require_agent();
    var DEFAULT_PORTS = {
      "http:": 80,
      "https:": 443
    };
    var EnvHttpProxyAgent2 = class extends DispatcherBase {
      static {
        __name(this, "EnvHttpProxyAgent");
      }
      #noProxyValue = null;
      #noProxyEntries = null;
      #opts = null;
      constructor(opts = {}) {
        super();
        this.#opts = opts;
        const { httpProxy, httpsProxy, noProxy, ...agentOpts } = opts;
        this[kNoProxyAgent] = new Agent(agentOpts);
        const HTTP_PROXY = httpProxy ?? process.env.http_proxy ?? process.env.HTTP_PROXY;
        if (HTTP_PROXY) {
          this[kHttpProxyAgent] = new ProxyAgent({ ...agentOpts, uri: HTTP_PROXY });
        } else {
          this[kHttpProxyAgent] = this[kNoProxyAgent];
        }
        const HTTPS_PROXY = httpsProxy ?? process.env.https_proxy ?? process.env.HTTPS_PROXY;
        if (HTTPS_PROXY) {
          this[kHttpsProxyAgent] = new ProxyAgent({ ...agentOpts, uri: HTTPS_PROXY });
        } else {
          this[kHttpsProxyAgent] = this[kHttpProxyAgent];
        }
        this.#parseNoProxy();
      }
      [kDispatch](opts, handler) {
        const url = new URL(opts.origin);
        const agent = this.#getProxyAgentForUrl(url);
        return agent.dispatch(opts, handler);
      }
      [kClose]() {
        return Promise.all([
          this[kNoProxyAgent].close(),
          !this[kHttpProxyAgent][kClosed] && this[kHttpProxyAgent].close(),
          !this[kHttpsProxyAgent][kClosed] && this[kHttpsProxyAgent].close()
        ]);
      }
      [kDestroy](err) {
        return Promise.all([
          this[kNoProxyAgent].destroy(err),
          !this[kHttpProxyAgent][kDestroyed] && this[kHttpProxyAgent].destroy(err),
          !this[kHttpsProxyAgent][kDestroyed] && this[kHttpsProxyAgent].destroy(err)
        ]);
      }
      #getProxyAgentForUrl(url) {
        let { protocol, host: hostname, port } = url;
        hostname = hostname.replace(/:\d*$/, "").toLowerCase();
        port = Number.parseInt(port, 10) || DEFAULT_PORTS[protocol] || 0;
        if (!this.#shouldProxy(hostname, port)) {
          return this[kNoProxyAgent];
        }
        if (protocol === "https:") {
          return this[kHttpsProxyAgent];
        }
        return this[kHttpProxyAgent];
      }
      #shouldProxy(hostname, port) {
        if (this.#noProxyChanged) {
          this.#parseNoProxy();
        }
        if (this.#noProxyEntries.length === 0) {
          return true;
        }
        if (this.#noProxyValue === "*") {
          return false;
        }
        for (let i = 0; i < this.#noProxyEntries.length; i++) {
          const entry = this.#noProxyEntries[i];
          if (entry.port && entry.port !== port) {
            continue;
          }
          if (hostname === entry.hostname) {
            return false;
          }
          if (hostname.slice(-(entry.hostname.length + 1)) === `.${entry.hostname}`) {
            return false;
          }
        }
        return true;
      }
      #parseNoProxy() {
        const noProxyValue = this.#opts.noProxy ?? this.#noProxyEnv;
        const noProxySplit = noProxyValue.split(/[,\s]/);
        const noProxyEntries = [];
        for (let i = 0; i < noProxySplit.length; i++) {
          const entry = noProxySplit[i];
          if (!entry) {
            continue;
          }
          const parsed = entry.match(/^(.+):(\d+)$/);
          noProxyEntries.push({
            // strip leading dot or asterisk with dot
            hostname: (parsed ? parsed[1] : entry).replace(/^\*?\./, "").toLowerCase(),
            port: parsed ? Number.parseInt(parsed[2], 10) : 0
          });
        }
        this.#noProxyValue = noProxyValue;
        this.#noProxyEntries = noProxyEntries;
      }
      get #noProxyChanged() {
        if (this.#opts.noProxy !== void 0) {
          return false;
        }
        return this.#noProxyValue !== this.#noProxyEnv;
      }
      get #noProxyEnv() {
        return process.env.no_proxy ?? process.env.NO_PROXY ?? "";
      }
    };
    module2.exports = EnvHttpProxyAgent2;
  }
});

// lib/web/fetch/headers.js
var require_headers = __commonJS({
  "lib/web/fetch/headers.js"(exports2, module2) {
    "use strict";
    var { kConstruct } = require_symbols();
    var { kEnumerableProperty } = require_util();
    var {
      iteratorMixin,
      isValidHeaderName,
      isValidHeaderValue
    } = require_util2();
    var { webidl } = require_webidl();
    var assert = require("node:assert");
    var util = require("node:util");
    function isHTTPWhiteSpaceCharCode(code) {
      return code === 10 || code === 13 || code === 9 || code === 32;
    }
    __name(isHTTPWhiteSpaceCharCode, "isHTTPWhiteSpaceCharCode");
    function headerValueNormalize(potentialValue) {
      let i = 0;
      let j = potentialValue.length;
      while (j > i && isHTTPWhiteSpaceCharCode(potentialValue.charCodeAt(j - 1))) --j;
      while (j > i && isHTTPWhiteSpaceCharCode(potentialValue.charCodeAt(i))) ++i;
      return i === 0 && j === potentialValue.length ? potentialValue : potentialValue.substring(i, j);
    }
    __name(headerValueNormalize, "headerValueNormalize");
    function fill(headers, object) {
      if (Array.isArray(object)) {
        for (let i = 0; i < object.length; ++i) {
          const header = object[i];
          if (header.length !== 2) {
            throw webidl.errors.exception({
              header: "Headers constructor",
              message: `expected name/value pair to be length 2, found ${header.length}.`
            });
          }
          appendHeader(headers, header[0], header[1]);
        }
      } else if (typeof object === "object" && object !== null) {
        const keys = Object.keys(object);
        for (let i = 0; i < keys.length; ++i) {
          appendHeader(headers, keys[i], object[keys[i]]);
        }
      } else {
        throw webidl.errors.conversionFailed({
          prefix: "Headers constructor",
          argument: "Argument 1",
          types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
        });
      }
    }
    __name(fill, "fill");
    function appendHeader(headers, name, value) {
      value = headerValueNormalize(value);
      if (!isValidHeaderName(name)) {
        throw webidl.errors.invalidArgument({
          prefix: "Headers.append",
          value: name,
          type: "header name"
        });
      } else if (!isValidHeaderValue(value)) {
        throw webidl.errors.invalidArgument({
          prefix: "Headers.append",
          value,
          type: "header value"
        });
      }
      if (getHeadersGuard(headers) === "immutable") {
        throw new TypeError("immutable");
      }
      return getHeadersList(headers).append(name, value, false);
    }
    __name(appendHeader, "appendHeader");
    function headersListSortAndCombine(target) {
      const headersList = getHeadersList(target);
      if (!headersList) {
        return [];
      }
      if (headersList.sortedMap) {
        return headersList.sortedMap;
      }
      const headers = [];
      const names = headersList.toSortedArray();
      const cookies = headersList.cookies;
      if (cookies === null || cookies.length === 1) {
        return headersList.sortedMap = names;
      }
      for (let i = 0; i < names.length; ++i) {
        const { 0: name, 1: value } = names[i];
        if (name === "set-cookie") {
          for (let j = 0; j < cookies.length; ++j) {
            headers.push([name, cookies[j]]);
          }
        } else {
          headers.push([name, value]);
        }
      }
      return headersList.sortedMap = headers;
    }
    __name(headersListSortAndCombine, "headersListSortAndCombine");
    function compareHeaderName(a, b) {
      return a[0] < b[0] ? -1 : 1;
    }
    __name(compareHeaderName, "compareHeaderName");
    var HeadersList = class _HeadersList {
      static {
        __name(this, "HeadersList");
      }
      /** @type {[string, string][]|null} */
      cookies = null;
      sortedMap;
      headersMap;
      constructor(init) {
        if (init instanceof _HeadersList) {
          this.headersMap = new Map(init.headersMap);
          this.sortedMap = init.sortedMap;
          this.cookies = init.cookies === null ? null : [...init.cookies];
        } else {
          this.headersMap = new Map(init);
          this.sortedMap = null;
        }
      }
      /**
       * @see https://fetch.spec.whatwg.org/#header-list-contains
       * @param {string} name
       * @param {boolean} isLowerCase
       */
      contains(name, isLowerCase) {
        return this.headersMap.has(isLowerCase ? name : name.toLowerCase());
      }
      clear() {
        this.headersMap.clear();
        this.sortedMap = null;
        this.cookies = null;
      }
      /**
       * @see https://fetch.spec.whatwg.org/#concept-header-list-append
       * @param {string} name
       * @param {string} value
       * @param {boolean} isLowerCase
       */
      append(name, value, isLowerCase) {
        this.sortedMap = null;
        const lowercaseName = isLowerCase ? name : name.toLowerCase();
        const exists = this.headersMap.get(lowercaseName);
        if (exists) {
          const delimiter = lowercaseName === "cookie" ? "; " : ", ";
          this.headersMap.set(lowercaseName, {
            name: exists.name,
            value: `${exists.value}${delimiter}${value}`
          });
        } else {
          this.headersMap.set(lowercaseName, { name, value });
        }
        if (lowercaseName === "set-cookie") {
          (this.cookies ??= []).push(value);
        }
      }
      /**
       * @see https://fetch.spec.whatwg.org/#concept-header-list-set
       * @param {string} name
       * @param {string} value
       * @param {boolean} isLowerCase
       */
      set(name, value, isLowerCase) {
        this.sortedMap = null;
        const lowercaseName = isLowerCase ? name : name.toLowerCase();
        if (lowercaseName === "set-cookie") {
          this.cookies = [value];
        }
        this.headersMap.set(lowercaseName, { name, value });
      }
      /**
       * @see https://fetch.spec.whatwg.org/#concept-header-list-delete
       * @param {string} name
       * @param {boolean} isLowerCase
       */
      delete(name, isLowerCase) {
        this.sortedMap = null;
        if (!isLowerCase) name = name.toLowerCase();
        if (name === "set-cookie") {
          this.cookies = null;
        }
        this.headersMap.delete(name);
      }
      /**
       * @see https://fetch.spec.whatwg.org/#concept-header-list-get
       * @param {string} name
       * @param {boolean} isLowerCase
       * @returns {string | null}
       */
      get(name, isLowerCase) {
        return this.headersMap.get(isLowerCase ? name : name.toLowerCase())?.value ?? null;
      }
      *[Symbol.iterator]() {
        for (const { 0: name, 1: { value } } of this.headersMap) {
          yield [name, value];
        }
      }
      get entries() {
        const headers = {};
        if (this.headersMap.size !== 0) {
          for (const { name, value } of this.headersMap.values()) {
            headers[name] = value;
          }
        }
        return headers;
      }
      rawValues() {
        return this.headersMap.values();
      }
      get entriesList() {
        const headers = [];
        if (this.headersMap.size !== 0) {
          for (const { 0: lowerName, 1: { name, value } } of this.headersMap) {
            if (lowerName === "set-cookie") {
              for (const cookie of this.cookies) {
                headers.push([name, cookie]);
              }
            } else {
              headers.push([name, value]);
            }
          }
        }
        return headers;
      }
      // https://fetch.spec.whatwg.org/#convert-header-names-to-a-sorted-lowercase-set
      toSortedArray() {
        const size = this.headersMap.size;
        const array = new Array(size);
        if (size <= 32) {
          if (size === 0) {
            return array;
          }
          const iterator = this.headersMap[Symbol.iterator]();
          const firstValue = iterator.next().value;
          array[0] = [firstValue[0], firstValue[1].value];
          assert(firstValue[1].value !== null);
          for (let i = 1, j = 0, right = 0, left = 0, pivot = 0, x, value; i < size; ++i) {
            value = iterator.next().value;
            x = array[i] = [value[0], value[1].value];
            assert(x[1] !== null);
            left = 0;
            right = i;
            while (left < right) {
              pivot = left + (right - left >> 1);
              if (array[pivot][0] <= x[0]) {
                left = pivot + 1;
              } else {
                right = pivot;
              }
            }
            if (i !== pivot) {
              j = i;
              while (j > left) {
                array[j] = array[--j];
              }
              array[left] = x;
            }
          }
          if (!iterator.next().done) {
            throw new TypeError("Unreachable");
          }
          return array;
        } else {
          let i = 0;
          for (const { 0: name, 1: { value } } of this.headersMap) {
            array[i++] = [name, value];
            assert(value !== null);
          }
          return array.sort(compareHeaderName);
        }
      }
    };
    var Headers = class _Headers {
      static {
        __name(this, "Headers");
      }
      #guard;
      /**
       * @type {HeadersList}
       */
      #headersList;
      /**
       * @param {HeadersInit|Symbol} [init]
       * @returns
       */
      constructor(init = void 0) {
        webidl.util.markAsUncloneable(this);
        if (init === kConstruct) {
          return;
        }
        this.#headersList = new HeadersList();
        this.#guard = "none";
        if (init !== void 0) {
          init = webidl.converters.HeadersInit(init, "Headers constructor", "init");
          fill(this, init);
        }
      }
      // https://fetch.spec.whatwg.org/#dom-headers-append
      append(name, value) {
        webidl.brandCheck(this, _Headers);
        webidl.argumentLengthCheck(arguments, 2, "Headers.append");
        const prefix = "Headers.append";
        name = webidl.converters.ByteString(name, prefix, "name");
        value = webidl.converters.ByteString(value, prefix, "value");
        return appendHeader(this, name, value);
      }
      // https://fetch.spec.whatwg.org/#dom-headers-delete
      delete(name) {
        webidl.brandCheck(this, _Headers);
        webidl.argumentLengthCheck(arguments, 1, "Headers.delete");
        const prefix = "Headers.delete";
        name = webidl.converters.ByteString(name, prefix, "name");
        if (!isValidHeaderName(name)) {
          throw webidl.errors.invalidArgument({
            prefix: "Headers.delete",
            value: name,
            type: "header name"
          });
        }
        if (this.#guard === "immutable") {
          throw new TypeError("immutable");
        }
        if (!this.#headersList.contains(name, false)) {
          return;
        }
        this.#headersList.delete(name, false);
      }
      // https://fetch.spec.whatwg.org/#dom-headers-get
      get(name) {
        webidl.brandCheck(this, _Headers);
        webidl.argumentLengthCheck(arguments, 1, "Headers.get");
        const prefix = "Headers.get";
        name = webidl.converters.ByteString(name, prefix, "name");
        if (!isValidHeaderName(name)) {
          throw webidl.errors.invalidArgument({
            prefix,
            value: name,
            type: "header name"
          });
        }
        return this.#headersList.get(name, false);
      }
      // https://fetch.spec.whatwg.org/#dom-headers-has
      has(name) {
        webidl.brandCheck(this, _Headers);
        webidl.argumentLengthCheck(arguments, 1, "Headers.has");
        const prefix = "Headers.has";
        name = webidl.converters.ByteString(name, prefix, "name");
        if (!isValidHeaderName(name)) {
          throw webidl.errors.invalidArgument({
            prefix,
            value: name,
            type: "header name"
          });
        }
        return this.#headersList.contains(name, false);
      }
      // https://fetch.spec.whatwg.org/#dom-headers-set
      set(name, value) {
        webidl.brandCheck(this, _Headers);
        webidl.argumentLengthCheck(arguments, 2, "Headers.set");
        const prefix = "Headers.set";
        name = webidl.converters.ByteString(name, prefix, "name");
        value = webidl.converters.ByteString(value, prefix, "value");
        value = headerValueNormalize(value);
        if (!isValidHeaderName(name)) {
          throw webidl.errors.invalidArgument({
            prefix,
            value: name,
            type: "header name"
          });
        } else if (!isValidHeaderValue(value)) {
          throw webidl.errors.invalidArgument({
            prefix,
            value,
            type: "header value"
          });
        }
        if (this.#guard === "immutable") {
          throw new TypeError("immutable");
        }
        this.#headersList.set(name, value, false);
      }
      // https://fetch.spec.whatwg.org/#dom-headers-getsetcookie
      getSetCookie() {
        webidl.brandCheck(this, _Headers);
        const list = this.#headersList.cookies;
        if (list) {
          return [...list];
        }
        return [];
      }
      [util.inspect.custom](depth, options) {
        options.depth ??= depth;
        return `Headers ${util.formatWithOptions(options, this.#headersList.entries)}`;
      }
      static getHeadersGuard(o) {
        return o.#guard;
      }
      static setHeadersGuard(o, guard) {
        o.#guard = guard;
      }
      /**
       * @param {Headers} o
       */
      static getHeadersList(o) {
        return o.#headersList;
      }
      /**
       * @param {Headers} target
       * @param {HeadersList} list
       */
      static setHeadersList(target, list) {
        target.#headersList = list;
      }
    };
    var { getHeadersGuard, setHeadersGuard, getHeadersList, setHeadersList } = Headers;
    Reflect.deleteProperty(Headers, "getHeadersGuard");
    Reflect.deleteProperty(Headers, "setHeadersGuard");
    Reflect.deleteProperty(Headers, "getHeadersList");
    Reflect.deleteProperty(Headers, "setHeadersList");
    iteratorMixin("Headers", Headers, headersListSortAndCombine, 0, 1);
    Object.defineProperties(Headers.prototype, {
      append: kEnumerableProperty,
      delete: kEnumerableProperty,
      get: kEnumerableProperty,
      has: kEnumerableProperty,
      set: kEnumerableProperty,
      getSetCookie: kEnumerableProperty,
      [Symbol.toStringTag]: {
        value: "Headers",
        configurable: true
      },
      [util.inspect.custom]: {
        enumerable: false
      }
    });
    webidl.converters.HeadersInit = function(V, prefix, argument) {
      if (webidl.util.Type(V) === webidl.util.Types.OBJECT) {
        const iterator = Reflect.get(V, Symbol.iterator);
        if (!util.types.isProxy(V) && iterator === Headers.prototype.entries) {
          try {
            return getHeadersList(V).entriesList;
          } catch {
          }
        }
        if (typeof iterator === "function") {
          return webidl.converters["sequence<sequence<ByteString>>"](V, prefix, argument, iterator.bind(V));
        }
        return webidl.converters["record<ByteString, ByteString>"](V, prefix, argument);
      }
      throw webidl.errors.conversionFailed({
        prefix: "Headers constructor",
        argument: "Argument 1",
        types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
      });
    };
    module2.exports = {
      fill,
      // for test.
      compareHeaderName,
      Headers,
      HeadersList,
      getHeadersGuard,
      setHeadersGuard,
      setHeadersList,
      getHeadersList
    };
  }
});

// lib/web/fetch/response.js
var require_response = __commonJS({
  "lib/web/fetch/response.js"(exports2, module2) {
    "use strict";
    var { Headers, HeadersList, fill, getHeadersGuard, setHeadersGuard, setHeadersList } = require_headers();
    var { extractBody, cloneBody, mixinBody, streamRegistry, bodyUnusable } = require_body();
    var util = require_util();
    var nodeUtil = require("node:util");
    var { kEnumerableProperty } = util;
    var {
      isValidReasonPhrase,
      isCancelled,
      isAborted,
      isErrorLike,
      environmentSettingsObject: relevantRealm
    } = require_util2();
    var {
      redirectStatusSet,
      nullBodyStatus
    } = require_constants3();
    var { webidl } = require_webidl();
    var { URLSerializer } = require_data_url();
    var { kConstruct } = require_symbols();
    var assert = require("node:assert");
    var { isomorphicEncode, serializeJavascriptValueToJSONString } = require_infra();
    var textEncoder = new TextEncoder("utf-8");
    var Response = class _Response {
      static {
        __name(this, "Response");
      }
      /** @type {Headers} */
      #headers;
      #state;
      // Creates network error Response.
      static error() {
        const responseObject = fromInnerResponse(makeNetworkError(), "immutable");
        return responseObject;
      }
      // https://fetch.spec.whatwg.org/#dom-response-json
      static json(data, init = void 0) {
        webidl.argumentLengthCheck(arguments, 1, "Response.json");
        if (init !== null) {
          init = webidl.converters.ResponseInit(init);
        }
        const bytes = textEncoder.encode(
          serializeJavascriptValueToJSONString(data)
        );
        const body = extractBody(bytes);
        const responseObject = fromInnerResponse(makeResponse({}), "response");
        initializeResponse(responseObject, init, { body: body[0], type: "application/json" });
        return responseObject;
      }
      // Creates a redirect Response that redirects to url with status status.
      static redirect(url, status = 302) {
        webidl.argumentLengthCheck(arguments, 1, "Response.redirect");
        url = webidl.converters.USVString(url);
        status = webidl.converters["unsigned short"](status);
        let parsedURL;
        try {
          parsedURL = new URL(url, relevantRealm.settingsObject.baseUrl);
        } catch (err) {
          throw new TypeError(`Failed to parse URL from ${url}`, { cause: err });
        }
        if (!redirectStatusSet.has(status)) {
          throw new RangeError(`Invalid status code ${status}`);
        }
        const responseObject = fromInnerResponse(makeResponse({}), "immutable");
        responseObject.#state.status = status;
        const value = isomorphicEncode(URLSerializer(parsedURL));
        responseObject.#state.headersList.append("location", value, true);
        return responseObject;
      }
      // https://fetch.spec.whatwg.org/#dom-response
      constructor(body = null, init = void 0) {
        webidl.util.markAsUncloneable(this);
        if (body === kConstruct) {
          return;
        }
        if (body !== null) {
          body = webidl.converters.BodyInit(body, "Response", "body");
        }
        init = webidl.converters.ResponseInit(init);
        this.#state = makeResponse({});
        this.#headers = new Headers(kConstruct);
        setHeadersGuard(this.#headers, "response");
        setHeadersList(this.#headers, this.#state.headersList);
        let bodyWithType = null;
        if (body != null) {
          const [extractedBody, type] = extractBody(body);
          bodyWithType = { body: extractedBody, type };
        }
        initializeResponse(this, init, bodyWithType);
      }
      // Returns response?s type, e.g., "cors".
      get type() {
        webidl.brandCheck(this, _Response);
        return this.#state.type;
      }
      // Returns response?s URL, if it has one; otherwise the empty string.
      get url() {
        webidl.brandCheck(this, _Response);
        const urlList = this.#state.urlList;
        const url = urlList[urlList.length - 1] ?? null;
        if (url === null) {
          return "";
        }
        return URLSerializer(url, true);
      }
      // Returns whether response was obtained through a redirect.
      get redirected() {
        webidl.brandCheck(this, _Response);
        return this.#state.urlList.length > 1;
      }
      // Returns response?s status.
      get status() {
        webidl.brandCheck(this, _Response);
        return this.#state.status;
      }
      // Returns whether response?s status is an ok status.
      get ok() {
        webidl.brandCheck(this, _Response);
        return this.#state.status >= 200 && this.#state.status <= 299;
      }
      // Returns response?s status message.
      get statusText() {
        webidl.brandCheck(this, _Response);
        return this.#state.statusText;
      }
      // Returns response?s headers as Headers.
      get headers() {
        webidl.brandCheck(this, _Response);
        return this.#headers;
      }
      get body() {
        webidl.brandCheck(this, _Response);
        return this.#state.body ? this.#state.body.stream : null;
      }
      get bodyUsed() {
        webidl.brandCheck(this, _Response);
        return !!this.#state.body && util.isDisturbed(this.#state.body.stream);
      }
      // Returns a clone of response.
      clone() {
        webidl.brandCheck(this, _Response);
        if (bodyUnusable(this.#state)) {
          throw webidl.errors.exception({
            header: "Response.clone",
            message: "Body has already been consumed."
          });
        }
        const clonedResponse = cloneResponse(this.#state);
        if (this.#state.urlList.length !== 0 && this.#state.body?.stream) {
          streamRegistry.register(this, new WeakRef(this.#state.body.stream));
        }
        return fromInnerResponse(clonedResponse, getHeadersGuard(this.#headers));
      }
      [nodeUtil.inspect.custom](depth, options) {
        if (options.depth === null) {
          options.depth = 2;
        }
        options.colors ??= true;
        const properties = {
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          body: this.body,
          bodyUsed: this.bodyUsed,
          ok: this.ok,
          redirected: this.redirected,
          type: this.type,
          url: this.url
        };
        return `Response ${nodeUtil.formatWithOptions(options, properties)}`;
      }
      /**
       * @param {Response} response
       */
      static getResponseHeaders(response) {
        return response.#headers;
      }
      /**
       * @param {Response} response
       * @param {Headers} newHeaders
       */
      static setResponseHeaders(response, newHeaders) {
        response.#headers = newHeaders;
      }
      /**
       * @param {Response} response
       */
      static getResponseState(response) {
        return response.#state;
      }
      /**
       * @param {Response} response
       * @param {any} newState
       */
      static setResponseState(response, newState) {
        response.#state = newState;
      }
    };
    var { getResponseHeaders, setResponseHeaders, getResponseState, setResponseState } = Response;
    Reflect.deleteProperty(Response, "getResponseHeaders");
    Reflect.deleteProperty(Response, "setResponseHeaders");
    Reflect.deleteProperty(Response, "getResponseState");
    Reflect.deleteProperty(Response, "setResponseState");
    mixinBody(Response, getResponseState);
    Object.defineProperties(Response.prototype, {
      type: kEnumerableProperty,
      url: kEnumerableProperty,
      status: kEnumerableProperty,
      ok: kEnumerableProperty,
      redirected: kEnumerableProperty,
      statusText: kEnumerableProperty,
      headers: kEnumerableProperty,
      clone: kEnumerableProperty,
      body: kEnumerableProperty,
      bodyUsed: kEnumerableProperty,
      [Symbol.toStringTag]: {
        value: "Response",
        configurable: true
      }
    });
    Object.defineProperties(Response, {
      json: kEnumerableProperty,
      redirect: kEnumerableProperty,
      error: kEnumerableProperty
    });
    function cloneResponse(response) {
      if (response.internalResponse) {
        return filterResponse(
          cloneResponse(response.internalResponse),
          response.type
        );
      }
      const newResponse = makeResponse({ ...response, body: null });
      if (response.body != null) {
        newResponse.body = cloneBody(response.body);
      }
      return newResponse;
    }
    __name(cloneResponse, "cloneResponse");
    function makeResponse(init) {
      return {
        aborted: false,
        rangeRequested: false,
        timingAllowPassed: false,
        requestIncludesCredentials: false,
        type: "default",
        status: 200,
        timingInfo: null,
        cacheState: "",
        statusText: "",
        ...init,
        headersList: init?.headersList ? new HeadersList(init?.headersList) : new HeadersList(),
        urlList: init?.urlList ? [...init.urlList] : []
      };
    }
    __name(makeResponse, "makeResponse");
    function makeNetworkError(reason) {
      const isError = isErrorLike(reason);
      return makeResponse({
        type: "error",
        status: 0,
        error: isError ? reason : new Error(reason ? String(reason) : reason),
        aborted: reason && reason.name === "AbortError"
      });
    }
    __name(makeNetworkError, "makeNetworkError");
    function isNetworkError(response) {
      return (
        // A network error is a response whose type is "error",
        response.type === "error" && // status is 0
        response.status === 0
      );
    }
    __name(isNetworkError, "isNetworkError");
    function makeFilteredResponse(response, state) {
      state = {
        internalResponse: response,
        ...state
      };
      return new Proxy(response, {
        get(target, p) {
          return p in state ? state[p] : target[p];
        },
        set(target, p, value) {
          assert(!(p in state));
          target[p] = value;
          return true;
        }
      });
    }
    __name(makeFilteredResponse, "makeFilteredResponse");
    function filterResponse(response, type) {
      if (type === "basic") {
        return makeFilteredResponse(response, {
          type: "basic",
          headersList: response.headersList
        });
      } else if (type === "cors") {
        return makeFilteredResponse(response, {
          type: "cors",
          headersList: response.headersList
        });
      } else if (type === "opaque") {
        return makeFilteredResponse(response, {
          type: "opaque",
          urlList: [],
          status: 0,
          statusText: "",
          body: null
        });
      } else if (type === "opaqueredirect") {
        return makeFilteredResponse(response, {
          type: "opaqueredirect",
          status: 0,
          statusText: "",
          headersList: [],
          body: null
        });
      } else {
        assert(false);
      }
    }
    __name(filterResponse, "filterResponse");
    function makeAppropriateNetworkError(fetchParams, err = null) {
      assert(isCancelled(fetchParams));
      return isAborted(fetchParams) ? makeNetworkError(Object.assign(new DOMException("The operation was aborted.", "AbortError"), { cause: err })) : makeNetworkError(Object.assign(new DOMException("Request was cancelled."), { cause: err }));
    }
    __name(makeAppropriateNetworkError, "makeAppropriateNetworkError");
    function initializeResponse(response, init, body) {
      if (init.status !== null && (init.status < 200 || init.status > 599)) {
        throw new RangeError('init["status"] must be in the range of 200 to 599, inclusive.');
      }
      if ("statusText" in init && init.statusText != null) {
        if (!isValidReasonPhrase(String(init.statusText))) {
          throw new TypeError("Invalid statusText");
        }
      }
      if ("status" in init && init.status != null) {
        getResponseState(response).status = init.status;
      }
      if ("statusText" in init && init.statusText != null) {
        getResponseState(response).statusText = init.statusText;
      }
      if ("headers" in init && init.headers != null) {
        fill(getResponseHeaders(response), init.headers);
      }
      if (body) {
        if (nullBodyStatus.includes(response.status)) {
          throw webidl.errors.exception({
            header: "Response constructor",
            message: `Invalid response status code ${response.status}`
          });
        }
        getResponseState(response).body = body.body;
        if (body.type != null && !getResponseState(response).headersList.contains("content-type", true)) {
          getResponseState(response).headersList.append("content-type", body.type, true);
        }
      }
    }
    __name(initializeResponse, "initializeResponse");
    function fromInnerResponse(innerResponse, guard) {
      const response = new Response(kConstruct);
      setResponseState(response, innerResponse);
      const headers = new Headers(kConstruct);
      setResponseHeaders(response, headers);
      setHeadersList(headers, innerResponse.headersList);
      setHeadersGuard(headers, guard);
      if (innerResponse.urlList.length !== 0 && innerResponse.body?.stream) {
        streamRegistry.register(response, new WeakRef(innerResponse.body.stream));
      }
      return response;
    }
    __name(fromInnerResponse, "fromInnerResponse");
    webidl.converters.XMLHttpRequestBodyInit = function(V, prefix, name) {
      if (typeof V === "string") {
        return webidl.converters.USVString(V, prefix, name);
      }
      if (webidl.is.Blob(V)) {
        return V;
      }
      if (webidl.is.BufferSource(V)) {
        return V;
      }
      if (webidl.is.FormData(V)) {
        return V;
      }
      if (webidl.is.URLSearchParams(V)) {
        return V;
      }
      return webidl.converters.DOMString(V, prefix, name);
    };
    webidl.converters.BodyInit = function(V, prefix, argument) {
      if (webidl.is.ReadableStream(V)) {
        return V;
      }
      if (V?.[Symbol.asyncIterator]) {
        return V;
      }
      return webidl.converters.XMLHttpRequestBodyInit(V, prefix, argument);
    };
    webidl.converters.ResponseInit = webidl.dictionaryConverter([
      {
        key: "status",
        converter: webidl.converters["unsigned short"],
        defaultValue: /* @__PURE__ */ __name(() => 200, "defaultValue")
      },
      {
        key: "statusText",
        converter: webidl.converters.ByteString,
        defaultValue: /* @__PURE__ */ __name(() => "", "defaultValue")
      },
      {
        key: "headers",
        converter: webidl.converters.HeadersInit
      }
    ]);
    webidl.is.Response = webidl.util.MakeTypeAssertion(Response);
    module2.exports = {
      isNetworkError,
      makeNetworkError,
      makeResponse,
      makeAppropriateNetworkError,
      filterResponse,
      Response,
      cloneResponse,
      fromInnerResponse,
      getResponseState
    };
  }
});

// lib/web/fetch/request.js
var require_request2 = __commonJS({
  "lib/web/fetch/request.js"(exports2, module2) {
    "use strict";
    var { extractBody, mixinBody, cloneBody, bodyUnusable } = require_body();
    var { Headers, fill: fillHeaders, HeadersList, setHeadersGuard, getHeadersGuard, setHeadersList, getHeadersList } = require_headers();
    var util = require_util();
    var nodeUtil = require("node:util");
    var {
      isValidHTTPToken,
      sameOrigin,
      environmentSettingsObject
    } = require_util2();
    var {
      forbiddenMethodsSet,
      corsSafeListedMethodsSet,
      referrerPolicy,
      requestRedirect,
      requestMode,
      requestCredentials,
      requestCache,
      requestDuplex
    } = require_constants3();
    var { kEnumerableProperty, normalizedMethodRecordsBase, normalizedMethodRecords } = util;
    var { webidl } = require_webidl();
    var { URLSerializer } = require_data_url();
    var { kConstruct } = require_symbols();
    var assert = require("node:assert");
    var { getMaxListeners, setMaxListeners, defaultMaxListeners } = require("node:events");
    var kAbortController = /* @__PURE__ */ Symbol("abortController");
    var requestFinalizer = new FinalizationRegistry(({ signal, abort }) => {
      signal.removeEventListener("abort", abort);
    });
    var dependentControllerMap = /* @__PURE__ */ new WeakMap();
    var abortSignalHasEventHandlerLeakWarning;
    try {
      abortSignalHasEventHandlerLeakWarning = getMaxListeners(new AbortController().signal) > 0;
    } catch {
      abortSignalHasEventHandlerLeakWarning = false;
    }
    function buildAbort(acRef) {
      return abort;
      function abort() {
        const ac = acRef.deref();
        if (ac !== void 0) {
          requestFinalizer.unregister(abort);
          this.removeEventListener("abort", abort);
          ac.abort(this.reason);
          const controllerList = dependentControllerMap.get(ac.signal);
          if (controllerList !== void 0) {
            if (controllerList.size !== 0) {
              for (const ref of controllerList) {
                const ctrl = ref.deref();
                if (ctrl !== void 0) {
                  ctrl.abort(this.reason);
                }
              }
              controllerList.clear();
            }
            dependentControllerMap.delete(ac.signal);
          }
        }
      }
      __name(abort, "abort");
    }
    __name(buildAbort, "buildAbort");
    var patchMethodWarning = false;
    var Request = class _Request {
      static {
        __name(this, "Request");
      }
      /** @type {AbortSignal} */
      #signal;
      /** @type {import('../../dispatcher/dispatcher')} */
      #dispatcher;
      /** @type {Headers} */
      #headers;
      #state;
      // https://fetch.spec.whatwg.org/#dom-request
      constructor(input, init = void 0) {
        webidl.util.markAsUncloneable(this);
        if (input === kConstruct) {
          return;
        }
        const prefix = "Request constructor";
        webidl.argumentLengthCheck(arguments, 1, prefix);
        input = webidl.converters.RequestInfo(input);
        init = webidl.converters.RequestInit(init);
        let request = null;
        let fallbackMode = null;
        const baseUrl = environmentSettingsObject.settingsObject.baseUrl;
        let signal = null;
        if (typeof input === "string") {
          this.#dispatcher = init.dispatcher;
          let parsedURL;
          try {
            parsedURL = new URL(input, baseUrl);
          } catch (err) {
            throw new TypeError("Failed to parse URL from " + input, { cause: err });
          }
          if (parsedURL.username || parsedURL.password) {
            throw new TypeError(
              "Request cannot be constructed from a URL that includes credentials: " + input
            );
          }
          request = makeRequest({ urlList: [parsedURL] });
          fallbackMode = "cors";
        } else {
          assert(webidl.is.Request(input));
          request = input.#state;
          signal = input.#signal;
          this.#dispatcher = init.dispatcher || input.#dispatcher;
        }
        const origin = environmentSettingsObject.settingsObject.origin;
        let window = "client";
        if (request.window?.constructor?.name === "EnvironmentSettingsObject" && sameOrigin(request.window, origin)) {
          window = request.window;
        }
        if (init.window != null) {
          throw new TypeError(`'window' option '${window}' must be null`);
        }
        if ("window" in init) {
          window = "no-window";
        }
        request = makeRequest({
          // URL request?s URL.
          // undici implementation note: this is set as the first item in request's urlList in makeRequest
          // method request?s method.
          method: request.method,
          // header list A copy of request?s header list.
          // undici implementation note: headersList is cloned in makeRequest
          headersList: request.headersList,
          // unsafe-request flag Set.
          unsafeRequest: request.unsafeRequest,
          // client This?s relevant settings object.
          client: environmentSettingsObject.settingsObject,
          // window window.
          window,
          // priority request?s priority.
          priority: request.priority,
          // origin request?s origin. The propagation of the origin is only significant for navigation requests
          // being handled by a service worker. In this scenario a request can have an origin that is different
          // from the current client.
          origin: request.origin,
          // referrer request?s referrer.
          referrer: request.referrer,
          // referrer policy request?s referrer policy.
          referrerPolicy: request.referrerPolicy,
          // mode request?s mode.
          mode: request.mode,
          // credentials mode request?s credentials mode.
          credentials: request.credentials,
          // cache mode request?s cache mode.
          cache: request.cache,
          // redirect mode request?s redirect mode.
          redirect: request.redirect,
          // integrity metadata request?s integrity metadata.
          integrity: request.integrity,
          // keepalive request?s keepalive.
          keepalive: request.keepalive,
          // reload-navigation flag request?s reload-navigation flag.
          reloadNavigation: request.reloadNavigation,
          // history-navigation flag request?s history-navigation flag.
          historyNavigation: request.historyNavigation,
          // URL list A clone of request?s URL list.
          urlList: [...request.urlList]
        });
        const initHasKey = Object.keys(init).length !== 0;
        if (initHasKey) {
          if (request.mode === "navigate") {
            request.mode = "same-origin";
          }
          request.reloadNavigation = false;
          request.historyNavigation = false;
          request.origin = "client";
          request.referrer = "client";
          request.referrerPolicy = "";
          request.url = request.urlList[request.urlList.length - 1];
          request.urlList = [request.url];
        }
        if (init.referrer !== void 0) {
          const referrer = init.referrer;
          if (referrer === "") {
            request.referrer = "no-referrer";
          } else {
            let parsedReferrer;
            try {
              parsedReferrer = new URL(referrer, baseUrl);
            } catch (err) {
              throw new TypeError(`Referrer "${referrer}" is not a valid URL.`, { cause: err });
            }
            if (parsedReferrer.protocol === "about:" && parsedReferrer.hostname === "client" || origin && !sameOrigin(parsedReferrer, environmentSettingsObject.settingsObject.baseUrl)) {
              request.referrer = "client";
            } else {
              request.referrer = parsedReferrer;
            }
          }
        }
        if (init.referrerPolicy !== void 0) {
          request.referrerPolicy = init.referrerPolicy;
        }
        let mode;
        if (init.mode !== void 0) {
          mode = init.mode;
        } else {
          mode = fallbackMode;
        }
        if (mode === "navigate") {
          throw webidl.errors.exception({
            header: "Request constructor",
            message: "invalid request mode navigate."
          });
        }
        if (mode != null) {
          request.mode = mode;
        }
        if (init.credentials !== void 0) {
          request.credentials = init.credentials;
        }
        if (init.cache !== void 0) {
          request.cache = init.cache;
        }
        if (request.cache === "only-if-cached" && request.mode !== "same-origin") {
          throw new TypeError(
            "'only-if-cached' can be set only with 'same-origin' mode"
          );
        }
        if (init.redirect !== void 0) {
          request.redirect = init.redirect;
        }
        if (init.integrity != null) {
          request.integrity = String(init.integrity);
        }
        if (init.keepalive !== void 0) {
          request.keepalive = Boolean(init.keepalive);
        }
        if (init.method !== void 0) {
          let method = init.method;
          const mayBeNormalized = normalizedMethodRecords[method];
          if (mayBeNormalized !== void 0) {
            request.method = mayBeNormalized;
          } else {
            if (!isValidHTTPToken(method)) {
              throw new TypeError(`'${method}' is not a valid HTTP method.`);
            }
            const upperCase = method.toUpperCase();
            if (forbiddenMethodsSet.has(upperCase)) {
              throw new TypeError(`'${method}' HTTP method is unsupported.`);
            }
            method = normalizedMethodRecordsBase[upperCase] ?? method;
            request.method = method;
          }
          if (!patchMethodWarning && request.method === "patch") {
            process.emitWarning("Using `patch` is highly likely to result in a `405 Method Not Allowed`. `PATCH` is much more likely to succeed.", {
              code: "UNDICI-FETCH-patch"
            });
            patchMethodWarning = true;
          }
        }
        if (init.signal !== void 0) {
          signal = init.signal;
        }
        this.#state = request;
        const ac = new AbortController();
        this.#signal = ac.signal;
        if (signal != null) {
          if (signal.aborted) {
            ac.abort(signal.reason);
          } else {
            this[kAbortController] = ac;
            const acRef = new WeakRef(ac);
            const abort = buildAbort(acRef);
            if (abortSignalHasEventHandlerLeakWarning && getMaxListeners(signal) === defaultMaxListeners) {
              setMaxListeners(1500, signal);
            }
            util.addAbortListener(signal, abort);
            requestFinalizer.register(ac, { signal, abort }, abort);
          }
        }
        this.#headers = new Headers(kConstruct);
        setHeadersList(this.#headers, request.headersList);
        setHeadersGuard(this.#headers, "request");
        if (mode === "no-cors") {
          if (!corsSafeListedMethodsSet.has(request.method)) {
            throw new TypeError(
              `'${request.method} is unsupported in no-cors mode.`
            );
          }
          setHeadersGuard(this.#headers, "request-no-cors");
        }
        if (initHasKey) {
          const headersList = getHeadersList(this.#headers);
          const headers = init.headers !== void 0 ? init.headers : new HeadersList(headersList);
          headersList.clear();
          if (headers instanceof HeadersList) {
            for (const { name, value } of headers.rawValues()) {
              headersList.append(name, value, false);
            }
            headersList.cookies = headers.cookies;
          } else {
            fillHeaders(this.#headers, headers);
          }
        }
        const inputBody = webidl.is.Request(input) ? input.#state.body : null;
        if ((init.body != null || inputBody != null) && (request.method === "GET" || request.method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body.");
        }
        let initBody = null;
        if (init.body != null) {
          const [extractedBody, contentType] = extractBody(
            init.body,
            request.keepalive
          );
          initBody = extractedBody;
          if (contentType && !getHeadersList(this.#headers).contains("content-type", true)) {
            this.#headers.append("content-type", contentType, true);
          }
        }
        const inputOrInitBody = initBody ?? inputBody;
        if (inputOrInitBody != null && inputOrInitBody.source == null) {
          if (initBody != null && init.duplex == null) {
            throw new TypeError("RequestInit: duplex option is required when sending a body.");
          }
          if (request.mode !== "same-origin" && request.mode !== "cors") {
            throw new TypeError(
              'If request is made from ReadableStream, mode should be "same-origin" or "cors"'
            );
          }
          request.useCORSPreflightFlag = true;
        }
        let finalBody = inputOrInitBody;
        if (initBody == null && inputBody != null) {
          if (bodyUnusable(input.#state)) {
            throw new TypeError(
              "Cannot construct a Request with a Request object that has already been used."
            );
          }
          const identityTransform = new TransformStream();
          inputBody.stream.pipeThrough(identityTransform);
          finalBody = {
            source: inputBody.source,
            length: inputBody.length,
            stream: identityTransform.readable
          };
        }
        this.#state.body = finalBody;
      }
      // Returns request?s HTTP method, which is "GET" by default.
      get method() {
        webidl.brandCheck(this, _Request);
        return this.#state.method;
      }
      // Returns the URL of request as a string.
      get url() {
        webidl.brandCheck(this, _Request);
        return URLSerializer(this.#state.url);
      }
      // Returns a Headers object consisting of the headers associated with request.
      // Note that headers added in the network layer by the user agent will not
      // be accounted for in this object, e.g., the "Host" header.
      get headers() {
        webidl.brandCheck(this, _Request);
        return this.#headers;
      }
      // Returns the kind of resource requested by request, e.g., "document"
      // or "script".
      get destination() {
        webidl.brandCheck(this, _Request);
        return this.#state.destination;
      }
      // Returns the referrer of request. Its value can be a same-origin URL if
      // explicitly set in init, the empty string to indicate no referrer, and
      // "about:client" when defaulting to the global?s default. This is used
      // during fetching to determine the value of the `Referer` header of the
      // request being made.
      get referrer() {
        webidl.brandCheck(this, _Request);
        if (this.#state.referrer === "no-referrer") {
          return "";
        }
        if (this.#state.referrer === "client") {
          return "about:client";
        }
        return this.#state.referrer.toString();
      }
      // Returns the referrer policy associated with request.
      // This is used during fetching to compute the value of the request?s
      // referrer.
      get referrerPolicy() {
        webidl.brandCheck(this, _Request);
        return this.#state.referrerPolicy;
      }
      // Returns the mode associated with request, which is a string indicating
      // whether the request will use CORS, or will be restricted to same-origin
      // URLs.
      get mode() {
        webidl.brandCheck(this, _Request);
        return this.#state.mode;
      }
      // Returns the credentials mode associated with request,
      // which is a string indicating whether credentials will be sent with the
      // request always, never, or only when sent to a same-origin URL.
      get credentials() {
        webidl.brandCheck(this, _Request);
        return this.#state.credentials;
      }
      // Returns the cache mode associated with request,
      // which is a string indicating how the request will
      // interact with the browser?s cache when fetching.
      get cache() {
        webidl.brandCheck(this, _Request);
        return this.#state.cache;
      }
      // Returns the redirect mode associated with request,
      // which is a string indicating how redirects for the
      // request will be handled during fetching. A request
      // will follow redirects by default.
      get redirect() {
        webidl.brandCheck(this, _Request);
        return this.#state.redirect;
      }
      // Returns request?s subresource integrity metadata, which is a
      // cryptographic hash of the resource being fetched. Its value
      // consists of multiple hashes separated by whitespace. [SRI]
      get integrity() {
        webidl.brandCheck(this, _Request);
        return this.#state.integrity;
      }
      // Returns a boolean indicating whether or not request can outlive the
      // global in which it was created.
      get keepalive() {
        webidl.brandCheck(this, _Request);
        return this.#state.keepalive;
      }
      // Returns a boolean indicating whether or not request is for a reload
      // navigation.
      get isReloadNavigation() {
        webidl.brandCheck(this, _Request);
        return this.#state.reloadNavigation;
      }
      // Returns a boolean indicating whether or not request is for a history
      // navigation (a.k.a. back-forward navigation).
      get isHistoryNavigation() {
        webidl.brandCheck(this, _Request);
        return this.#state.historyNavigation;
      }
      // Returns the signal associated with request, which is an AbortSignal
      // object indicating whether or not request has been aborted, and its
      // abort event handler.
      get signal() {
        webidl.brandCheck(this, _Request);
        return this.#signal;
      }
      get body() {
        webidl.brandCheck(this, _Request);
        return this.#state.body ? this.#state.body.stream : null;
      }
      get bodyUsed() {
        webidl.brandCheck(this, _Request);
        return !!this.#state.body && util.isDisturbed(this.#state.body.stream);
      }
      get duplex() {
        webidl.brandCheck(this, _Request);
        return "half";
      }
      // Returns a clone of request.
      clone() {
        webidl.brandCheck(this, _Request);
        if (bodyUnusable(this.#state)) {
          throw new TypeError("unusable");
        }
        const clonedRequest = cloneRequest(this.#state);
        const ac = new AbortController();
        if (this.signal.aborted) {
          ac.abort(this.signal.reason);
        } else {
          let list = dependentControllerMap.get(this.signal);
          if (list === void 0) {
            list = /* @__PURE__ */ new Set();
            dependentControllerMap.set(this.signal, list);
          }
          const acRef = new WeakRef(ac);
          list.add(acRef);
          util.addAbortListener(
            ac.signal,
            buildAbort(acRef)
          );
        }
        return fromInnerRequest(clonedRequest, this.#dispatcher, ac.signal, getHeadersGuard(this.#headers));
      }
      [nodeUtil.inspect.custom](depth, options) {
        if (options.depth === null) {
          options.depth = 2;
        }
        options.colors ??= true;
        const properties = {
          method: this.method,
          url: this.url,
          headers: this.headers,
          destination: this.destination,
          referrer: this.referrer,
          referrerPolicy: this.referrerPolicy,
          mode: this.mode,
          credentials: this.credentials,
          cache: this.cache,
          redirect: this.redirect,
          integrity: this.integrity,
          keepalive: this.keepalive,
          isReloadNavigation: this.isReloadNavigation,
          isHistoryNavigation: this.isHistoryNavigation,
          signal: this.signal
        };
        return `Request ${nodeUtil.formatWithOptions(options, properties)}`;
      }
      /**
       * @param {Request} request
       * @param {AbortSignal} newSignal
       */
      static setRequestSignal(request, newSignal) {
        request.#signal = newSignal;
        return request;
      }
      /**
       * @param {Request} request
       */
      static getRequestDispatcher(request) {
        return request.#dispatcher;
      }
      /**
       * @param {Request} request
       * @param {import('../../dispatcher/dispatcher')} newDispatcher
       */
      static setRequestDispatcher(request, newDispatcher) {
        request.#dispatcher = newDispatcher;
      }
      /**
       * @param {Request} request
       * @param {Headers} newHeaders
       */
      static setRequestHeaders(request, newHeaders) {
        request.#headers = newHeaders;
      }
      /**
       * @param {Request} request
       */
      static getRequestState(request) {
        return request.#state;
      }
      /**
       * @param {Request} request
       * @param {any} newState
       */
      static setRequestState(request, newState) {
        request.#state = newState;
      }
    };
    var { setRequestSignal, getRequestDispatcher, setRequestDispatcher, setRequestHeaders, getRequestState, setRequestState } = Request;
    Reflect.deleteProperty(Request, "setRequestSignal");
    Reflect.deleteProperty(Request, "getRequestDispatcher");
    Reflect.deleteProperty(Request, "setRequestDispatcher");
    Reflect.deleteProperty(Request, "setRequestHeaders");
    Reflect.deleteProperty(Request, "getRequestState");
    Reflect.deleteProperty(Request, "setRequestState");
    mixinBody(Request, getRequestState);
    function makeRequest(init) {
      return {
        method: init.method ?? "GET",
        localURLsOnly: init.localURLsOnly ?? false,
        unsafeRequest: init.unsafeRequest ?? false,
        body: init.body ?? null,
        client: init.client ?? null,
        reservedClient: init.reservedClient ?? null,
        replacesClientId: init.replacesClientId ?? "",
        window: init.window ?? "client",
        keepalive: init.keepalive ?? false,
        serviceWorkers: init.serviceWorkers ?? "all",
        initiator: init.initiator ?? "",
        destination: init.destination ?? "",
        priority: init.priority ?? null,
        origin: init.origin ?? "client",
        policyContainer: init.policyContainer ?? "client",
        referrer: init.referrer ?? "client",
        referrerPolicy: init.referrerPolicy ?? "",
        mode: init.mode ?? "no-cors",
        useCORSPreflightFlag: init.useCORSPreflightFlag ?? false,
        credentials: init.credentials ?? "same-origin",
        useCredentials: init.useCredentials ?? false,
        cache: init.cache ?? "default",
        redirect: init.redirect ?? "follow",
        integrity: init.integrity ?? "",
        cryptoGraphicsNonceMetadata: init.cryptoGraphicsNonceMetadata ?? "",
        parserMetadata: init.parserMetadata ?? "",
        reloadNavigation: init.reloadNavigation ?? false,
        historyNavigation: init.historyNavigation ?? false,
        userActivation: init.userActivation ?? false,
        taintedOrigin: init.taintedOrigin ?? false,
        redirectCount: init.redirectCount ?? 0,
        responseTainting: init.responseTainting ?? "basic",
        preventNoCacheCacheControlHeaderModification: init.preventNoCacheCacheControlHeaderModification ?? false,
        done: init.done ?? false,
        timingAllowFailed: init.timingAllowFailed ?? false,
        useURLCredentials: init.useURLCredentials ?? void 0,
        traversableForUserPrompts: init.traversableForUserPrompts ?? "client",
        urlList: init.urlList,
        url: init.urlList[0],
        headersList: init.headersList ? new HeadersList(init.headersList) : new HeadersList()
      };
    }
    __name(makeRequest, "makeRequest");
    function cloneRequest(request) {
      const newRequest = makeRequest({ ...request, body: null });
      if (request.body != null) {
        newRequest.body = cloneBody(request.body);
      }
      return newRequest;
    }
    __name(cloneRequest, "cloneRequest");
    function fromInnerRequest(innerRequest, dispatcher, signal, guard) {
      const request = new Request(kConstruct);
      setRequestState(request, innerRequest);
      setRequestDispatcher(request, dispatcher);
      setRequestSignal(request, signal);
      const headers = new Headers(kConstruct);
      setRequestHeaders(request, headers);
      setHeadersList(headers, innerRequest.headersList);
      setHeadersGuard(headers, guard);
      return request;
    }
    __name(fromInnerRequest, "fromInnerRequest");
    Object.defineProperties(Request.prototype, {
      method: kEnumerableProperty,
      url: kEnumerableProperty,
      headers: kEnumerableProperty,
      redirect: kEnumerableProperty,
      clone: kEnumerableProperty,
      signal: kEnumerableProperty,
      duplex: kEnumerableProperty,
      destination: kEnumerableProperty,
      body: kEnumerableProperty,
      bodyUsed: kEnumerableProperty,
      isHistoryNavigation: kEnumerableProperty,
      isReloadNavigation: kEnumerableProperty,
      keepalive: kEnumerableProperty,
      integrity: kEnumerableProperty,
      cache: kEnumerableProperty,
      credentials: kEnumerableProperty,
      attribute: kEnumerableProperty,
      referrerPolicy: kEnumerableProperty,
      referrer: kEnumerableProperty,
      mode: kEnumerableProperty,
      [Symbol.toStringTag]: {
        value: "Request",
        configurable: true
      }
    });
    webidl.is.Request = webidl.util.MakeTypeAssertion(Request);
    webidl.converters.RequestInfo = function(V) {
      if (typeof V === "string") {
        return webidl.converters.USVString(V);
      }
      if (webidl.is.Request(V)) {
        return V;
      }
      return webidl.converters.USVString(V);
    };
    webidl.converters.RequestInit = webidl.dictionaryConverter([
      {
        key: "method",
        converter: webidl.converters.ByteString
      },
      {
        key: "headers",
        converter: webidl.converters.HeadersInit
      },
      {
        key: "body",
        converter: webidl.nullableConverter(
          webidl.converters.BodyInit
        )
      },
      {
        key: "referrer",
        converter: webidl.converters.USVString
      },
      {
        key: "referrerPolicy",
        converter: webidl.converters.DOMString,
        // https://w3c.github.io/webappsec-referrer-policy/#referrer-policy
        allowedValues: referrerPolicy
      },
      {
        key: "mode",
        converter: webidl.converters.DOMString,
        // https://fetch.spec.whatwg.org/#concept-request-mode
        allowedValues: requestMode
      },
      {
        key: "credentials",
        converter: webidl.converters.DOMString,
        // https://fetch.spec.whatwg.org/#requestcredentials
        allowedValues: requestCredentials
      },
      {
        key: "cache",
        converter: webidl.converters.DOMString,
        // https://fetch.spec.whatwg.org/#requestcache
        allowedValues: requestCache
      },
      {
        key: "redirect",
        converter: webidl.converters.DOMString,
        // https://fetch.spec.whatwg.org/#requestredirect
        allowedValues: requestRedirect
      },
      {
        key: "integrity",
        converter: webidl.converters.DOMString
      },
      {
        key: "keepalive",
        converter: webidl.converters.boolean
      },
      {
        key: "signal",
        converter: webidl.nullableConverter(
          (signal) => webidl.converters.AbortSignal(
            signal,
            "RequestInit",
            "signal"
          )
        )
      },
      {
        key: "window",
        converter: webidl.converters.any
      },
      {
        key: "duplex",
        converter: webidl.converters.DOMString,
        allowedValues: requestDuplex
      },
      {
        key: "dispatcher",
        // undici specific option
        converter: webidl.converters.any
      },
      {
        key: "priority",
        converter: webidl.converters.DOMString,
        allowedValues: ["high", "low", "auto"],
        defaultValue: /* @__PURE__ */ __name(() => "auto", "defaultValue")
      }
    ]);
    module2.exports = {
      Request,
      makeRequest,
      fromInnerRequest,
      cloneRequest,
      getRequestDispatcher,
      getRequestState
    };
  }
});

// lib/web/subresource-integrity/subresource-integrity.js
var require_subresource_integrity = __commonJS({
  "lib/web/subresource-integrity/subresource-integrity.js"(exports2, module2) {
    "use strict";
    var assert = require("node:assert");
    var { runtimeFeatures } = require_runtime_features();
    var validSRIHashAlgorithmTokenSet = /* @__PURE__ */ new Map([["sha256", 0], ["sha384", 1], ["sha512", 2]]);
    var crypto;
    if (runtimeFeatures.has("crypto")) {
      crypto = require("node:crypto");
      const cryptoHashes = crypto.getHashes();
      if (cryptoHashes.length === 0) {
        validSRIHashAlgorithmTokenSet.clear();
      }
      for (const algorithm of validSRIHashAlgorithmTokenSet.keys()) {
        if (cryptoHashes.includes(algorithm) === false) {
          validSRIHashAlgorithmTokenSet.delete(algorithm);
        }
      }
    } else {
      validSRIHashAlgorithmTokenSet.clear();
    }
    var getSRIHashAlgorithmIndex = (
      /** @type {GetSRIHashAlgorithmIndex} */
      Map.prototype.get.bind(
        validSRIHashAlgorithmTokenSet
      )
    );
    var isValidSRIHashAlgorithm = (
      /** @type {IsValidSRIHashAlgorithm} */
      Map.prototype.has.bind(validSRIHashAlgorithmTokenSet)
    );
    var bytesMatch = runtimeFeatures.has("crypto") === false || validSRIHashAlgorithmTokenSet.size === 0 ? () => true : (bytes, metadataList) => {
      const parsedMetadata = parseMetadata(metadataList);
      if (parsedMetadata.length === 0) {
        return true;
      }
      const metadata = getStrongestMetadata(parsedMetadata);
      for (const item of metadata) {
        const algorithm = item.alg;
        const expectedValue = item.val;
        const actualValue = applyAlgorithmToBytes(algorithm, bytes);
        if (caseSensitiveMatch(actualValue, expectedValue)) {
          return true;
        }
      }
      return false;
    };
    function getStrongestMetadata(metadataList) {
      const result = [];
      let strongest = null;
      for (const item of metadataList) {
        assert(isValidSRIHashAlgorithm(item.alg), "Invalid SRI hash algorithm token");
        if (result.length === 0) {
          result.push(item);
          strongest = item;
          continue;
        }
        const currentAlgorithm = (
          /** @type {Metadata} */
          strongest.alg
        );
        const currentAlgorithmIndex = getSRIHashAlgorithmIndex(currentAlgorithm);
        const newAlgorithm = item.alg;
        const newAlgorithmIndex = getSRIHashAlgorithmIndex(newAlgorithm);
        if (newAlgorithmIndex < currentAlgorithmIndex) {
          continue;
        } else if (newAlgorithmIndex > currentAlgorithmIndex) {
          strongest = item;
          result[0] = item;
          result.length = 1;
        } else {
          result.push(item);
        }
      }
      return result;
    }
    __name(getStrongestMetadata, "getStrongestMetadata");
    function parseMetadata(metadata) {
      const result = [];
      for (const item of metadata.split(" ")) {
        const expressionAndOptions = item.split("?", 1);
        const algorithmExpression = expressionAndOptions[0];
        let base64Value = "";
        const algorithmAndValue = [algorithmExpression.slice(0, 6), algorithmExpression.slice(7)];
        const algorithm = algorithmAndValue[0];
        if (!isValidSRIHashAlgorithm(algorithm)) {
          continue;
        }
        if (algorithmAndValue[1]) {
          base64Value = algorithmAndValue[1];
        }
        const metadata2 = {
          alg: algorithm,
          val: base64Value
        };
        result.push(metadata2);
      }
      return result;
    }
    __name(parseMetadata, "parseMetadata");
    var applyAlgorithmToBytes = /* @__PURE__ */ __name((algorithm, bytes) => {
      return crypto.hash(algorithm, bytes, "base64");
    }, "applyAlgorithmToBytes");
    function caseSensitiveMatch(actualValue, expectedValue) {
      let actualValueLength = actualValue.length;
      if (actualValueLength !== 0 && actualValue[actualValueLength - 1] === "=") {
        actualValueLength -= 1;
      }
      if (actualValueLength !== 0 && actualValue[actualValueLength - 1] === "=") {
        actualValueLength -= 1;
      }
      let expectedValueLength = expectedValue.length;
      if (expectedValueLength !== 0 && expectedValue[expectedValueLength - 1] === "=") {
        expectedValueLength -= 1;
      }
      if (expectedValueLength !== 0 && expectedValue[expectedValueLength - 1] === "=") {
        expectedValueLength -= 1;
      }
      if (actualValueLength !== expectedValueLength) {
        return false;
      }
      for (let i = 0; i < actualValueLength; ++i) {
        if (actualValue[i] === expectedValue[i] || actualValue[i] === "+" && expectedValue[i] === "-" || actualValue[i] === "/" && expectedValue[i] === "_") {
          continue;
        }
        return false;
      }
      return true;
    }
    __name(caseSensitiveMatch, "caseSensitiveMatch");
    module2.exports = {
      applyAlgorithmToBytes,
      bytesMatch,
      caseSensitiveMatch,
      isValidSRIHashAlgorithm,
      getStrongestMetadata,
      parseMetadata
    };
  }
});

// lib/web/fetch/index.js
var require_fetch = __commonJS({
  "lib/web/fetch/index.js"(exports2, module2) {
    "use strict";
    var {
      makeNetworkError,
      makeAppropriateNetworkError,
      filterResponse,
      makeResponse,
      fromInnerResponse,
      getResponseState
    } = require_response();
    var { HeadersList } = require_headers();
    var { Request, cloneRequest, getRequestDispatcher, getRequestState } = require_request2();
    var zlib = require("node:zlib");
    var {
      makePolicyContainer,
      clonePolicyContainer,
      requestBadPort,
      TAOCheck,
      appendRequestOriginHeader,
      responseLocationURL,
      requestCurrentURL,
      setRequestReferrerPolicyOnRedirect,
      tryUpgradeRequestToAPotentiallyTrustworthyURL,
      createOpaqueTimingInfo,
      appendFetchMetadata,
      corsCheck,
      crossOriginResourcePolicyCheck,
      determineRequestsReferrer,
      coarsenedSharedCurrentTime,
      sameOrigin,
      isCancelled,
      isAborted,
      isErrorLike,
      fullyReadBody,
      readableStreamClose,
      urlIsLocal,
      urlIsHttpHttpsScheme,
      urlHasHttpsScheme,
      clampAndCoarsenConnectionTimingInfo,
      simpleRangeHeaderValue,
      buildContentRange,
      createInflate,
      extractMimeType,
      hasAuthenticationEntry,
      includesCredentials,
      isTraversableNavigable
    } = require_util2();
    var assert = require("node:assert");
    var { safelyExtractBody, extractBody } = require_body();
    var {
      redirectStatusSet,
      nullBodyStatus,
      safeMethodsSet,
      requestBodyHeader,
      subresourceSet
    } = require_constants3();
    var EE = require("node:events");
    var { Readable, pipeline, finished, isErrored, isReadable } = require("node:stream");
    var { addAbortListener, bufferToLowerCasedHeaderName } = require_util();
    var { dataURLProcessor, serializeAMimeType, minimizeSupportedMimeType } = require_data_url();
    var { getGlobalDispatcher: getGlobalDispatcher2 } = require_global2();
    var { webidl } = require_webidl();
    var { STATUS_CODES } = require("node:http");
    var { bytesMatch } = require_subresource_integrity();
    var { createDeferredPromise } = require_promise();
    var { isomorphicEncode } = require_infra();
    var { runtimeFeatures } = require_runtime_features();
    var hasZstd = runtimeFeatures.has("zstd");
    var GET_OR_HEAD = ["GET", "HEAD"];
    var defaultUserAgent = typeof __UNDICI_IS_NODE__ !== "undefined" || true ? "node" : "undici";
    var resolveObjectURL;
    var Fetch = class extends EE {
      static {
        __name(this, "Fetch");
      }
      constructor(dispatcher) {
        super();
        this.dispatcher = dispatcher;
        this.connection = null;
        this.dump = false;
        this.state = "ongoing";
      }
      terminate(reason) {
        if (this.state !== "ongoing") {
          return;
        }
        this.state = "terminated";
        this.connection?.destroy(reason);
        this.emit("terminated", reason);
      }
      // https://fetch.spec.whatwg.org/#fetch-controller-abort
      abort(error) {
        if (this.state !== "ongoing") {
          return;
        }
        this.state = "aborted";
        if (!error) {
          error = new DOMException("The operation was aborted.", "AbortError");
        }
        this.serializedAbortReason = error;
        this.connection?.destroy(error);
        this.emit("terminated", error);
      }
    };
    function handleFetchDone(response) {
      finalizeAndReportTiming(response, "fetch");
    }
    __name(handleFetchDone, "handleFetchDone");
    function fetch2(input, init = void 0) {
      webidl.argumentLengthCheck(arguments, 1, "globalThis.fetch");
      let p = createDeferredPromise();
      let requestObject;
      try {
        requestObject = new Request(input, init);
      } catch (e) {
        p.reject(e);
        return p.promise;
      }
      const request = getRequestState(requestObject);
      if (requestObject.signal.aborted) {
        abortFetch(p, request, null, requestObject.signal.reason, null);
        return p.promise;
      }
      const globalObject = request.client.globalObject;
      if (globalObject?.constructor?.name === "ServiceWorkerGlobalScope") {
        request.serviceWorkers = "none";
      }
      let responseObject = null;
      let locallyAborted = false;
      let controller = null;
      addAbortListener(
        requestObject.signal,
        () => {
          locallyAborted = true;
          assert(controller != null);
          controller.abort(requestObject.signal.reason);
          const realResponse = responseObject?.deref();
          abortFetch(p, request, realResponse, requestObject.signal.reason, controller.controller);
        }
      );
      const processResponse = /* @__PURE__ */ __name((response) => {
        if (locallyAborted) {
          return;
        }
        if (response.aborted) {
          abortFetch(p, request, responseObject, controller.serializedAbortReason, controller.controller);
          return;
        }
        if (response.type === "error") {
          p.reject(new TypeError("fetch failed", { cause: response.error }));
          return;
        }
        responseObject = new WeakRef(fromInnerResponse(response, "immutable"));
        p.resolve(responseObject.deref());
        p = null;
      }, "processResponse");
      controller = fetching({
        request,
        processResponseEndOfBody: handleFetchDone,
        processResponse,
        dispatcher: getRequestDispatcher(requestObject),
        // undici
        // Keep requestObject alive to prevent its AbortController from being GC'd
        // See https://github.com/nodejs/undici/issues/4627
        requestObject
      });
      return p.promise;
    }
    __name(fetch2, "fetch");
    function finalizeAndReportTiming(response, initiatorType = "other") {
      if (response.type === "error" && response.aborted) {
        return;
      }
      if (!response.urlList?.length) {
        return;
      }
      const originalURL = response.urlList[0];
      let timingInfo = response.timingInfo;
      let cacheState = response.cacheState;
      if (!urlIsHttpHttpsScheme(originalURL)) {
        return;
      }
      if (timingInfo === null) {
        return;
      }
      if (!response.timingAllowPassed) {
        timingInfo = createOpaqueTimingInfo({
          startTime: timingInfo.startTime
        });
        cacheState = "";
      }
      timingInfo.endTime = coarsenedSharedCurrentTime();
      response.timingInfo = timingInfo;
      markResourceTiming(
        timingInfo,
        originalURL.href,
        initiatorType,
        globalThis,
        cacheState,
        "",
        // bodyType
        response.status
      );
    }
    __name(finalizeAndReportTiming, "finalizeAndReportTiming");
    var markResourceTiming = performance.markResourceTiming;
    function abortFetch(p, request, responseObject, error, controller) {
      if (p) {
        p.reject(error);
      }
      if (request.body?.stream != null && isReadable(request.body.stream)) {
        request.body.stream.cancel(error).catch((err) => {
          if (err.code === "ERR_INVALID_STATE") {
            return;
          }
          throw err;
        });
      }
      if (responseObject == null) {
        return;
      }
      const response = getResponseState(responseObject);
      if (response.body?.stream != null && isReadable(response.body.stream)) {
        controller.error(error);
      }
    }
    __name(abortFetch, "abortFetch");
    function fetching({
      request,
      processRequestBodyChunkLength,
      processRequestEndOfBody,
      processResponse,
      processResponseEndOfBody,
      processResponseConsumeBody,
      useParallelQueue = false,
      dispatcher = getGlobalDispatcher2(),
      // undici
      requestObject = null
      // Keep alive to prevent AbortController GC, see #4627
    }) {
      assert(dispatcher);
      let taskDestination = null;
      let crossOriginIsolatedCapability = false;
      if (request.client != null) {
        taskDestination = request.client.globalObject;
        crossOriginIsolatedCapability = request.client.crossOriginIsolatedCapability;
      }
      const currentTime = coarsenedSharedCurrentTime(crossOriginIsolatedCapability);
      const timingInfo = createOpaqueTimingInfo({
        startTime: currentTime
      });
      const fetchParams = {
        controller: new Fetch(dispatcher),
        request,
        timingInfo,
        processRequestBodyChunkLength,
        processRequestEndOfBody,
        processResponse,
        processResponseConsumeBody,
        processResponseEndOfBody,
        taskDestination,
        crossOriginIsolatedCapability,
        // Keep requestObject alive to prevent its AbortController from being GC'd
        requestObject
      };
      assert(!request.body || request.body.stream);
      if (request.window === "client") {
        request.window = request.client?.globalObject?.constructor?.name === "Window" ? request.client : "no-window";
      }
      if (request.origin === "client") {
        request.origin = request.client.origin;
      }
      if (request.policyContainer === "client") {
        if (request.client != null) {
          request.policyContainer = clonePolicyContainer(
            request.client.policyContainer
          );
        } else {
          request.policyContainer = makePolicyContainer();
        }
      }
      if (!request.headersList.contains("accept", true)) {
        const value = "*/*";
        request.headersList.append("accept", value, true);
      }
      if (!request.headersList.contains("accept-language", true)) {
        request.headersList.append("accept-language", "*", true);
      }
      if (request.priority === null) {
      }
      if (subresourceSet.has(request.destination)) {
      }
      mainFetch(fetchParams, false);
      return fetchParams.controller;
    }
    __name(fetching, "fetching");
    async function mainFetch(fetchParams, recursive) {
      try {
        const request = fetchParams.request;
        let response = null;
        if (request.localURLsOnly && !urlIsLocal(requestCurrentURL(request))) {
          response = makeNetworkError("local URLs only");
        }
        tryUpgradeRequestToAPotentiallyTrustworthyURL(request);
        if (requestBadPort(request) === "blocked") {
          response = makeNetworkError("bad port");
        }
        if (request.referrerPolicy === "") {
          request.referrerPolicy = request.policyContainer.referrerPolicy;
        }
        if (request.referrer !== "no-referrer") {
          request.referrer = determineRequestsReferrer(request);
        }
        if (response === null) {
          const currentURL = requestCurrentURL(request);
          if (
            // - request?s current URL?s origin is same origin with request?s origin,
            //   and request?s response tainting is "basic"
            sameOrigin(currentURL, request.url) && request.responseTainting === "basic" || // request?s current URL?s scheme is "data"
            currentURL.protocol === "data:" || // - request?s mode is "navigate" or "websocket"
            (request.mode === "navigate" || request.mode === "websocket")
          ) {
            request.responseTainting = "basic";
            response = await schemeFetch(fetchParams);
          } else if (request.mode === "same-origin") {
            response = makeNetworkError('request mode cannot be "same-origin"');
          } else if (request.mode === "no-cors") {
            if (request.redirect !== "follow") {
              response = makeNetworkError(
                'redirect mode cannot be "follow" for "no-cors" request'
              );
            } else {
              request.responseTainting = "opaque";
              response = await schemeFetch(fetchParams);
            }
          } else if (!urlIsHttpHttpsScheme(requestCurrentURL(request))) {
            response = makeNetworkError("URL scheme must be a HTTP(S) scheme");
          } else {
            request.responseTainting = "cors";
            response = await httpFetch(fetchParams);
          }
        }
        if (recursive) {
          return response;
        }
        if (response.status !== 0 && !response.internalResponse) {
          if (request.responseTainting === "cors") {
          }
          if (request.responseTainting === "basic") {
            response = filterResponse(response, "basic");
          } else if (request.responseTainting === "cors") {
            response = filterResponse(response, "cors");
          } else if (request.responseTainting === "opaque") {
            response = filterResponse(response, "opaque");
          } else {
            assert(false);
          }
        }
        let internalResponse = response.status === 0 ? response : response.internalResponse;
        if (internalResponse.urlList.length === 0) {
          internalResponse.urlList.push(...request.urlList);
        }
        if (!request.timingAllowFailed) {
          response.timingAllowPassed = true;
        }
        if (response.type === "opaque" && internalResponse.status === 206 && internalResponse.rangeRequested && !request.headers.contains("range", true)) {
          response = internalResponse = makeNetworkError();
        }
        if (response.status !== 0 && (request.method === "HEAD" || request.method === "CONNECT" || nullBodyStatus.includes(internalResponse.status))) {
          internalResponse.body = null;
          fetchParams.controller.dump = true;
        }
        if (request.integrity) {
          const processBodyError = /* @__PURE__ */ __name((reason) => fetchFinale(fetchParams, makeNetworkError(reason)), "processBodyError");
          if (request.responseTainting === "opaque" || response.body == null) {
            processBodyError(response.error);
            return;
          }
          const processBody = /* @__PURE__ */ __name((bytes) => {
            if (!bytesMatch(bytes, request.integrity)) {
              processBodyError("integrity mismatch");
              return;
            }
            response.body = safelyExtractBody(bytes)[0];
            fetchFinale(fetchParams, response);
          }, "processBody");
          fullyReadBody(response.body, processBody, processBodyError);
        } else {
          fetchFinale(fetchParams, response);
        }
      } catch (err) {
        fetchParams.controller.terminate(err);
      }
    }
    __name(mainFetch, "mainFetch");
    function schemeFetch(fetchParams) {
      if (isCancelled(fetchParams) && fetchParams.request.redirectCount === 0) {
        return Promise.resolve(makeAppropriateNetworkError(fetchParams));
      }
      const { request } = fetchParams;
      const { protocol: scheme } = requestCurrentURL(request);
      switch (scheme) {
        case "about:": {
          return Promise.resolve(makeNetworkError("about scheme is not supported"));
        }
        case "blob:": {
          if (!resolveObjectURL) {
            resolveObjectURL = require("node:buffer").resolveObjectURL;
          }
          const blobURLEntry = requestCurrentURL(request);
          if (blobURLEntry.search.length !== 0) {
            return Promise.resolve(makeNetworkError("NetworkError when attempting to fetch resource."));
          }
          const blob = resolveObjectURL(blobURLEntry.toString());
          if (request.method !== "GET" || !webidl.is.Blob(blob)) {
            return Promise.resolve(makeNetworkError("invalid method"));
          }
          const response = makeResponse();
          const fullLength = blob.size;
          const serializedFullLength = isomorphicEncode(`${fullLength}`);
          const type = blob.type;
          if (!request.headersList.contains("range", true)) {
            const bodyWithType = extractBody(blob);
            response.statusText = "OK";
            response.body = bodyWithType[0];
            response.headersList.set("content-length", serializedFullLength, true);
            response.headersList.set("content-type", type, true);
          } else {
            response.rangeRequested = true;
            const rangeHeader = request.headersList.get("range", true);
            const rangeValue = simpleRangeHeaderValue(rangeHeader, true);
            if (rangeValue === "failure") {
              return Promise.resolve(makeNetworkError("failed to fetch the data URL"));
            }
            let { rangeStartValue: rangeStart, rangeEndValue: rangeEnd } = rangeValue;
            if (rangeStart === null) {
              rangeStart = fullLength - rangeEnd;
              rangeEnd = rangeStart + rangeEnd - 1;
            } else {
              if (rangeStart >= fullLength) {
                return Promise.resolve(makeNetworkError("Range start is greater than the blob's size."));
              }
              if (rangeEnd === null || rangeEnd >= fullLength) {
                rangeEnd = fullLength - 1;
              }
            }
            const slicedBlob = blob.slice(rangeStart, rangeEnd + 1, type);
            const slicedBodyWithType = extractBody(slicedBlob);
            response.body = slicedBodyWithType[0];
            const serializedSlicedLength = isomorphicEncode(`${slicedBlob.size}`);
            const contentRange = buildContentRange(rangeStart, rangeEnd, fullLength);
            response.status = 206;
            response.statusText = "Partial Content";
            response.headersList.set("content-length", serializedSlicedLength, true);
            response.headersList.set("content-type", type, true);
            response.headersList.set("content-range", contentRange, true);
          }
          return Promise.resolve(response);
        }
        case "data:": {
          const currentURL = requestCurrentURL(request);
          const dataURLStruct = dataURLProcessor(currentURL);
          if (dataURLStruct === "failure") {
            return Promise.resolve(makeNetworkError("failed to fetch the data URL"));
          }
          const mimeType = serializeAMimeType(dataURLStruct.mimeType);
          return Promise.resolve(makeResponse({
            statusText: "OK",
            headersList: [
              ["content-type", { name: "Content-Type", value: mimeType }]
            ],
            body: safelyExtractBody(dataURLStruct.body)[0]
          }));
        }
        case "file:": {
          return Promise.resolve(makeNetworkError("not implemented... yet..."));
        }
        case "http:":
        case "https:": {
          return httpFetch(fetchParams).catch((err) => makeNetworkError(err));
        }
        default: {
          return Promise.resolve(makeNetworkError("unknown scheme"));
        }
      }
    }
    __name(schemeFetch, "schemeFetch");
    function finalizeResponse(fetchParams, response) {
      fetchParams.request.done = true;
      if (fetchParams.processResponseDone != null) {
        queueMicrotask(() => fetchParams.processResponseDone(response));
      }
    }
    __name(finalizeResponse, "finalizeResponse");
    function fetchFinale(fetchParams, response) {
      let timingInfo = fetchParams.timingInfo;
      const processResponseEndOfBody = /* @__PURE__ */ __name(() => {
        const unsafeEndTime = Date.now();
        if (fetchParams.request.destination === "document") {
          fetchParams.controller.fullTimingInfo = timingInfo;
        }
        fetchParams.controller.reportTimingSteps = () => {
          if (!urlIsHttpHttpsScheme(fetchParams.request.url)) {
            return;
          }
          timingInfo.endTime = unsafeEndTime;
          let cacheState = response.cacheState;
          const bodyInfo = response.bodyInfo;
          if (!response.timingAllowPassed) {
            timingInfo = createOpaqueTimingInfo(timingInfo);
            cacheState = "";
          }
          let responseStatus = 0;
          if (fetchParams.request.mode !== "navigator" || !response.hasCrossOriginRedirects) {
            responseStatus = response.status;
            const mimeType = extractMimeType(response.headersList);
            if (mimeType !== "failure") {
              bodyInfo.contentType = minimizeSupportedMimeType(mimeType);
            }
          }
          if (fetchParams.request.initiatorType != null) {
            markResourceTiming(timingInfo, fetchParams.request.url.href, fetchParams.request.initiatorType, globalThis, cacheState, bodyInfo, responseStatus);
          }
        };
        const processResponseEndOfBodyTask = /* @__PURE__ */ __name(() => {
          fetchParams.request.done = true;
          if (fetchParams.processResponseEndOfBody != null) {
            queueMicrotask(() => fetchParams.processResponseEndOfBody(response));
          }
          if (fetchParams.request.initiatorType != null) {
            fetchParams.controller.reportTimingSteps();
          }
        }, "processResponseEndOfBodyTask");
        queueMicrotask(() => processResponseEndOfBodyTask());
      }, "processResponseEndOfBody");
      if (fetchParams.processResponse != null) {
        queueMicrotask(() => {
          fetchParams.processResponse(response);
          fetchParams.processResponse = null;
        });
      }
      const internalResponse = response.type === "error" ? response : response.internalResponse ?? response;
      if (internalResponse.body == null) {
        processResponseEndOfBody();
      } else {
        finished(internalResponse.body.stream, () => {
          processResponseEndOfBody();
        });
      }
    }
    __name(fetchFinale, "fetchFinale");
    async function httpFetch(fetchParams) {
      const request = fetchParams.request;
      let response = null;
      let actualResponse = null;
      const timingInfo = fetchParams.timingInfo;
      if (request.serviceWorkers === "all") {
      }
      if (response === null) {
        if (request.redirect === "follow") {
          request.serviceWorkers = "none";
        }
        actualResponse = response = await httpNetworkOrCacheFetch(fetchParams);
        if (request.responseTainting === "cors" && corsCheck(request, response) === "failure") {
          return makeNetworkError("cors failure");
        }
        if (TAOCheck(request, response) === "failure") {
          request.timingAllowFailed = true;
        }
      }
      if ((request.responseTainting === "opaque" || response.type === "opaque") && crossOriginResourcePolicyCheck(
        request.origin,
        request.client,
        request.destination,
        actualResponse
      ) === "blocked") {
        return makeNetworkError("blocked");
      }
      if (redirectStatusSet.has(actualResponse.status)) {
        if (request.redirect !== "manual") {
          fetchParams.controller.connection.destroy(void 0, false);
        }
        if (request.redirect === "error") {
          response = makeNetworkError("unexpected redirect");
        } else if (request.redirect === "manual") {
          response = actualResponse;
        } else if (request.redirect === "follow") {
          response = await httpRedirectFetch(fetchParams, response);
        } else {
          assert(false);
        }
      }
      response.timingInfo = timingInfo;
      return response;
    }
    __name(httpFetch, "httpFetch");
    function httpRedirectFetch(fetchParams, response) {
      const request = fetchParams.request;
      const actualResponse = response.internalResponse ? response.internalResponse : response;
      let locationURL;
      try {
        locationURL = responseLocationURL(
          actualResponse,
          requestCurrentURL(request).hash
        );
        if (locationURL == null) {
          return response;
        }
      } catch (err) {
        return Promise.resolve(makeNetworkError(err));
      }
      if (!urlIsHttpHttpsScheme(locationURL)) {
        return Promise.resolve(makeNetworkError("URL scheme must be a HTTP(S) scheme"));
      }
      if (request.redirectCount === 20) {
        return Promise.resolve(makeNetworkError("redirect count exceeded"));
      }
      request.redirectCount += 1;
      if (request.mode === "cors" && (locationURL.username || locationURL.password) && !sameOrigin(request, locationURL)) {
        return Promise.resolve(makeNetworkError('cross origin not allowed for request mode "cors"'));
      }
      if (request.responseTainting === "cors" && (locationURL.username || locationURL.password)) {
        return Promise.resolve(makeNetworkError(
          'URL cannot contain credentials for request mode "cors"'
        ));
      }
      if (actualResponse.status !== 303 && request.body != null && request.body.source == null) {
        return Promise.resolve(makeNetworkError());
      }
      if ([301, 302].includes(actualResponse.status) && request.method === "POST" || actualResponse.status === 303 && !GET_OR_HEAD.includes(request.method)) {
        request.method = "GET";
        request.body = null;
        for (const headerName of requestBodyHeader) {
          request.headersList.delete(headerName);
        }
      }
      if (!sameOrigin(requestCurrentURL(request), locationURL)) {
        request.headersList.delete("authorization", true);
        request.headersList.delete("proxy-authorization", true);
        request.headersList.delete("cookie", true);
        request.headersList.delete("host", true);
      }
      if (request.body != null) {
        assert(request.body.source != null);
        request.body = safelyExtractBody(request.body.source)[0];
      }
      const timingInfo = fetchParams.timingInfo;
      timingInfo.redirectEndTime = timingInfo.postRedirectStartTime = coarsenedSharedCurrentTime(fetchParams.crossOriginIsolatedCapability);
      if (timingInfo.redirectStartTime === 0) {
        timingInfo.redirectStartTime = timingInfo.startTime;
      }
      request.urlList.push(locationURL);
      setRequestReferrerPolicyOnRedirect(request, actualResponse);
      return mainFetch(fetchParams, true);
    }
    __name(httpRedirectFetch, "httpRedirectFetch");
    async function httpNetworkOrCacheFetch(fetchParams, isAuthenticationFetch = false, isNewConnectionFetch = false) {
      const request = fetchParams.request;
      let httpFetchParams = null;
      let httpRequest = null;
      let response = null;
      const httpCache = null;
      const revalidatingFlag = false;
      if (request.window === "no-window" && request.redirect === "error") {
        httpFetchParams = fetchParams;
        httpRequest = request;
      } else {
        httpRequest = cloneRequest(request);
        httpFetchParams = { ...fetchParams };
        httpFetchParams.request = httpRequest;
      }
      const includeCredentials = request.credentials === "include" || request.credentials === "same-origin" && request.responseTainting === "basic";
      const contentLength = httpRequest.body ? httpRequest.body.length : null;
      let contentLengthHeaderValue = null;
      if (httpRequest.body == null && ["POST", "PUT"].includes(httpRequest.method)) {
        contentLengthHeaderValue = "0";
      }
      if (contentLength != null) {
        contentLengthHeaderValue = isomorphicEncode(`${contentLength}`);
      }
      if (contentLengthHeaderValue != null) {
        httpRequest.headersList.append("content-length", contentLengthHeaderValue, true);
      }
      if (contentLength != null && httpRequest.keepalive) {
      }
      if (webidl.is.URL(httpRequest.referrer)) {
        httpRequest.headersList.append("referer", isomorphicEncode(httpRequest.referrer.href), true);
      }
      appendRequestOriginHeader(httpRequest);
      appendFetchMetadata(httpRequest);
      if (!httpRequest.headersList.contains("user-agent", true)) {
        httpRequest.headersList.append("user-agent", defaultUserAgent, true);
      }
      if (httpRequest.cache === "default" && (httpRequest.headersList.contains("if-modified-since", true) || httpRequest.headersList.contains("if-none-match", true) || httpRequest.headersList.contains("if-unmodified-since", true) || httpRequest.headersList.contains("if-match", true) || httpRequest.headersList.contains("if-range", true))) {
        httpRequest.cache = "no-store";
      }
      if (httpRequest.cache === "no-cache" && !httpRequest.preventNoCacheCacheControlHeaderModification && !httpRequest.headersList.contains("cache-control", true)) {
        httpRequest.headersList.append("cache-control", "max-age=0", true);
      }
      if (httpRequest.cache === "no-store" || httpRequest.cache === "reload") {
        if (!httpRequest.headersList.contains("pragma", true)) {
          httpRequest.headersList.append("pragma", "no-cache", true);
        }
        if (!httpRequest.headersList.contains("cache-control", true)) {
          httpRequest.headersList.append("cache-control", "no-cache", true);
        }
      }
      if (httpRequest.headersList.contains("range", true)) {
        httpRequest.headersList.append("accept-encoding", "identity", true);
      }
      if (!httpRequest.headersList.contains("accept-encoding", true)) {
        if (urlHasHttpsScheme(requestCurrentURL(httpRequest))) {
          httpRequest.headersList.append("accept-encoding", "br, gzip, deflate", true);
        } else {
          httpRequest.headersList.append("accept-encoding", "gzip, deflate", true);
        }
      }
      httpRequest.headersList.delete("host", true);
      if (includeCredentials) {
        if (!httpRequest.headersList.contains("authorization", true)) {
          let authorizationValue = null;
          if (hasAuthenticationEntry(httpRequest) && (httpRequest.useURLCredentials === void 0 || !includesCredentials(requestCurrentURL(httpRequest)))) {
          } else if (includesCredentials(requestCurrentURL(httpRequest)) && isAuthenticationFetch) {
            const { username, password } = requestCurrentURL(httpRequest);
            authorizationValue = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
          }
          if (authorizationValue !== null) {
            httpRequest.headersList.append("Authorization", authorizationValue, false);
          }
        }
      }
      if (httpCache == null) {
        httpRequest.cache = "no-store";
      }
      if (httpRequest.cache !== "no-store" && httpRequest.cache !== "reload") {
      }
      if (response == null) {
        if (httpRequest.cache === "only-if-cached") {
          return makeNetworkError("only if cached");
        }
        const forwardResponse = await httpNetworkFetch(
          httpFetchParams,
          includeCredentials,
          isNewConnectionFetch
        );
        if (!safeMethodsSet.has(httpRequest.method) && forwardResponse.status >= 200 && forwardResponse.status <= 399) {
        }
        if (revalidatingFlag && forwardResponse.status === 304) {
        }
        if (response == null) {
          response = forwardResponse;
        }
      }
      response.urlList = [...httpRequest.urlList];
      if (httpRequest.headersList.contains("range", true)) {
        response.rangeRequested = true;
      }
      response.requestIncludesCredentials = includeCredentials;
      if (response.status === 401 && httpRequest.responseTainting !== "cors" && includeCredentials && (request.useURLCredentials !== void 0 || isTraversableNavigable(request.traversableForUserPrompts))) {
        if (request.body != null) {
          if (request.body.source == null) {
            return response;
          }
          request.body = safelyExtractBody(request.body.source)[0];
        }
        if (request.useURLCredentials === void 0 || isAuthenticationFetch) {
          if (isCancelled(fetchParams)) {
            return makeAppropriateNetworkError(fetchParams);
          }
          return response;
        }
        fetchParams.controller.connection.destroy();
        response = await httpNetworkOrCacheFetch(fetchParams, true);
      }
      if (response.status === 407) {
        if (request.window === "no-window") {
          return makeNetworkError();
        }
        if (isCancelled(fetchParams)) {
          return makeAppropriateNetworkError(fetchParams);
        }
        return makeNetworkError("proxy authentication required");
      }
      if (
        // response?s status is 421
        response.status === 421 && // isNewConnectionFetch is false
        !isNewConnectionFetch && // request?s body is null, or request?s body is non-null and request?s body?s source is non-null
        (request.body == null || request.body.source != null)
      ) {
        if (isCancelled(fetchParams)) {
          return makeAppropriateNetworkError(fetchParams);
        }
        fetchParams.controller.connection.destroy();
        response = await httpNetworkOrCacheFetch(
          fetchParams,
          isAuthenticationFetch,
          true
        );
      }
      if (isAuthenticationFetch) {
      }
      return response;
    }
    __name(httpNetworkOrCacheFetch, "httpNetworkOrCacheFetch");
    async function httpNetworkFetch(fetchParams, includeCredentials = false, forceNewConnection = false) {
      assert(!fetchParams.controller.connection || fetchParams.controller.connection.destroyed);
      fetchParams.controller.connection = {
        abort: null,
        destroyed: false,
        destroy(err, abort = true) {
          if (!this.destroyed) {
            this.destroyed = true;
            if (abort) {
              this.abort?.(err ?? new DOMException("The operation was aborted.", "AbortError"));
            }
          }
        }
      };
      const request = fetchParams.request;
      let response = null;
      const timingInfo = fetchParams.timingInfo;
      const httpCache = null;
      if (httpCache == null) {
        request.cache = "no-store";
      }
      const newConnection = forceNewConnection ? "yes" : "no";
      if (request.mode === "websocket") {
      } else {
      }
      let requestBody = null;
      if (request.body == null && fetchParams.processRequestEndOfBody) {
        queueMicrotask(() => fetchParams.processRequestEndOfBody());
      } else if (request.body != null) {
        const processBodyChunk = /* @__PURE__ */ __name(async function* (bytes) {
          if (isCancelled(fetchParams)) {
            return;
          }
          yield bytes;
          fetchParams.processRequestBodyChunkLength?.(bytes.byteLength);
        }, "processBodyChunk");
        const processEndOfBody = /* @__PURE__ */ __name(() => {
          if (isCancelled(fetchParams)) {
            return;
          }
          if (fetchParams.processRequestEndOfBody) {
            fetchParams.processRequestEndOfBody();
          }
        }, "processEndOfBody");
        const processBodyError = /* @__PURE__ */ __name((e) => {
          if (isCancelled(fetchParams)) {
            return;
          }
          if (e.name === "AbortError") {
            fetchParams.controller.abort();
          } else {
            fetchParams.controller.terminate(e);
          }
        }, "processBodyError");
        requestBody = (async function* () {
          try {
            for await (const bytes of request.body.stream) {
              yield* processBodyChunk(bytes);
            }
            processEndOfBody();
          } catch (err) {
            processBodyError(err);
          }
        })();
      }
      try {
        const { body, status, statusText, headersList, socket } = await dispatch({ body: requestBody });
        if (socket) {
          response = makeResponse({ status, statusText, headersList, socket });
        } else {
          const iterator = body[Symbol.asyncIterator]();
          fetchParams.controller.next = () => iterator.next();
          response = makeResponse({ status, statusText, headersList });
        }
      } catch (err) {
        if (err.name === "AbortError") {
          fetchParams.controller.connection.destroy();
          return makeAppropriateNetworkError(fetchParams, err);
        }
        return makeNetworkError(err);
      }
      const pullAlgorithm = /* @__PURE__ */ __name(() => {
        return fetchParams.controller.resume();
      }, "pullAlgorithm");
      const cancelAlgorithm = /* @__PURE__ */ __name((reason) => {
        if (!isCancelled(fetchParams)) {
          fetchParams.controller.abort(reason);
        }
      }, "cancelAlgorithm");
      const stream = new ReadableStream(
        {
          start(controller) {
            fetchParams.controller.controller = controller;
          },
          pull: pullAlgorithm,
          cancel: cancelAlgorithm,
          type: "bytes"
        }
      );
      response.body = { stream, source: null, length: null };
      if (!fetchParams.controller.resume) {
        fetchParams.controller.on("terminated", onAborted);
      }
      fetchParams.controller.resume = async () => {
        while (true) {
          let bytes;
          let isFailure;
          try {
            const { done, value } = await fetchParams.controller.next();
            if (isAborted(fetchParams)) {
              break;
            }
            bytes = done ? void 0 : value;
          } catch (err) {
            if (fetchParams.controller.ended && !timingInfo.encodedBodySize) {
              bytes = void 0;
            } else {
              bytes = err;
              isFailure = true;
            }
          }
          if (bytes === void 0) {
            readableStreamClose(fetchParams.controller.controller);
            finalizeResponse(fetchParams, response);
            return;
          }
          timingInfo.decodedBodySize += bytes?.byteLength ?? 0;
          if (isFailure) {
            fetchParams.controller.terminate(bytes);
            return;
          }
          const buffer = new Uint8Array(bytes);
          if (buffer.byteLength) {
            fetchParams.controller.controller.enqueue(buffer);
          }
          if (isErrored(stream)) {
            fetchParams.controller.terminate();
            return;
          }
          if (fetchParams.controller.controller.desiredSize <= 0) {
            return;
          }
        }
      };
      function onAborted(reason) {
        if (isAborted(fetchParams)) {
          response.aborted = true;
          if (isReadable(stream)) {
            fetchParams.controller.controller.error(
              fetchParams.controller.serializedAbortReason
            );
          }
        } else {
          if (isReadable(stream)) {
            fetchParams.controller.controller.error(new TypeError("terminated", {
              cause: isErrorLike(reason) ? reason : void 0
            }));
          }
        }
        fetchParams.controller.connection.destroy();
      }
      __name(onAborted, "onAborted");
      return response;
      function dispatch({ body }) {
        const url = requestCurrentURL(request);
        const agent = fetchParams.controller.dispatcher;
        const path = url.pathname + url.search;
        const hasTrailingQuestionMark = url.search.length === 0 && url.href[url.href.length - url.hash.length - 1] === "?";
        return new Promise((resolve, reject) => agent.dispatch(
          {
            path: hasTrailingQuestionMark ? `${path}?` : path,
            origin: url.origin,
            method: request.method,
            body: agent.isMockActive ? request.body && (request.body.source || request.body.stream) : body,
            headers: request.headersList.entries,
            maxRedirections: 0,
            upgrade: request.mode === "websocket" ? "websocket" : void 0
          },
          {
            body: null,
            abort: null,
            onConnect(abort) {
              const { connection } = fetchParams.controller;
              timingInfo.finalConnectionTimingInfo = clampAndCoarsenConnectionTimingInfo(void 0, timingInfo.postRedirectStartTime, fetchParams.crossOriginIsolatedCapability);
              if (connection.destroyed) {
                abort(new DOMException("The operation was aborted.", "AbortError"));
              } else {
                fetchParams.controller.on("terminated", abort);
                this.abort = connection.abort = abort;
              }
              timingInfo.finalNetworkRequestStartTime = coarsenedSharedCurrentTime(fetchParams.crossOriginIsolatedCapability);
            },
            onResponseStarted() {
              timingInfo.finalNetworkResponseStartTime = coarsenedSharedCurrentTime(fetchParams.crossOriginIsolatedCapability);
            },
            onHeaders(status, rawHeaders, resume, statusText) {
              if (status < 200) {
                return false;
              }
              const headersList = new HeadersList();
              for (let i = 0; i < rawHeaders.length; i += 2) {
                const nameStr = bufferToLowerCasedHeaderName(rawHeaders[i]);
                const value = rawHeaders[i + 1];
                if (Array.isArray(value) && !Buffer.isBuffer(rawHeaders[i + 1])) {
                  for (const val of value) {
                    headersList.append(nameStr, val.toString("latin1"), true);
                  }
                } else {
                  headersList.append(nameStr, value.toString("latin1"), true);
                }
              }
              const location = headersList.get("location", true);
              this.body = new Readable({ read: resume });
              const willFollow = location && request.redirect === "follow" && redirectStatusSet.has(status);
              const decoders = [];
              if (request.method !== "HEAD" && request.method !== "CONNECT" && !nullBodyStatus.includes(status) && !willFollow) {
                const contentEncoding = headersList.get("content-encoding", true);
                const codings = contentEncoding ? contentEncoding.toLowerCase().split(",") : [];
                const maxContentEncodings = 5;
                if (codings.length > maxContentEncodings) {
                  reject(new Error(`too many content-encodings in response: ${codings.length}, maximum allowed is ${maxContentEncodings}`));
                  return true;
                }
                for (let i = codings.length - 1; i >= 0; --i) {
                  const coding = codings[i].trim();
                  if (coding === "x-gzip" || coding === "gzip") {
                    decoders.push(zlib.createGunzip({
                      // Be less strict when decoding compressed responses, since sometimes
                      // servers send slightly invalid responses that are still accepted
                      // by common browsers.
                      // Always using Z_SYNC_FLUSH is what cURL does.
                      flush: zlib.constants.Z_SYNC_FLUSH,
                      finishFlush: zlib.constants.Z_SYNC_FLUSH
                    }));
                  } else if (coding === "deflate") {
                    decoders.push(createInflate({
                      flush: zlib.constants.Z_SYNC_FLUSH,
                      finishFlush: zlib.constants.Z_SYNC_FLUSH
                    }));
                  } else if (coding === "br") {
                    decoders.push(zlib.createBrotliDecompress({
                      flush: zlib.constants.BROTLI_OPERATION_FLUSH,
                      finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH
                    }));
                  } else if (coding === "zstd" && hasZstd) {
                    decoders.push(zlib.createZstdDecompress({
                      flush: zlib.constants.ZSTD_e_continue,
                      finishFlush: zlib.constants.ZSTD_e_end
                    }));
                  } else {
                    decoders.length = 0;
                    break;
                  }
                }
              }
              const onError = this.onError.bind(this);
              resolve({
                status,
                statusText,
                headersList,
                body: decoders.length ? pipeline(this.body, ...decoders, (err) => {
                  if (err) {
                    this.onError(err);
                  }
                }).on("error", onError) : this.body.on("error", onError)
              });
              return true;
            },
            onData(chunk) {
              if (fetchParams.controller.dump) {
                return;
              }
              const bytes = chunk;
              timingInfo.encodedBodySize += bytes.byteLength;
              return this.body.push(bytes);
            },
            onComplete() {
              if (this.abort) {
                fetchParams.controller.off("terminated", this.abort);
              }
              fetchParams.controller.ended = true;
              this.body.push(null);
            },
            onError(error) {
              if (this.abort) {
                fetchParams.controller.off("terminated", this.abort);
              }
              this.body?.destroy(error);
              fetchParams.controller.terminate(error);
              reject(error);
            },
            onRequestUpgrade(_controller, status, headers, socket) {
              if (socket.session != null && status !== 200 || socket.session == null && status !== 101) {
                return false;
              }
              const headersList = new HeadersList();
              for (const [name, value] of Object.entries(headers)) {
                if (value == null) {
                  continue;
                }
                const headerName = name.toLowerCase();
                if (Array.isArray(value)) {
                  for (const entry of value) {
                    headersList.append(headerName, String(entry), true);
                  }
                } else {
                  headersList.append(headerName, String(value), true);
                }
              }
              resolve({
                status,
                statusText: STATUS_CODES[status],
                headersList,
                socket
              });
              return true;
            },
            onUpgrade(status, rawHeaders, socket) {
              if (socket.session != null && status !== 200 || socket.session == null && status !== 101) {
                return false;
              }
              const headersList = new HeadersList();
              for (let i = 0; i < rawHeaders.length; i += 2) {
                const nameStr = bufferToLowerCasedHeaderName(rawHeaders[i]);
                const value = rawHeaders[i + 1];
                if (Array.isArray(value) && !Buffer.isBuffer(rawHeaders[i + 1])) {
                  for (const val of value) {
                    headersList.append(nameStr, val.toString("latin1"), true);
                  }
                } else {
                  headersList.append(nameStr, value.toString("latin1"), true);
                }
              }
              resolve({
                status,
                statusText: STATUS_CODES[status],
                headersList,
                socket
              });
              return true;
            }
          }
        ));
      }
      __name(dispatch, "dispatch");
    }
    __name(httpNetworkFetch, "httpNetworkFetch");
    module2.exports = {
      fetch: fetch2,
      Fetch,
      fetching,
      finalizeAndReportTiming
    };
  }
});

// lib/web/websocket/events.js
var require_events = __commonJS({
  "lib/web/websocket/events.js"(exports2, module2) {
    "use strict";
    var { webidl } = require_webidl();
    var { kEnumerableProperty } = require_util();
    var { kConstruct } = require_symbols();
    var MessageEvent2 = class _MessageEvent extends Event {
      static {
        __name(this, "MessageEvent");
      }
      #eventInit;
      constructor(type, eventInitDict = {}) {
        if (type === kConstruct) {
          super(arguments[1], arguments[2]);
          webidl.util.markAsUncloneable(this);
          return;
        }
        const prefix = "MessageEvent constructor";
        webidl.argumentLengthCheck(arguments, 1, prefix);
        type = webidl.converters.DOMString(type, prefix, "type");
        eventInitDict = webidl.converters.MessageEventInit(eventInitDict, prefix, "eventInitDict");
        super(type, eventInitDict);
        this.#eventInit = eventInitDict;
        webidl.util.markAsUncloneable(this);
      }
      get data() {
        webidl.brandCheck(this, _MessageEvent);
        return this.#eventInit.data;
      }
      get origin() {
        webidl.brandCheck(this, _MessageEvent);
        return this.#eventInit.origin;
      }
      get lastEventId() {
        webidl.brandCheck(this, _MessageEvent);
        return this.#eventInit.lastEventId;
      }
      get source() {
        webidl.brandCheck(this, _MessageEvent);
        return this.#eventInit.source;
      }
      get ports() {
        webidl.brandCheck(this, _MessageEvent);
        if (!Object.isFrozen(this.#eventInit.ports)) {
          Object.freeze(this.#eventInit.ports);
        }
        return this.#eventInit.ports;
      }
      initMessageEvent(type, bubbles = false, cancelable = false, data = null, origin = "", lastEventId = "", source = null, ports = []) {
        webidl.brandCheck(this, _MessageEvent);
        webidl.argumentLengthCheck(arguments, 1, "MessageEvent.initMessageEvent");
        return new _MessageEvent(type, {
          bubbles,
          cancelable,
          data,
          origin,
          lastEventId,
          source,
          ports
        });
      }
      static createFastMessageEvent(type, init) {
        const messageEvent = new _MessageEvent(kConstruct, type, init);
        messageEvent.#eventInit = init;
        messageEvent.#eventInit.data ??= null;
        messageEvent.#eventInit.origin ??= "";
        messageEvent.#eventInit.lastEventId ??= "";
        messageEvent.#eventInit.source ??= null;
        messageEvent.#eventInit.ports ??= [];
        return messageEvent;
      }
    };
    var { createFastMessageEvent: createFastMessageEvent2 } = MessageEvent2;
    delete MessageEvent2.createFastMessageEvent;
    var CloseEvent2 = class _CloseEvent extends Event {
      static {
        __name(this, "CloseEvent");
      }
      #eventInit;
      constructor(type, eventInitDict = {}) {
        const prefix = "CloseEvent constructor";
        webidl.argumentLengthCheck(arguments, 1, prefix);
        type = webidl.converters.DOMString(type, prefix, "type");
        eventInitDict = webidl.converters.CloseEventInit(eventInitDict);
        super(type, eventInitDict);
        this.#eventInit = eventInitDict;
        webidl.util.markAsUncloneable(this);
      }
      get wasClean() {
        webidl.brandCheck(this, _CloseEvent);
        return this.#eventInit.wasClean;
      }
      get code() {
        webidl.brandCheck(this, _CloseEvent);
        return this.#eventInit.code;
      }
      get reason() {
        webidl.brandCheck(this, _CloseEvent);
        return this.#eventInit.reason;
      }
    };
    var ErrorEvent2 = class _ErrorEvent extends Event {
      static {
        __name(this, "ErrorEvent");
      }
      #eventInit;
      constructor(type, eventInitDict) {
        const prefix = "ErrorEvent constructor";
        webidl.argumentLengthCheck(arguments, 1, prefix);
        super(type, eventInitDict);
        webidl.util.markAsUncloneable(this);
        type = webidl.converters.DOMString(type, prefix, "type");
        eventInitDict = webidl.converters.ErrorEventInit(eventInitDict ?? {});
        this.#eventInit = eventInitDict;
      }
      get message() {
        webidl.brandCheck(this, _ErrorEvent);
        return this.#eventInit.message;
      }
      get filename() {
        webidl.brandCheck(this, _ErrorEvent);
        return this.#eventInit.filename;
      }
      get lineno() {
        webidl.brandCheck(this, _ErrorEvent);
        return this.#eventInit.lineno;
      }
      get colno() {
        webidl.brandCheck(this, _ErrorEvent);
        return this.#eventInit.colno;
      }
      get error() {
        webidl.brandCheck(this, _ErrorEvent);
        return this.#eventInit.error;
      }
    };
    Object.defineProperties(MessageEvent2.prototype, {
      [Symbol.toStringTag]: {
        value: "MessageEvent",
        configurable: true
      },
      data: kEnumerableProperty,
      origin: kEnumerableProperty,
      lastEventId: kEnumerableProperty,
      source: kEnumerableProperty,
      ports: kEnumerableProperty,
      initMessageEvent: kEnumerableProperty
    });
    Object.defineProperties(CloseEvent2.prototype, {
      [Symbol.toStringTag]: {
        value: "CloseEvent",
        configurable: true
      },
      reason: kEnumerableProperty,
      code: kEnumerableProperty,
      wasClean: kEnumerableProperty
    });
    Object.defineProperties(ErrorEvent2.prototype, {
      [Symbol.toStringTag]: {
        value: "ErrorEvent",
        configurable: true
      },
      message: kEnumerableProperty,
      filename: kEnumerableProperty,
      lineno: kEnumerableProperty,
      colno: kEnumerableProperty,
      error: kEnumerableProperty
    });
    webidl.converters.MessagePort = webidl.interfaceConverter(
      webidl.is.MessagePort,
      "MessagePort"
    );
    webidl.converters["sequence<MessagePort>"] = webidl.sequenceConverter(
      webidl.converters.MessagePort
    );
    var eventInit = [
      {
        key: "bubbles",
        converter: webidl.converters.boolean,
        defaultValue: /* @__PURE__ */ __name(() => false, "defaultValue")
      },
      {
        key: "cancelable",
        converter: webidl.converters.boolean,
        defaultValue: /* @__PURE__ */ __name(() => false, "defaultValue")
      },
      {
        key: "composed",
        converter: webidl.converters.boolean,
        defaultValue: /* @__PURE__ */ __name(() => false, "defaultValue")
      }
    ];
    webidl.converters.MessageEventInit = webidl.dictionaryConverter([
      ...eventInit,
      {
        key: "data",
        converter: webidl.converters.any,
        defaultValue: /* @__PURE__ */ __name(() => null, "defaultValue")
      },
      {
        key: "origin",
        converter: webidl.converters.USVString,
        defaultValue: /* @__PURE__ */ __name(() => "", "defaultValue")
      },
      {
        key: "lastEventId",
        converter: webidl.converters.DOMString,
        defaultValue: /* @__PURE__ */ __name(() => "", "defaultValue")
      },
      {
        key: "source",
        // Node doesn't implement WindowProxy or ServiceWorker, so the only
        // valid value for source is a MessagePort.
        converter: webidl.nullableConverter(webidl.converters.MessagePort),
        defaultValue: /* @__PURE__ */ __name(() => null, "defaultValue")
      },
      {
        key: "ports",
        converter: webidl.converters["sequence<MessagePort>"],
        defaultValue: /* @__PURE__ */ __name(() => [], "defaultValue")
      }
    ]);
    webidl.converters.CloseEventInit = webidl.dictionaryConverter([
      ...eventInit,
      {
        key: "wasClean",
        converter: webidl.converters.boolean,
        defaultValue: /* @__PURE__ */ __name(() => false, "defaultValue")
      },
      {
        key: "code",
        converter: webidl.converters["unsigned short"],
        defaultValue: /* @__PURE__ */ __name(() => 0, "defaultValue")
      },
      {
        key: "reason",
        converter: webidl.converters.USVString,
        defaultValue: /* @__PURE__ */ __name(() => "", "defaultValue")
      }
    ]);
    webidl.converters.ErrorEventInit = webidl.dictionaryConverter([
      ...eventInit,
      {
        key: "message",
        converter: webidl.converters.DOMString,
        defaultValue: /* @__PURE__ */ __name(() => "", "defaultValue")
      },
      {
        key: "filename",
        converter: webidl.converters.USVString,
        defaultValue: /* @__PURE__ */ __name(() => "", "defaultValue")
      },
      {
        key: "lineno",
        converter: webidl.converters["unsigned long"],
        defaultValue: /* @__PURE__ */ __name(() => 0, "defaultValue")
      },
      {
        key: "colno",
        converter: webidl.converters["unsigned long"],
        defaultValue: /* @__PURE__ */ __name(() => 0, "defaultValue")
      },
      {
        key: "error",
        converter: webidl.converters.any
      }
    ]);
    module2.exports = {
      MessageEvent: MessageEvent2,
      CloseEvent: CloseEvent2,
      ErrorEvent: ErrorEvent2,
      createFastMessageEvent: createFastMessageEvent2
    };
  }
});

// lib/web/websocket/constants.js
var require_constants4 = __commonJS({
  "lib/web/websocket/constants.js"(exports2, module2) {
    "use strict";
    var uid = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    var staticPropertyDescriptors = {
      enumerable: true,
      writable: false,
      configurable: false
    };
    var states = {
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3
    };
    var sentCloseFrameState = {
      SENT: 1,
      RECEIVED: 2
    };
    var opcodes = {
      CONTINUATION: 0,
      TEXT: 1,
      BINARY: 2,
      CLOSE: 8,
      PING: 9,
      PONG: 10
    };
    var maxUnsigned16Bit = 65535;
    var parserStates = {
      INFO: 0,
      PAYLOADLENGTH_16: 2,
      PAYLOADLENGTH_64: 3,
      READ_DATA: 4
    };
    var emptyBuffer = Buffer.allocUnsafe(0);
    var sendHints = {
      text: 1,
      typedArray: 2,
      arrayBuffer: 3,
      blob: 4
    };
    module2.exports = {
      uid,
      sentCloseFrameState,
      staticPropertyDescriptors,
      states,
      opcodes,
      maxUnsigned16Bit,
      parserStates,
      emptyBuffer,
      sendHints
    };
  }
});

// lib/web/websocket/util.js
var require_util3 = __commonJS({
  "lib/web/websocket/util.js"(exports2, module2) {
    "use strict";
    var { states, opcodes } = require_constants4();
    var { isUtf8 } = require("node:buffer");
    var { removeHTTPWhitespace } = require_data_url();
    var { collectASequenceOfCodePointsFast } = require_infra();
    function isConnecting(readyState) {
      return readyState === states.CONNECTING;
    }
    __name(isConnecting, "isConnecting");
    function isEstablished(readyState) {
      return readyState === states.OPEN;
    }
    __name(isEstablished, "isEstablished");
    function isClosing(readyState) {
      return readyState === states.CLOSING;
    }
    __name(isClosing, "isClosing");
    function isClosed(readyState) {
      return readyState === states.CLOSED;
    }
    __name(isClosed, "isClosed");
    function fireEvent(e, target, eventFactory = (type, init) => new Event(type, init), eventInitDict = {}) {
      const event = eventFactory(e, eventInitDict);
      target.dispatchEvent(event);
    }
    __name(fireEvent, "fireEvent");
    function websocketMessageReceived(handler, type, data) {
      handler.onMessage(type, data);
    }
    __name(websocketMessageReceived, "websocketMessageReceived");
    function toArrayBuffer(buffer) {
      if (buffer.byteLength === buffer.buffer.byteLength) {
        return buffer.buffer;
      }
      return new Uint8Array(buffer).buffer;
    }
    __name(toArrayBuffer, "toArrayBuffer");
    function isValidSubprotocol(protocol) {
      if (protocol.length === 0) {
        return false;
      }
      for (let i = 0; i < protocol.length; ++i) {
        const code = protocol.charCodeAt(i);
        if (code < 33 || // CTL, contains SP (0x20) and HT (0x09)
        code > 126 || code === 34 || // "
        code === 40 || // (
        code === 41 || // )
        code === 44 || // ,
        code === 47 || // /
        code === 58 || // :
        code === 59 || // ;
        code === 60 || // <
        code === 61 || // =
        code === 62 || // >
        code === 63 || // ?
        code === 64 || // @
        code === 91 || // [
        code === 92 || // \
        code === 93 || // ]
        code === 123 || // {
        code === 125) {
          return false;
        }
      }
      return true;
    }
    __name(isValidSubprotocol, "isValidSubprotocol");
    function isValidStatusCode(code) {
      if (code >= 1e3 && code < 1015) {
        return code !== 1004 && // reserved
        code !== 1005 && // "MUST NOT be set as a status code"
        code !== 1006;
      }
      return code >= 3e3 && code <= 4999;
    }
    __name(isValidStatusCode, "isValidStatusCode");
    function isControlFrame(opcode) {
      return opcode === opcodes.CLOSE || opcode === opcodes.PING || opcode === opcodes.PONG;
    }
    __name(isControlFrame, "isControlFrame");
    function isContinuationFrame(opcode) {
      return opcode === opcodes.CONTINUATION;
    }
    __name(isContinuationFrame, "isContinuationFrame");
    function isTextBinaryFrame(opcode) {
      return opcode === opcodes.TEXT || opcode === opcodes.BINARY;
    }
    __name(isTextBinaryFrame, "isTextBinaryFrame");
    function isValidOpcode(opcode) {
      return isTextBinaryFrame(opcode) || isContinuationFrame(opcode) || isControlFrame(opcode);
    }
    __name(isValidOpcode, "isValidOpcode");
    function parseExtensions(extensions) {
      const position = { position: 0 };
      const extensionList = /* @__PURE__ */ new Map();
      while (position.position < extensions.length) {
        const pair = collectASequenceOfCodePointsFast(";", extensions, position);
        const [name, value = ""] = pair.split("=", 2);
        extensionList.set(
          removeHTTPWhitespace(name, true, false),
          removeHTTPWhitespace(value, false, true)
        );
        position.position++;
      }
      return extensionList;
    }
    __name(parseExtensions, "parseExtensions");
    function isValidClientWindowBits(value) {
      if (value.length === 0) {
        return false;
      }
      for (let i = 0; i < value.length; i++) {
        const byte = value.charCodeAt(i);
        if (byte < 48 || byte > 57) {
          return false;
        }
      }
      const num = Number.parseInt(value, 10);
      return num >= 8 && num <= 15;
    }
    __name(isValidClientWindowBits, "isValidClientWindowBits");
    function getURLRecord(url, baseURL) {
      let urlRecord;
      try {
        urlRecord = new URL(url, baseURL);
      } catch (e) {
        throw new DOMException(e, "SyntaxError");
      }
      if (urlRecord.protocol === "http:") {
        urlRecord.protocol = "ws:";
      } else if (urlRecord.protocol === "https:") {
        urlRecord.protocol = "wss:";
      }
      if (urlRecord.protocol !== "ws:" && urlRecord.protocol !== "wss:") {
        throw new DOMException("expected a ws: or wss: url", "SyntaxError");
      }
      if (urlRecord.hash.length || urlRecord.href.endsWith("#")) {
        throw new DOMException("hash", "SyntaxError");
      }
      return urlRecord;
    }
    __name(getURLRecord, "getURLRecord");
    function validateCloseCodeAndReason(code, reason) {
      if (code !== null) {
        if (code !== 1e3 && (code < 3e3 || code > 4999)) {
          throw new DOMException("invalid code", "InvalidAccessError");
        }
      }
      if (reason !== null) {
        const reasonBytesLength = Buffer.byteLength(reason);
        if (reasonBytesLength > 123) {
          throw new DOMException(`Reason must be less than 123 bytes; received ${reasonBytesLength}`, "SyntaxError");
        }
      }
    }
    __name(validateCloseCodeAndReason, "validateCloseCodeAndReason");
    var utf8Decode = (() => {
      if (typeof process.versions.icu === "string") {
        const fatalDecoder = new TextDecoder("utf-8", { fatal: true });
        return fatalDecoder.decode.bind(fatalDecoder);
      }
      return function(buffer) {
        if (isUtf8(buffer)) {
          return buffer.toString("utf-8");
        }
        throw new TypeError("Invalid utf-8 received.");
      };
    })();
    module2.exports = {
      isConnecting,
      isEstablished,
      isClosing,
      isClosed,
      fireEvent,
      isValidSubprotocol,
      isValidStatusCode,
      websocketMessageReceived,
      utf8Decode,
      isControlFrame,
      isContinuationFrame,
      isTextBinaryFrame,
      isValidOpcode,
      parseExtensions,
      isValidClientWindowBits,
      toArrayBuffer,
      getURLRecord,
      validateCloseCodeAndReason
    };
  }
});

// lib/web/websocket/frame.js
var require_frame = __commonJS({
  "lib/web/websocket/frame.js"(exports2, module2) {
    "use strict";
    var { runtimeFeatures } = require_runtime_features();
    var { maxUnsigned16Bit, opcodes } = require_constants4();
    var BUFFER_SIZE = 8 * 1024;
    var buffer = null;
    var bufIdx = BUFFER_SIZE;
    var randomFillSync = runtimeFeatures.has("crypto") ? require("node:crypto").randomFillSync : /* @__PURE__ */ __name(function randomFillSync2(buffer2, _offset, _size) {
      for (let i = 0; i < buffer2.length; ++i) {
        buffer2[i] = Math.random() * 255 | 0;
      }
      return buffer2;
    }, "randomFillSync");
    function generateMask() {
      if (bufIdx === BUFFER_SIZE) {
        bufIdx = 0;
        randomFillSync(buffer ??= Buffer.allocUnsafeSlow(BUFFER_SIZE), 0, BUFFER_SIZE);
      }
      return [buffer[bufIdx++], buffer[bufIdx++], buffer[bufIdx++], buffer[bufIdx++]];
    }
    __name(generateMask, "generateMask");
    var WebsocketFrameSend = class {
      static {
        __name(this, "WebsocketFrameSend");
      }
      /**
       * @param {Buffer|undefined} data
       */
      constructor(data) {
        this.frameData = data;
      }
      createFrame(opcode) {
        const frameData = this.frameData;
        const maskKey = generateMask();
        const bodyLength = frameData?.byteLength ?? 0;
        let payloadLength = bodyLength;
        let offset = 6;
        if (bodyLength > maxUnsigned16Bit) {
          offset += 8;
          payloadLength = 127;
        } else if (bodyLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const buffer2 = Buffer.allocUnsafe(bodyLength + offset);
        buffer2[0] = buffer2[1] = 0;
        buffer2[0] |= 128;
        buffer2[0] = (buffer2[0] & 240) + opcode;
        buffer2[offset - 4] = maskKey[0];
        buffer2[offset - 3] = maskKey[1];
        buffer2[offset - 2] = maskKey[2];
        buffer2[offset - 1] = maskKey[3];
        buffer2[1] = payloadLength;
        if (payloadLength === 126) {
          buffer2.writeUInt16BE(bodyLength, 2);
        } else if (payloadLength === 127) {
          buffer2[2] = buffer2[3] = 0;
          buffer2.writeUIntBE(bodyLength, 4, 6);
        }
        buffer2[1] |= 128;
        for (let i = 0; i < bodyLength; ++i) {
          buffer2[offset + i] = frameData[i] ^ maskKey[i & 3];
        }
        return buffer2;
      }
      /**
       * @param {Uint8Array} buffer
       */
      static createFastTextFrame(buffer2) {
        const maskKey = generateMask();
        const bodyLength = buffer2.length;
        for (let i = 0; i < bodyLength; ++i) {
          buffer2[i] ^= maskKey[i & 3];
        }
        let payloadLength = bodyLength;
        let offset = 6;
        if (bodyLength > maxUnsigned16Bit) {
          offset += 8;
          payloadLength = 127;
        } else if (bodyLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const head = Buffer.allocUnsafeSlow(offset);
        head[0] = 128 | opcodes.TEXT;
        head[1] = payloadLength | 128;
        head[offset - 4] = maskKey[0];
        head[offset - 3] = maskKey[1];
        head[offset - 2] = maskKey[2];
        head[offset - 1] = maskKey[3];
        if (payloadLength === 126) {
          head.writeUInt16BE(bodyLength, 2);
        } else if (payloadLength === 127) {
          head[2] = head[3] = 0;
          head.writeUIntBE(bodyLength, 4, 6);
        }
        return [head, buffer2];
      }
    };
    module2.exports = {
      WebsocketFrameSend,
      generateMask
      // for benchmark
    };
  }
});

// lib/web/websocket/connection.js
var require_connection = __commonJS({
  "lib/web/websocket/connection.js"(exports2, module2) {
    "use strict";
    var { uid, states, sentCloseFrameState, emptyBuffer, opcodes } = require_constants4();
    var { parseExtensions, isClosed, isClosing, isEstablished, isConnecting, validateCloseCodeAndReason } = require_util3();
    var { makeRequest } = require_request2();
    var { fetching } = require_fetch();
    var { Headers, getHeadersList } = require_headers();
    var { getDecodeSplit } = require_util2();
    var { WebsocketFrameSend } = require_frame();
    var assert = require("node:assert");
    var { runtimeFeatures } = require_runtime_features();
    var crypto = runtimeFeatures.has("crypto") ? require("node:crypto") : null;
    var warningEmitted = false;
    function establishWebSocketConnection(url, protocols, client, handler, options) {
      const requestURL = url;
      requestURL.protocol = url.protocol === "ws:" ? "http:" : "https:";
      const request = makeRequest({
        urlList: [requestURL],
        client,
        serviceWorkers: "none",
        referrer: "no-referrer",
        mode: "websocket",
        credentials: "include",
        cache: "no-store",
        redirect: "error",
        useURLCredentials: true
      });
      if (options.headers) {
        const headersList = getHeadersList(new Headers(options.headers));
        request.headersList = headersList;
      }
      const keyValue = crypto.randomBytes(16).toString("base64");
      request.headersList.append("sec-websocket-key", keyValue, true);
      request.headersList.append("sec-websocket-version", "13", true);
      for (const protocol of protocols) {
        request.headersList.append("sec-websocket-protocol", protocol, true);
      }
      const permessageDeflate = "permessage-deflate; client_max_window_bits";
      request.headersList.append("sec-websocket-extensions", permessageDeflate, true);
      const controller = fetching({
        request,
        useParallelQueue: true,
        dispatcher: options.dispatcher,
        processResponse(response) {
          if (response.type === "error" || response.status !== 101) {
            if (response.socket?.session == null) {
              failWebsocketConnection(handler, 1002, "Received network error or non-101 status code.", response.error);
              return;
            }
            if (response.status !== 200) {
              failWebsocketConnection(handler, 1002, "Received network error or non-200 status code.", response.error);
              return;
            }
          }
          if (warningEmitted === false && response.socket?.session != null) {
            process.emitWarning("WebSocket over HTTP2 is experimental, and subject to change.", "ExperimentalWarning");
            warningEmitted = true;
          }
          if (protocols.length !== 0 && !response.headersList.get("Sec-WebSocket-Protocol")) {
            failWebsocketConnection(handler, 1002, "Server did not respond with sent protocols.");
            return;
          }
          if (response.socket.session == null && response.headersList.get("Upgrade")?.toLowerCase() !== "websocket") {
            failWebsocketConnection(handler, 1002, 'Server did not set Upgrade header to "websocket".');
            return;
          }
          if (response.socket.session == null && response.headersList.get("Connection")?.toLowerCase() !== "upgrade") {
            failWebsocketConnection(handler, 1002, 'Server did not set Connection header to "upgrade".');
            return;
          }
          const secWSAccept = response.headersList.get("Sec-WebSocket-Accept");
          const digest = crypto.hash("sha1", keyValue + uid, "base64");
          if (secWSAccept !== digest) {
            failWebsocketConnection(handler, 1002, "Incorrect hash received in Sec-WebSocket-Accept header.");
            return;
          }
          const secExtension = response.headersList.get("Sec-WebSocket-Extensions");
          let extensions;
          if (secExtension !== null) {
            extensions = parseExtensions(secExtension);
            if (!extensions.has("permessage-deflate")) {
              failWebsocketConnection(handler, 1002, "Sec-WebSocket-Extensions header does not match.");
              return;
            }
          }
          const secProtocol = response.headersList.get("Sec-WebSocket-Protocol");
          if (secProtocol !== null) {
            const requestProtocols = getDecodeSplit("sec-websocket-protocol", request.headersList);
            if (!requestProtocols.includes(secProtocol)) {
              failWebsocketConnection(handler, 1002, "Protocol was not set in the opening handshake.");
              return;
            }
          }
          response.socket.on("data", handler.onSocketData);
          response.socket.on("close", handler.onSocketClose);
          response.socket.on("error", handler.onSocketError);
          handler.wasEverConnected = true;
          handler.onConnectionEstablished(response, extensions);
        }
      });
      return controller;
    }
    __name(establishWebSocketConnection, "establishWebSocketConnection");
    function closeWebSocketConnection(object, code, reason, validate = false) {
      code ??= null;
      reason ??= "";
      if (validate) validateCloseCodeAndReason(code, reason);
      if (isClosed(object.readyState) || isClosing(object.readyState)) {
      } else if (!isEstablished(object.readyState)) {
        failWebsocketConnection(object);
        object.readyState = states.CLOSING;
      } else if (!object.closeState.has(sentCloseFrameState.SENT) && !object.closeState.has(sentCloseFrameState.RECEIVED)) {
        const frame = new WebsocketFrameSend();
        if (reason.length !== 0 && code === null) {
          code = 1e3;
        }
        assert(code === null || Number.isInteger(code));
        if (code === null && reason.length === 0) {
          frame.frameData = emptyBuffer;
        } else if (code !== null && reason === null) {
          frame.frameData = Buffer.allocUnsafe(2);
          frame.frameData.writeUInt16BE(code, 0);
        } else if (code !== null && reason !== null) {
          frame.frameData = Buffer.allocUnsafe(2 + Buffer.byteLength(reason));
          frame.frameData.writeUInt16BE(code, 0);
          frame.frameData.write(reason, 2, "utf-8");
        } else {
          frame.frameData = emptyBuffer;
        }
        object.socket.write(frame.createFrame(opcodes.CLOSE));
        object.closeState.add(sentCloseFrameState.SENT);
        object.readyState = states.CLOSING;
      } else {
        object.readyState = states.CLOSING;
      }
    }
    __name(closeWebSocketConnection, "closeWebSocketConnection");
    function failWebsocketConnection(handler, code, reason, cause) {
      if (isEstablished(handler.readyState)) {
        closeWebSocketConnection(handler, code, reason, false);
      }
      handler.controller.abort();
      if (isConnecting(handler.readyState)) {
        handler.onSocketClose();
      } else if (handler.socket?.destroyed === false) {
        handler.socket.destroy();
      }
    }
    __name(failWebsocketConnection, "failWebsocketConnection");
    module2.exports = {
      establishWebSocketConnection,
      failWebsocketConnection,
      closeWebSocketConnection
    };
  }
});

// lib/web/websocket/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "lib/web/websocket/permessage-deflate.js"(exports2, module2) {
    "use strict";
    var { createInflateRaw, Z_DEFAULT_WINDOWBITS } = require("node:zlib");
    var { isValidClientWindowBits } = require_util3();
    var { MessageSizeExceededError } = require_errors();
    var tail = Buffer.from([0, 0, 255, 255]);
    var kBuffer = /* @__PURE__ */ Symbol("kBuffer");
    var kLength = /* @__PURE__ */ Symbol("kLength");
    var kDefaultMaxDecompressedSize = 4 * 1024 * 1024;
    var PerMessageDeflate = class {
      static {
        __name(this, "PerMessageDeflate");
      }
      /** @type {import('node:zlib').InflateRaw} */
      #inflate;
      #options = {};
      /** @type {boolean} */
      #aborted = false;
      /** @type {Function|null} */
      #currentCallback = null;
      /**
       * @param {Map<string, string>} extensions
       */
      constructor(extensions) {
        this.#options.serverNoContextTakeover = extensions.has("server_no_context_takeover");
        this.#options.serverMaxWindowBits = extensions.get("server_max_window_bits");
      }
      decompress(chunk, fin, callback) {
        if (this.#aborted) {
          callback(new MessageSizeExceededError());
          return;
        }
        if (!this.#inflate) {
          let windowBits = Z_DEFAULT_WINDOWBITS;
          if (this.#options.serverMaxWindowBits) {
            if (!isValidClientWindowBits(this.#options.serverMaxWindowBits)) {
              callback(new Error("Invalid server_max_window_bits"));
              return;
            }
            windowBits = Number.parseInt(this.#options.serverMaxWindowBits);
          }
          try {
            this.#inflate = createInflateRaw({ windowBits });
          } catch (err) {
            callback(err);
            return;
          }
          this.#inflate[kBuffer] = [];
          this.#inflate[kLength] = 0;
          this.#inflate.on("data", (data) => {
            if (this.#aborted) {
              return;
            }
            this.#inflate[kLength] += data.length;
            if (this.#inflate[kLength] > kDefaultMaxDecompressedSize) {
              this.#aborted = true;
              this.#inflate.removeAllListeners();
              this.#inflate.destroy();
              this.#inflate = null;
              if (this.#currentCallback) {
                const cb = this.#currentCallback;
                this.#currentCallback = null;
                cb(new MessageSizeExceededError());
              }
              return;
            }
            this.#inflate[kBuffer].push(data);
          });
          this.#inflate.on("error", (err) => {
            this.#inflate = null;
            callback(err);
          });
        }
        this.#currentCallback = callback;
        this.#inflate.write(chunk);
        if (fin) {
          this.#inflate.write(tail);
        }
        this.#inflate.flush(() => {
          if (this.#aborted || !this.#inflate) {
            return;
          }
          const full = Buffer.concat(this.#inflate[kBuffer], this.#inflate[kLength]);
          this.#inflate[kBuffer].length = 0;
          this.#inflate[kLength] = 0;
          this.#currentCallback = null;
          callback(null, full);
        });
      }
    };
    module2.exports = { PerMessageDeflate };
  }
});

// lib/web/websocket/receiver.js
var require_receiver = __commonJS({
  "lib/web/websocket/receiver.js"(exports2, module2) {
    "use strict";
    var { Writable } = require("node:stream");
    var assert = require("node:assert");
    var { parserStates, opcodes, states, emptyBuffer, sentCloseFrameState } = require_constants4();
    var {
      isValidStatusCode,
      isValidOpcode,
      websocketMessageReceived,
      utf8Decode,
      isControlFrame,
      isTextBinaryFrame,
      isContinuationFrame
    } = require_util3();
    var { failWebsocketConnection } = require_connection();
    var { WebsocketFrameSend } = require_frame();
    var { PerMessageDeflate } = require_permessage_deflate();
    var { MessageSizeExceededError } = require_errors();
    var ByteParser = class extends Writable {
      static {
        __name(this, "ByteParser");
      }
      #buffers = [];
      #fragmentsBytes = 0;
      #byteOffset = 0;
      #loop = false;
      #state = parserStates.INFO;
      #info = {};
      #fragments = [];
      /** @type {Map<string, PerMessageDeflate>} */
      #extensions;
      /** @type {import('./websocket').Handler} */
      #handler;
      /**
       * @param {import('./websocket').Handler} handler
       * @param {Map<string, string>|null} extensions
       */
      constructor(handler, extensions) {
        super();
        this.#handler = handler;
        this.#extensions = extensions == null ? /* @__PURE__ */ new Map() : extensions;
        if (this.#extensions.has("permessage-deflate")) {
          this.#extensions.set("permessage-deflate", new PerMessageDeflate(extensions));
        }
      }
      /**
       * @param {Buffer} chunk
       * @param {() => void} callback
       */
      _write(chunk, _, callback) {
        this.#buffers.push(chunk);
        this.#byteOffset += chunk.length;
        this.#loop = true;
        this.run(callback);
      }
      /**
       * Runs whenever a new chunk is received.
       * Callback is called whenever there are no more chunks buffering,
       * or not enough bytes are buffered to parse.
       */
      run(callback) {
        while (this.#loop) {
          if (this.#state === parserStates.INFO) {
            if (this.#byteOffset < 2) {
              return callback();
            }
            const buffer = this.consume(2);
            const fin = (buffer[0] & 128) !== 0;
            const opcode = buffer[0] & 15;
            const masked = (buffer[1] & 128) === 128;
            const fragmented = !fin && opcode !== opcodes.CONTINUATION;
            const payloadLength = buffer[1] & 127;
            const rsv1 = buffer[0] & 64;
            const rsv2 = buffer[0] & 32;
            const rsv3 = buffer[0] & 16;
            if (!isValidOpcode(opcode)) {
              failWebsocketConnection(this.#handler, 1002, "Invalid opcode received");
              return callback();
            }
            if (masked) {
              failWebsocketConnection(this.#handler, 1002, "Frame cannot be masked");
              return callback();
            }
            if (rsv1 !== 0 && !this.#extensions.has("permessage-deflate")) {
              failWebsocketConnection(this.#handler, 1002, "Expected RSV1 to be clear.");
              return;
            }
            if (rsv2 !== 0 || rsv3 !== 0) {
              failWebsocketConnection(this.#handler, 1002, "RSV1, RSV2, RSV3 must be clear");
              return;
            }
            if (fragmented && !isTextBinaryFrame(opcode)) {
              failWebsocketConnection(this.#handler, 1002, "Invalid frame type was fragmented.");
              return;
            }
            if (isTextBinaryFrame(opcode) && this.#fragments.length > 0) {
              failWebsocketConnection(this.#handler, 1002, "Expected continuation frame");
              return;
            }
            if (this.#info.fragmented && fragmented) {
              failWebsocketConnection(this.#handler, 1002, "Fragmented frame exceeded 125 bytes.");
              return;
            }
            if ((payloadLength > 125 || fragmented) && isControlFrame(opcode)) {
              failWebsocketConnection(this.#handler, 1002, "Control frame either too large or fragmented");
              return;
            }
            if (isContinuationFrame(opcode) && this.#fragments.length === 0 && !this.#info.compressed) {
              failWebsocketConnection(this.#handler, 1002, "Unexpected continuation frame");
              return;
            }
            if (payloadLength <= 125) {
              this.#info.payloadLength = payloadLength;
              this.#state = parserStates.READ_DATA;
            } else if (payloadLength === 126) {
              this.#state = parserStates.PAYLOADLENGTH_16;
            } else if (payloadLength === 127) {
              this.#state = parserStates.PAYLOADLENGTH_64;
            }
            if (isTextBinaryFrame(opcode)) {
              this.#info.binaryType = opcode;
              this.#info.compressed = rsv1 !== 0;
            }
            this.#info.opcode = opcode;
            this.#info.masked = masked;
            this.#info.fin = fin;
            this.#info.fragmented = fragmented;
          } else if (this.#state === parserStates.PAYLOADLENGTH_16) {
            if (this.#byteOffset < 2) {
              return callback();
            }
            const buffer = this.consume(2);
            this.#info.payloadLength = buffer.readUInt16BE(0);
            this.#state = parserStates.READ_DATA;
          } else if (this.#state === parserStates.PAYLOADLENGTH_64) {
            if (this.#byteOffset < 8) {
              return callback();
            }
            const buffer = this.consume(8);
            const upper = buffer.readUInt32BE(0);
            const lower = buffer.readUInt32BE(4);
            if (upper !== 0 || lower > 2 ** 31 - 1) {
              failWebsocketConnection(this.#handler, 1009, "Received payload length > 2^31 bytes.");
              return;
            }
            this.#info.payloadLength = lower;
            this.#state = parserStates.READ_DATA;
          } else if (this.#state === parserStates.READ_DATA) {
            if (this.#byteOffset < this.#info.payloadLength) {
              return callback();
            }
            const body = this.consume(this.#info.payloadLength);
            if (isControlFrame(this.#info.opcode)) {
              this.#loop = this.parseControlFrame(body);
              this.#state = parserStates.INFO;
            } else {
              if (!this.#info.compressed) {
                this.writeFragments(body);
                if (!this.#info.fragmented && this.#info.fin) {
                  websocketMessageReceived(this.#handler, this.#info.binaryType, this.consumeFragments());
                }
                this.#state = parserStates.INFO;
              } else {
                this.#extensions.get("permessage-deflate").decompress(body, this.#info.fin, (error, data) => {
                  if (error) {
                    const code = error instanceof MessageSizeExceededError ? 1009 : 1007;
                    failWebsocketConnection(this.#handler, code, error.message);
                    return;
                  }
                  this.writeFragments(data);
                  if (!this.#info.fin) {
                    this.#state = parserStates.INFO;
                    this.#loop = true;
                    this.run(callback);
                    return;
                  }
                  websocketMessageReceived(this.#handler, this.#info.binaryType, this.consumeFragments());
                  this.#loop = true;
                  this.#state = parserStates.INFO;
                  this.run(callback);
                });
                this.#loop = false;
                break;
              }
            }
          }
        }
      }
      /**
       * Take n bytes from the buffered Buffers
       * @param {number} n
       * @returns {Buffer}
       */
      consume(n) {
        if (n > this.#byteOffset) {
          throw new Error("Called consume() before buffers satiated.");
        } else if (n === 0) {
          return emptyBuffer;
        }
        this.#byteOffset -= n;
        const first = this.#buffers[0];
        if (first.length > n) {
          this.#buffers[0] = first.subarray(n, first.length);
          return first.subarray(0, n);
        } else if (first.length === n) {
          return this.#buffers.shift();
        } else {
          let offset = 0;
          const buffer = Buffer.allocUnsafeSlow(n);
          while (offset !== n) {
            const next = this.#buffers[0];
            const length = next.length;
            if (length + offset === n) {
              buffer.set(this.#buffers.shift(), offset);
              break;
            } else if (length + offset > n) {
              buffer.set(next.subarray(0, n - offset), offset);
              this.#buffers[0] = next.subarray(n - offset);
              break;
            } else {
              buffer.set(this.#buffers.shift(), offset);
              offset += length;
            }
          }
          return buffer;
        }
      }
      writeFragments(fragment) {
        this.#fragmentsBytes += fragment.length;
        this.#fragments.push(fragment);
      }
      consumeFragments() {
        const fragments = this.#fragments;
        if (fragments.length === 1) {
          this.#fragmentsBytes = 0;
          return fragments.shift();
        }
        let offset = 0;
        const output = Buffer.allocUnsafeSlow(this.#fragmentsBytes);
        for (let i = 0; i < fragments.length; ++i) {
          const buffer = fragments[i];
          output.set(buffer, offset);
          offset += buffer.length;
        }
        this.#fragments = [];
        this.#fragmentsBytes = 0;
        return output;
      }
      parseCloseBody(data) {
        assert(data.length !== 1);
        let code;
        if (data.length >= 2) {
          code = data.readUInt16BE(0);
        }
        if (code !== void 0 && !isValidStatusCode(code)) {
          return { code: 1002, reason: "Invalid status code", error: true };
        }
        let reason = data.subarray(2);
        if (reason[0] === 239 && reason[1] === 187 && reason[2] === 191) {
          reason = reason.subarray(3);
        }
        try {
          reason = utf8Decode(reason);
        } catch {
          return { code: 1007, reason: "Invalid UTF-8", error: true };
        }
        return { code, reason, error: false };
      }
      /**
       * Parses control frames.
       * @param {Buffer} body
       */
      parseControlFrame(body) {
        const { opcode, payloadLength } = this.#info;
        if (opcode === opcodes.CLOSE) {
          if (payloadLength === 1) {
            failWebsocketConnection(this.#handler, 1002, "Received close frame with a 1-byte body.");
            return false;
          }
          this.#info.closeInfo = this.parseCloseBody(body);
          if (this.#info.closeInfo.error) {
            const { code, reason } = this.#info.closeInfo;
            failWebsocketConnection(this.#handler, code, reason);
            return false;
          }
          if (!this.#handler.closeState.has(sentCloseFrameState.SENT) && !this.#handler.closeState.has(sentCloseFrameState.RECEIVED)) {
            let body2 = emptyBuffer;
            if (this.#info.closeInfo.code) {
              body2 = Buffer.allocUnsafe(2);
              body2.writeUInt16BE(this.#info.closeInfo.code, 0);
            }
            const closeFrame = new WebsocketFrameSend(body2);
            this.#handler.socket.write(closeFrame.createFrame(opcodes.CLOSE));
            this.#handler.closeState.add(sentCloseFrameState.SENT);
          }
          this.#handler.readyState = states.CLOSING;
          this.#handler.closeState.add(sentCloseFrameState.RECEIVED);
          return false;
        } else if (opcode === opcodes.PING) {
          if (!this.#handler.closeState.has(sentCloseFrameState.RECEIVED)) {
            const frame = new WebsocketFrameSend(body);
            this.#handler.socket.write(frame.createFrame(opcodes.PONG));
            this.#handler.onPing(body);
          }
        } else if (opcode === opcodes.PONG) {
          this.#handler.onPong(body);
        }
        return true;
      }
      get closingInfo() {
        return this.#info.closeInfo;
      }
    };
    module2.exports = {
      ByteParser
    };
  }
});

// lib/web/websocket/sender.js
var require_sender = __commonJS({
  "lib/web/websocket/sender.js"(exports2, module2) {
    "use strict";
    var { WebsocketFrameSend } = require_frame();
    var { opcodes, sendHints } = require_constants4();
    var FixedQueue = require_fixed_queue();
    var SendQueue = class {
      static {
        __name(this, "SendQueue");
      }
      /**
       * @type {FixedQueue}
       */
      #queue = new FixedQueue();
      /**
       * @type {boolean}
       */
      #running = false;
      /** @type {import('node:net').Socket} */
      #socket;
      constructor(socket) {
        this.#socket = socket;
      }
      add(item, cb, hint) {
        if (hint !== sendHints.blob) {
          if (!this.#running) {
            if (hint === sendHints.text) {
              const { 0: head, 1: body } = WebsocketFrameSend.createFastTextFrame(item);
              this.#socket.cork();
              this.#socket.write(head);
              this.#socket.write(body, cb);
              this.#socket.uncork();
            } else {
              this.#socket.write(createFrame(item, hint), cb);
            }
          } else {
            const node2 = {
              promise: null,
              callback: cb,
              frame: createFrame(item, hint)
            };
            this.#queue.push(node2);
          }
          return;
        }
        const node = {
          promise: item.arrayBuffer().then((ab) => {
            node.promise = null;
            node.frame = createFrame(ab, hint);
          }),
          callback: cb,
          frame: null
        };
        this.#queue.push(node);
        if (!this.#running) {
          this.#run();
        }
      }
      async #run() {
        this.#running = true;
        const queue = this.#queue;
        while (!queue.isEmpty()) {
          const node = queue.shift();
          if (node.promise !== null) {
            await node.promise;
          }
          this.#socket.write(node.frame, node.callback);
          node.callback = node.frame = null;
        }
        this.#running = false;
      }
    };
    function createFrame(data, hint) {
      return new WebsocketFrameSend(toBuffer(data, hint)).createFrame(hint === sendHints.text ? opcodes.TEXT : opcodes.BINARY);
    }
    __name(createFrame, "createFrame");
    function toBuffer(data, hint) {
      switch (hint) {
        case sendHints.text:
        case sendHints.typedArray:
          return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        case sendHints.arrayBuffer:
        case sendHints.blob:
          return new Uint8Array(data);
      }
    }
    __name(toBuffer, "toBuffer");
    module2.exports = { SendQueue };
  }
});

// lib/web/websocket/websocket.js
var require_websocket = __commonJS({
  "lib/web/websocket/websocket.js"(exports2, module2) {
    "use strict";
    var { isArrayBuffer } = require("node:util/types");
    var { webidl } = require_webidl();
    var { URLSerializer } = require_data_url();
    var { environmentSettingsObject } = require_util2();
    var { staticPropertyDescriptors, states, sentCloseFrameState, sendHints, opcodes } = require_constants4();
    var {
      isConnecting,
      isEstablished,
      isClosing,
      isClosed,
      isValidSubprotocol,
      fireEvent,
      utf8Decode,
      toArrayBuffer,
      getURLRecord
    } = require_util3();
    var { establishWebSocketConnection, closeWebSocketConnection, failWebsocketConnection } = require_connection();
    var { ByteParser } = require_receiver();
    var { kEnumerableProperty } = require_util();
    var { getGlobalDispatcher: getGlobalDispatcher2 } = require_global2();
    var { ErrorEvent: ErrorEvent2, CloseEvent: CloseEvent2, createFastMessageEvent: createFastMessageEvent2 } = require_events();
    var { SendQueue } = require_sender();
    var { WebsocketFrameSend } = require_frame();
    var { channels } = require_diagnostics();
    function getSocketAddress(socket) {
      if (typeof socket?.address === "function") {
        return socket.address();
      }
      if (typeof socket?.session?.socket?.address === "function") {
        return socket.session.socket.address();
      }
      return null;
    }
    __name(getSocketAddress, "getSocketAddress");
    var WebSocket = class _WebSocket extends EventTarget {
      static {
        __name(this, "WebSocket");
      }
      #events = {
        open: null,
        error: null,
        close: null,
        message: null
      };
      #bufferedAmount = 0;
      #protocol = "";
      #extensions = "";
      /** @type {SendQueue} */
      #sendQueue;
      /** @type {Handler} */
      #handler = {
        onConnectionEstablished: /* @__PURE__ */ __name((response, extensions) => this.#onConnectionEstablished(response, extensions), "onConnectionEstablished"),
        onMessage: /* @__PURE__ */ __name((opcode, data) => this.#onMessage(opcode, data), "onMessage"),
        onParserError: /* @__PURE__ */ __name((err) => failWebsocketConnection(this.#handler, null, err.message), "onParserError"),
        onParserDrain: /* @__PURE__ */ __name(() => this.#onParserDrain(), "onParserDrain"),
        onSocketData: /* @__PURE__ */ __name((chunk) => {
          if (!this.#parser.write(chunk)) {
            this.#handler.socket.pause();
          }
        }, "onSocketData"),
        onSocketError: /* @__PURE__ */ __name((err) => {
          this.#handler.readyState = states.CLOSING;
          if (channels.socketError.hasSubscribers) {
            channels.socketError.publish(err);
          }
          this.#handler.socket.destroy();
        }, "onSocketError"),
        onSocketClose: /* @__PURE__ */ __name(() => this.#onSocketClose(), "onSocketClose"),
        onPing: /* @__PURE__ */ __name((body) => {
          if (channels.ping.hasSubscribers) {
            channels.ping.publish({
              payload: body,
              websocket: this
            });
          }
        }, "onPing"),
        onPong: /* @__PURE__ */ __name((body) => {
          if (channels.pong.hasSubscribers) {
            channels.pong.publish({
              payload: body,
              websocket: this
            });
          }
        }, "onPong"),
        readyState: states.CONNECTING,
        socket: null,
        closeState: /* @__PURE__ */ new Set(),
        controller: null,
        wasEverConnected: false
      };
      #url;
      #binaryType;
      /** @type {import('./receiver').ByteParser} */
      #parser;
      /**
       * @param {string} url
       * @param {string|string[]} protocols
       */
      constructor(url, protocols = []) {
        super();
        webidl.util.markAsUncloneable(this);
        const prefix = "WebSocket constructor";
        webidl.argumentLengthCheck(arguments, 1, prefix);
        const options = webidl.converters["DOMString or sequence<DOMString> or WebSocketInit"](protocols, prefix, "options");
        url = webidl.converters.USVString(url);
        protocols = options.protocols;
        const baseURL = environmentSettingsObject.settingsObject.baseUrl;
        const urlRecord = getURLRecord(url, baseURL);
        if (typeof protocols === "string") {
          protocols = [protocols];
        }
        if (protocols.length !== new Set(protocols.map((p) => p.toLowerCase())).size) {
          throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
        }
        if (protocols.length > 0 && !protocols.every((p) => isValidSubprotocol(p))) {
          throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
        }
        this.#url = new URL(urlRecord.href);
        const client = environmentSettingsObject.settingsObject;
        this.#handler.controller = establishWebSocketConnection(
          urlRecord,
          protocols,
          client,
          this.#handler,
          options
        );
        this.#handler.readyState = _WebSocket.CONNECTING;
        this.#binaryType = "blob";
      }
      /**
       * @see https://websockets.spec.whatwg.org/#dom-websocket-close
       * @param {number|undefined} code
       * @param {string|undefined} reason
       */
      close(code = void 0, reason = void 0) {
        webidl.brandCheck(this, _WebSocket);
        const prefix = "WebSocket.close";
        if (code !== void 0) {
          code = webidl.converters["unsigned short"](code, prefix, "code", webidl.attributes.Clamp);
        }
        if (reason !== void 0) {
          reason = webidl.converters.USVString(reason);
        }
        code ??= null;
        reason ??= "";
        closeWebSocketConnection(this.#handler, code, reason, true);
      }
      /**
       * @see https://websockets.spec.whatwg.org/#dom-websocket-send
       * @param {NodeJS.TypedArray|ArrayBuffer|Blob|string} data
       */
      send(data) {
        webidl.brandCheck(this, _WebSocket);
        const prefix = "WebSocket.send";
        webidl.argumentLengthCheck(arguments, 1, prefix);
        data = webidl.converters.WebSocketSendData(data, prefix, "data");
        if (isConnecting(this.#handler.readyState)) {
          throw new DOMException("Sent before connected.", "InvalidStateError");
        }
        if (!isEstablished(this.#handler.readyState) || isClosing(this.#handler.readyState)) {
          return;
        }
        if (typeof data === "string") {
          const buffer = Buffer.from(data);
          this.#bufferedAmount += buffer.byteLength;
          this.#sendQueue.add(buffer, () => {
            this.#bufferedAmount -= buffer.byteLength;
          }, sendHints.text);
        } else if (isArrayBuffer(data)) {
          this.#bufferedAmount += data.byteLength;
          this.#sendQueue.add(data, () => {
            this.#bufferedAmount -= data.byteLength;
          }, sendHints.arrayBuffer);
        } else if (ArrayBuffer.isView(data)) {
          this.#bufferedAmount += data.byteLength;
          this.#sendQueue.add(data, () => {
            this.#bufferedAmount -= data.byteLength;
          }, sendHints.typedArray);
        } else if (webidl.is.Blob(data)) {
          this.#bufferedAmount += data.size;
          this.#sendQueue.add(data, () => {
            this.#bufferedAmount -= data.size;
          }, sendHints.blob);
        }
      }
      get readyState() {
        webidl.brandCheck(this, _WebSocket);
        return this.#handler.readyState;
      }
      get bufferedAmount() {
        webidl.brandCheck(this, _WebSocket);
        return this.#bufferedAmount;
      }
      get url() {
        webidl.brandCheck(this, _WebSocket);
        return URLSerializer(this.#url);
      }
      get extensions() {
        webidl.brandCheck(this, _WebSocket);
        return this.#extensions;
      }
      get protocol() {
        webidl.brandCheck(this, _WebSocket);
        return this.#protocol;
      }
      get onopen() {
        webidl.brandCheck(this, _WebSocket);
        return this.#events.open;
      }
      set onopen(fn) {
        webidl.brandCheck(this, _WebSocket);
        if (this.#events.open) {
          this.removeEventListener("open", this.#events.open);
        }
        const listener = webidl.converters.EventHandlerNonNull(fn);
        if (listener !== null) {
          this.addEventListener("open", listener);
          this.#events.open = fn;
        } else {
          this.#events.open = null;
        }
      }
      get onerror() {
        webidl.brandCheck(this, _WebSocket);
        return this.#events.error;
      }
      set onerror(fn) {
        webidl.brandCheck(this, _WebSocket);
        if (this.#events.error) {
          this.removeEventListener("error", this.#events.error);
        }
        const listener = webidl.converters.EventHandlerNonNull(fn);
        if (listener !== null) {
          this.addEventListener("error", listener);
          this.#events.error = fn;
        } else {
          this.#events.error = null;
        }
      }
      get onclose() {
        webidl.brandCheck(this, _WebSocket);
        return this.#events.close;
      }
      set onclose(fn) {
        webidl.brandCheck(this, _WebSocket);
        if (this.#events.close) {
          this.removeEventListener("close", this.#events.close);
        }
        const listener = webidl.converters.EventHandlerNonNull(fn);
        if (listener !== null) {
          this.addEventListener("close", listener);
          this.#events.close = fn;
        } else {
          this.#events.close = null;
        }
      }
      get onmessage() {
        webidl.brandCheck(this, _WebSocket);
        return this.#events.message;
      }
      set onmessage(fn) {
        webidl.brandCheck(this, _WebSocket);
        if (this.#events.message) {
          this.removeEventListener("message", this.#events.message);
        }
        const listener = webidl.converters.EventHandlerNonNull(fn);
        if (listener !== null) {
          this.addEventListener("message", listener);
          this.#events.message = fn;
        } else {
          this.#events.message = null;
        }
      }
      get binaryType() {
        webidl.brandCheck(this, _WebSocket);
        return this.#binaryType;
      }
      set binaryType(type) {
        webidl.brandCheck(this, _WebSocket);
        if (type !== "blob" && type !== "arraybuffer") {
          this.#binaryType = "blob";
        } else {
          this.#binaryType = type;
        }
      }
      /**
       * @see https://websockets.spec.whatwg.org/#feedback-from-the-protocol
       */
      #onConnectionEstablished(response, parsedExtensions) {
        this.#handler.socket = response.socket;
        const parser = new ByteParser(this.#handler, parsedExtensions);
        parser.on("drain", () => this.#handler.onParserDrain());
        parser.on("error", (err) => this.#handler.onParserError(err));
        this.#parser = parser;
        this.#sendQueue = new SendQueue(response.socket);
        this.#handler.readyState = states.OPEN;
        const extensions = response.headersList.get("sec-websocket-extensions");
        if (extensions !== null) {
          this.#extensions = extensions;
        }
        const protocol = response.headersList.get("sec-websocket-protocol");
        if (protocol !== null) {
          this.#protocol = protocol;
        }
        fireEvent("open", this);
        if (channels.open.hasSubscribers) {
          const headers = response.headersList.entries;
          channels.open.publish({
            address: getSocketAddress(response.socket),
            protocol: this.#protocol,
            extensions: this.#extensions,
            websocket: this,
            handshakeResponse: {
              status: response.status,
              statusText: response.statusText,
              headers
            }
          });
        }
      }
      #onMessage(type, data) {
        if (this.#handler.readyState !== states.OPEN) {
          return;
        }
        let dataForEvent;
        if (type === opcodes.TEXT) {
          try {
            dataForEvent = utf8Decode(data);
          } catch {
            failWebsocketConnection(this.#handler, 1007, "Received invalid UTF-8 in text frame.");
            return;
          }
        } else if (type === opcodes.BINARY) {
          if (this.#binaryType === "blob") {
            dataForEvent = new Blob([data]);
          } else {
            dataForEvent = toArrayBuffer(data);
          }
        }
        fireEvent("message", this, createFastMessageEvent2, {
          origin: this.#url.origin,
          data: dataForEvent
        });
      }
      #onParserDrain() {
        this.#handler.socket.resume();
      }
      /**
       * @see https://websockets.spec.whatwg.org/#feedback-from-the-protocol
       * @see https://datatracker.ietf.org/doc/html/rfc6455#section-7.1.4
       */
      #onSocketClose() {
        const wasClean = this.#handler.closeState.has(sentCloseFrameState.SENT) && this.#handler.closeState.has(sentCloseFrameState.RECEIVED);
        let code = 1005;
        let reason = "";
        const result = this.#parser?.closingInfo;
        if (result && !result.error) {
          code = result.code ?? 1005;
          reason = result.reason;
        }
        this.#handler.readyState = states.CLOSED;
        if (!this.#handler.closeState.has(sentCloseFrameState.RECEIVED)) {
          code = 1006;
          fireEvent("error", this, (type, init) => new ErrorEvent2(type, init), {
            error: new TypeError(reason)
          });
        }
        fireEvent("close", this, (type, init) => new CloseEvent2(type, init), {
          wasClean,
          code,
          reason
        });
        if (channels.close.hasSubscribers) {
          channels.close.publish({
            websocket: this,
            code,
            reason
          });
        }
      }
      /**
       * @param {WebSocket} ws
       * @param {Buffer|undefined} buffer
       */
      static ping(ws, buffer) {
        if (Buffer.isBuffer(buffer)) {
          if (buffer.length > 125) {
            throw new TypeError("A PING frame cannot have a body larger than 125 bytes.");
          }
        } else if (buffer !== void 0) {
          throw new TypeError("Expected buffer payload");
        }
        const readyState = ws.#handler.readyState;
        if (isEstablished(readyState) && !isClosing(readyState) && !isClosed(readyState)) {
          const frame = new WebsocketFrameSend(buffer);
          ws.#handler.socket.write(frame.createFrame(opcodes.PING));
        }
      }
    };
    var { ping } = WebSocket;
    Reflect.deleteProperty(WebSocket, "ping");
    WebSocket.CONNECTING = WebSocket.prototype.CONNECTING = states.CONNECTING;
    WebSocket.OPEN = WebSocket.prototype.OPEN = states.OPEN;
    WebSocket.CLOSING = WebSocket.prototype.CLOSING = states.CLOSING;
    WebSocket.CLOSED = WebSocket.prototype.CLOSED = states.CLOSED;
    Object.defineProperties(WebSocket.prototype, {
      CONNECTING: staticPropertyDescriptors,
      OPEN: staticPropertyDescriptors,
      CLOSING: staticPropertyDescriptors,
      CLOSED: staticPropertyDescriptors,
      url: kEnumerableProperty,
      readyState: kEnumerableProperty,
      bufferedAmount: kEnumerableProperty,
      onopen: kEnumerableProperty,
      onerror: kEnumerableProperty,
      onclose: kEnumerableProperty,
      close: kEnumerableProperty,
      onmessage: kEnumerableProperty,
      binaryType: kEnumerableProperty,
      send: kEnumerableProperty,
      extensions: kEnumerableProperty,
      protocol: kEnumerableProperty,
      [Symbol.toStringTag]: {
        value: "WebSocket",
        writable: false,
        enumerable: false,
        configurable: true
      }
    });
    Object.defineProperties(WebSocket, {
      CONNECTING: staticPropertyDescriptors,
      OPEN: staticPropertyDescriptors,
      CLOSING: staticPropertyDescriptors,
      CLOSED: staticPropertyDescriptors
    });
    webidl.converters["sequence<DOMString>"] = webidl.sequenceConverter(
      webidl.converters.DOMString
    );
    webidl.converters["DOMString or sequence<DOMString>"] = function(V, prefix, argument) {
      if (webidl.util.Type(V) === webidl.util.Types.OBJECT && Symbol.iterator in V) {
        return webidl.converters["sequence<DOMString>"](V);
      }
      return webidl.converters.DOMString(V, prefix, argument);
    };
    webidl.converters.WebSocketInit = webidl.dictionaryConverter([
      {
        key: "protocols",
        converter: webidl.converters["DOMString or sequence<DOMString>"],
        defaultValue: /* @__PURE__ */ __name(() => [], "defaultValue")
      },
      {
        key: "dispatcher",
        converter: webidl.converters.any,
        defaultValue: /* @__PURE__ */ __name(() => getGlobalDispatcher2(), "defaultValue")
      },
      {
        key: "headers",
        converter: webidl.nullableConverter(webidl.converters.HeadersInit)
      }
    ]);
    webidl.converters["DOMString or sequence<DOMString> or WebSocketInit"] = function(V) {
      if (webidl.util.Type(V) === webidl.util.Types.OBJECT && !(Symbol.iterator in V)) {
        return webidl.converters.WebSocketInit(V);
      }
      return { protocols: webidl.converters["DOMString or sequence<DOMString>"](V) };
    };
    webidl.converters.WebSocketSendData = function(V) {
      if (webidl.util.Type(V) === webidl.util.Types.OBJECT) {
        if (webidl.is.Blob(V)) {
          return V;
        }
        if (webidl.is.BufferSource(V)) {
          return V;
        }
      }
      return webidl.converters.USVString(V);
    };
    module2.exports = {
      WebSocket,
      ping
    };
  }
});

// lib/web/eventsource/util.js
var require_util4 = __commonJS({
  "lib/web/eventsource/util.js"(exports2, module2) {
    "use strict";
    function isValidLastEventId(value) {
      return value.indexOf("\0") === -1;
    }
    __name(isValidLastEventId, "isValidLastEventId");
    function isASCIINumber(value) {
      if (value.length === 0) return false;
      for (let i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) < 48 || value.charCodeAt(i) > 57) return false;
      }
      return true;
    }
    __name(isASCIINumber, "isASCIINumber");
    module2.exports = {
      isValidLastEventId,
      isASCIINumber
    };
  }
});

// lib/web/eventsource/eventsource-stream.js
var require_eventsource_stream = __commonJS({
  "lib/web/eventsource/eventsource-stream.js"(exports2, module2) {
    "use strict";
    var { Transform } = require("node:stream");
    var { isASCIINumber, isValidLastEventId } = require_util4();
    var BOM = [239, 187, 191];
    var LF = 10;
    var CR = 13;
    var COLON = 58;
    var SPACE = 32;
    var EventSourceStream = class extends Transform {
      static {
        __name(this, "EventSourceStream");
      }
      /**
       * @type {eventSourceSettings}
       */
      state;
      /**
       * Leading byte-order-mark check.
       * @type {boolean}
       */
      checkBOM = true;
      /**
       * @type {boolean}
       */
      crlfCheck = false;
      /**
       * @type {boolean}
       */
      eventEndCheck = false;
      /**
       * @type {Buffer|null}
       */
      buffer = null;
      pos = 0;
      event = {
        data: void 0,
        event: void 0,
        id: void 0,
        retry: void 0
      };
      /**
       * @param {object} options
       * @param {boolean} [options.readableObjectMode]
       * @param {eventSourceSettings} [options.eventSourceSettings]
       * @param {(chunk: any, encoding?: BufferEncoding | undefined) => boolean} [options.push]
       */
      constructor(options = {}) {
        options.readableObjectMode = true;
        super(options);
        this.state = options.eventSourceSettings || {};
        if (options.push) {
          this.push = options.push;
        }
      }
      /**
       * @param {Buffer} chunk
       * @param {string} _encoding
       * @param {Function} callback
       * @returns {void}
       */
      _transform(chunk, _encoding, callback) {
        if (chunk.length === 0) {
          callback();
          return;
        }
        if (this.buffer) {
          this.buffer = Buffer.concat([this.buffer, chunk]);
        } else {
          this.buffer = chunk;
        }
        if (this.checkBOM) {
          switch (this.buffer.length) {
            case 1:
              if (this.buffer[0] === BOM[0]) {
                callback();
                return;
              }
              this.checkBOM = false;
              callback();
              return;
            case 2:
              if (this.buffer[0] === BOM[0] && this.buffer[1] === BOM[1]) {
                callback();
                return;
              }
              this.checkBOM = false;
              break;
            case 3:
              if (this.buffer[0] === BOM[0] && this.buffer[1] === BOM[1] && this.buffer[2] === BOM[2]) {
                this.buffer = Buffer.alloc(0);
                this.checkBOM = false;
                callback();
                return;
              }
              this.checkBOM = false;
              break;
            default:
              if (this.buffer[0] === BOM[0] && this.buffer[1] === BOM[1] && this.buffer[2] === BOM[2]) {
                this.buffer = this.buffer.subarray(3);
              }
              this.checkBOM = false;
              break;
          }
        }
        while (this.pos < this.buffer.length) {
          if (this.eventEndCheck) {
            if (this.crlfCheck) {
              if (this.buffer[this.pos] === LF) {
                this.buffer = this.buffer.subarray(this.pos + 1);
                this.pos = 0;
                this.crlfCheck = false;
                continue;
              }
              this.crlfCheck = false;
            }
            if (this.buffer[this.pos] === LF || this.buffer[this.pos] === CR) {
              if (this.buffer[this.pos] === CR) {
                this.crlfCheck = true;
              }
              this.buffer = this.buffer.subarray(this.pos + 1);
              this.pos = 0;
              if (this.event.data !== void 0 || this.event.event || this.event.id !== void 0 || this.event.retry) {
                this.processEvent(this.event);
              }
              this.clearEvent();
              continue;
            }
            this.eventEndCheck = false;
            continue;
          }
          if (this.buffer[this.pos] === LF || this.buffer[this.pos] === CR) {
            if (this.buffer[this.pos] === CR) {
              this.crlfCheck = true;
            }
            this.parseLine(this.buffer.subarray(0, this.pos), this.event);
            this.buffer = this.buffer.subarray(this.pos + 1);
            this.pos = 0;
            this.eventEndCheck = true;
            continue;
          }
          this.pos++;
        }
        callback();
      }
      /**
       * @param {Buffer} line
       * @param {EventSourceStreamEvent} event
       */
      parseLine(line, event) {
        if (line.length === 0) {
          return;
        }
        const colonPosition = line.indexOf(COLON);
        if (colonPosition === 0) {
          return;
        }
        let field = "";
        let value = "";
        if (colonPosition !== -1) {
          field = line.subarray(0, colonPosition).toString("utf8");
          let valueStart = colonPosition + 1;
          if (line[valueStart] === SPACE) {
            ++valueStart;
          }
          value = line.subarray(valueStart).toString("utf8");
        } else {
          field = line.toString("utf8");
          value = "";
        }
        switch (field) {
          case "data":
            if (event[field] === void 0) {
              event[field] = value;
            } else {
              event[field] += `
${value}`;
            }
            break;
          case "retry":
            if (isASCIINumber(value)) {
              event[field] = value;
            }
            break;
          case "id":
            if (isValidLastEventId(value)) {
              event[field] = value;
            }
            break;
          case "event":
            if (value.length > 0) {
              event[field] = value;
            }
            break;
        }
      }
      /**
       * @param {EventSourceStreamEvent} event
       */
      processEvent(event) {
        if (event.retry && isASCIINumber(event.retry)) {
          this.state.reconnectionTime = parseInt(event.retry, 10);
        }
        if (event.id !== void 0 && isValidLastEventId(event.id)) {
          this.state.lastEventId = event.id;
        }
        if (event.data !== void 0) {
          this.push({
            type: event.event || "message",
            options: {
              data: event.data,
              lastEventId: this.state.lastEventId,
              origin: this.state.origin
            }
          });
        }
      }
      clearEvent() {
        this.event = {
          data: void 0,
          event: void 0,
          id: void 0,
          retry: void 0
        };
      }
    };
    module2.exports = {
      EventSourceStream
    };
  }
});

// lib/web/eventsource/eventsource.js
var require_eventsource = __commonJS({
  "lib/web/eventsource/eventsource.js"(exports2, module2) {
    "use strict";
    var { pipeline } = require("node:stream");
    var { fetching } = require_fetch();
    var { makeRequest } = require_request2();
    var { webidl } = require_webidl();
    var { EventSourceStream } = require_eventsource_stream();
    var { parseMIMEType } = require_data_url();
    var { createFastMessageEvent: createFastMessageEvent2 } = require_events();
    var { isNetworkError } = require_response();
    var { kEnumerableProperty } = require_util();
    var { environmentSettingsObject } = require_util2();
    var experimentalWarned = false;
    var defaultReconnectionTime = 3e3;
    var CONNECTING = 0;
    var OPEN = 1;
    var CLOSED = 2;
    var ANONYMOUS = "anonymous";
    var USE_CREDENTIALS = "use-credentials";
    var EventSource = class _EventSource extends EventTarget {
      static {
        __name(this, "EventSource");
      }
      #events = {
        open: null,
        error: null,
        message: null
      };
      #url;
      #withCredentials = false;
      /**
       * @type {ReadyState}
       */
      #readyState = CONNECTING;
      #request = null;
      #controller = null;
      #dispatcher;
      /**
       * @type {import('./eventsource-stream').eventSourceSettings}
       */
      #state;
      /**
       * Creates a new EventSource object.
       * @param {string} url
       * @param {EventSourceInit} [eventSourceInitDict={}]
       * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#the-eventsource-interface
       */
      constructor(url, eventSourceInitDict = {}) {
        super();
        webidl.util.markAsUncloneable(this);
        const prefix = "EventSource constructor";
        webidl.argumentLengthCheck(arguments, 1, prefix);
        if (!experimentalWarned) {
          experimentalWarned = true;
          process.emitWarning("EventSource is experimental, expect them to change at any time.", {
            code: "UNDICI-ES"
          });
        }
        url = webidl.converters.USVString(url);
        eventSourceInitDict = webidl.converters.EventSourceInitDict(eventSourceInitDict, prefix, "eventSourceInitDict");
        this.#dispatcher = eventSourceInitDict.node.dispatcher || eventSourceInitDict.dispatcher;
        this.#state = {
          lastEventId: "",
          reconnectionTime: eventSourceInitDict.node.reconnectionTime
        };
        const settings = environmentSettingsObject;
        let urlRecord;
        try {
          urlRecord = new URL(url, settings.settingsObject.baseUrl);
          this.#state.origin = urlRecord.origin;
        } catch (e) {
          throw new DOMException(e, "SyntaxError");
        }
        this.#url = urlRecord.href;
        let corsAttributeState = ANONYMOUS;
        if (eventSourceInitDict.withCredentials === true) {
          corsAttributeState = USE_CREDENTIALS;
          this.#withCredentials = true;
        }
        const initRequest = {
          redirect: "follow",
          keepalive: true,
          // @see https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attributes
          mode: "cors",
          credentials: corsAttributeState === "anonymous" ? "same-origin" : "omit",
          referrer: "no-referrer"
        };
        initRequest.client = environmentSettingsObject.settingsObject;
        initRequest.headersList = [["accept", { name: "accept", value: "text/event-stream" }]];
        initRequest.cache = "no-store";
        initRequest.initiator = "other";
        initRequest.urlList = [new URL(this.#url)];
        this.#request = makeRequest(initRequest);
        this.#connect();
      }
      /**
       * Returns the state of this EventSource object's connection. It can have the
       * values described below.
       * @returns {ReadyState}
       * @readonly
       */
      get readyState() {
        return this.#readyState;
      }
      /**
       * Returns the URL providing the event stream.
       * @readonly
       * @returns {string}
       */
      get url() {
        return this.#url;
      }
      /**
       * Returns a boolean indicating whether the EventSource object was
       * instantiated with CORS credentials set (true), or not (false, the default).
       */
      get withCredentials() {
        return this.#withCredentials;
      }
      #connect() {
        if (this.#readyState === CLOSED) return;
        this.#readyState = CONNECTING;
        const fetchParams = {
          request: this.#request,
          dispatcher: this.#dispatcher
        };
        const processEventSourceEndOfBody = /* @__PURE__ */ __name((response) => {
          if (!isNetworkError(response)) {
            return this.#reconnect();
          }
        }, "processEventSourceEndOfBody");
        fetchParams.processResponseEndOfBody = processEventSourceEndOfBody;
        fetchParams.processResponse = (response) => {
          if (isNetworkError(response)) {
            if (response.aborted) {
              this.close();
              this.dispatchEvent(new Event("error"));
              return;
            } else {
              this.#reconnect();
              return;
            }
          }
          const contentType = response.headersList.get("content-type", true);
          const mimeType = contentType !== null ? parseMIMEType(contentType) : "failure";
          const contentTypeValid = mimeType !== "failure" && mimeType.essence === "text/event-stream";
          if (response.status !== 200 || contentTypeValid === false) {
            this.close();
            this.dispatchEvent(new Event("error"));
            return;
          }
          this.#readyState = OPEN;
          this.dispatchEvent(new Event("open"));
          this.#state.origin = response.urlList[response.urlList.length - 1].origin;
          const eventSourceStream = new EventSourceStream({
            eventSourceSettings: this.#state,
            push: /* @__PURE__ */ __name((event) => {
              this.dispatchEvent(createFastMessageEvent2(
                event.type,
                event.options
              ));
            }, "push")
          });
          pipeline(
            response.body.stream,
            eventSourceStream,
            (error) => {
              if (error?.aborted === false) {
                this.close();
                this.dispatchEvent(new Event("error"));
              }
            }
          );
        };
        this.#controller = fetching(fetchParams);
      }
      /**
       * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#sse-processing-model
       * @returns {void}
       */
      #reconnect() {
        if (this.#readyState === CLOSED) return;
        this.#readyState = CONNECTING;
        this.dispatchEvent(new Event("error"));
        setTimeout(() => {
          if (this.#readyState !== CONNECTING) return;
          if (this.#state.lastEventId.length) {
            this.#request.headersList.set("last-event-id", this.#state.lastEventId, true);
          }
          this.#connect();
        }, this.#state.reconnectionTime)?.unref();
      }
      /**
       * Closes the connection, if any, and sets the readyState attribute to
       * CLOSED.
       */
      close() {
        webidl.brandCheck(this, _EventSource);
        if (this.#readyState === CLOSED) return;
        this.#readyState = CLOSED;
        this.#controller.abort();
        this.#request = null;
      }
      get onopen() {
        return this.#events.open;
      }
      set onopen(fn) {
        if (this.#events.open) {
          this.removeEventListener("open", this.#events.open);
        }
        const listener = webidl.converters.EventHandlerNonNull(fn);
        if (listener !== null) {
          this.addEventListener("open", listener);
          this.#events.open = fn;
        } else {
          this.#events.open = null;
        }
      }
      get onmessage() {
        return this.#events.message;
      }
      set onmessage(fn) {
        if (this.#events.message) {
          this.removeEventListener("message", this.#events.message);
        }
        const listener = webidl.converters.EventHandlerNonNull(fn);
        if (listener !== null) {
          this.addEventListener("message", listener);
          this.#events.message = fn;
        } else {
          this.#events.message = null;
        }
      }
      get onerror() {
        return this.#events.error;
      }
      set onerror(fn) {
        if (this.#events.error) {
          this.removeEventListener("error", this.#events.error);
        }
        const listener = webidl.converters.EventHandlerNonNull(fn);
        if (listener !== null) {
          this.addEventListener("error", listener);
          this.#events.error = fn;
        } else {
          this.#events.error = null;
        }
      }
    };
    var constantsPropertyDescriptors = {
      CONNECTING: {
        __proto__: null,
        configurable: false,
        enumerable: true,
        value: CONNECTING,
        writable: false
      },
      OPEN: {
        __proto__: null,
        configurable: false,
        enumerable: true,
        value: OPEN,
        writable: false
      },
      CLOSED: {
        __proto__: null,
        configurable: false,
        enumerable: true,
        value: CLOSED,
        writable: false
      }
    };
    Object.defineProperties(EventSource, constantsPropertyDescriptors);
    Object.defineProperties(EventSource.prototype, constantsPropertyDescriptors);
    Object.defineProperties(EventSource.prototype, {
      close: kEnumerableProperty,
      onerror: kEnumerableProperty,
      onmessage: kEnumerableProperty,
      onopen: kEnumerableProperty,
      readyState: kEnumerableProperty,
      url: kEnumerableProperty,
      withCredentials: kEnumerableProperty
    });
    webidl.converters.EventSourceInitDict = webidl.dictionaryConverter([
      {
        key: "withCredentials",
        converter: webidl.converters.boolean,
        defaultValue: /* @__PURE__ */ __name(() => false, "defaultValue")
      },
      {
        key: "dispatcher",
        // undici only
        converter: webidl.converters.any
      },
      {
        key: "node",
        // undici only
        converter: webidl.dictionaryConverter([
          {
            key: "reconnectionTime",
            converter: webidl.converters["unsigned long"],
            defaultValue: /* @__PURE__ */ __name(() => defaultReconnectionTime, "defaultValue")
          },
          {
            key: "dispatcher",
            converter: webidl.converters.any
          }
        ]),
        defaultValue: /* @__PURE__ */ __name(() => ({}), "defaultValue")
      }
    ]);
    module2.exports = {
      EventSource,
      defaultReconnectionTime
    };
  }
});

// lib/api/readable.js
var require_readable = __commonJS({
  "lib/api/readable.js"(exports2, module2) {
    "use strict";
    var assert = require("node:assert");
    var { Readable } = require("node:stream");
    var { RequestAbortedError, NotSupportedError, InvalidArgumentError, AbortError } = require_errors();
    var util = require_util();
    var { ReadableStreamFrom } = require_util();
    var kConsume = /* @__PURE__ */ Symbol("kConsume");
    var kReading = /* @__PURE__ */ Symbol("kReading");
    var kBody = /* @__PURE__ */ Symbol("kBody");
    var kAbort = /* @__PURE__ */ Symbol("kAbort");
    var kContentType = /* @__PURE__ */ Symbol("kContentType");
    var kContentLength = /* @__PURE__ */ Symbol("kContentLength");
    var kUsed = /* @__PURE__ */ Symbol("kUsed");
    var kBytesRead = /* @__PURE__ */ Symbol("kBytesRead");
    var noop = /* @__PURE__ */ __name(() => {
    }, "noop");
    var BodyReadable = class extends Readable {
      static {
        __name(this, "BodyReadable");
      }
      /**
       * @param {object} opts
       * @param {(this: Readable, size: number) => void} opts.resume
       * @param {() => (void | null)} opts.abort
       * @param {string} [opts.contentType = '']
       * @param {number} [opts.contentLength]
       * @param {number} [opts.highWaterMark = 64 * 1024]
       */
      constructor({
        resume,
        abort,
        contentType = "",
        contentLength,
        highWaterMark = 64 * 1024
        // Same as nodejs fs streams.
      }) {
        super({
          autoDestroy: true,
          read: resume,
          highWaterMark
        });
        this._readableState.dataEmitted = false;
        this[kAbort] = abort;
        this[kConsume] = null;
        this[kBytesRead] = 0;
        this[kBody] = null;
        this[kUsed] = false;
        this[kContentType] = contentType;
        this[kContentLength] = Number.isFinite(contentLength) ? contentLength : null;
        this[kReading] = false;
      }
      /**
       * @param {Error|null} err
       * @param {(error:(Error|null)) => void} callback
       * @returns {void}
       */
      _destroy(err, callback) {
        if (!err && !this._readableState.endEmitted) {
          err = new RequestAbortedError();
        }
        if (err) {
          this[kAbort]();
        }
        if (!this[kUsed]) {
          setImmediate(callback, err);
        } else {
          callback(err);
        }
      }
      /**
       * @param {string|symbol} event
       * @param {(...args: any[]) => void} listener
       * @returns {this}
       */
      on(event, listener) {
        if (event === "data" || event === "readable") {
          this[kReading] = true;
          this[kUsed] = true;
        }
        return super.on(event, listener);
      }
      /**
       * @param {string|symbol} event
       * @param {(...args: any[]) => void} listener
       * @returns {this}
       */
      addListener(event, listener) {
        return this.on(event, listener);
      }
      /**
       * @param {string|symbol} event
       * @param {(...args: any[]) => void} listener
       * @returns {this}
       */
      off(event, listener) {
        const ret = super.off(event, listener);
        if (event === "data" || event === "readable") {
          this[kReading] = this.listenerCount("data") > 0 || this.listenerCount("readable") > 0;
        }
        return ret;
      }
      /**
       * @param {string|symbol} event
       * @param {(...args: any[]) => void} listener
       * @returns {this}
       */
      removeListener(event, listener) {
        return this.off(event, listener);
      }
      /**
       * @param {Buffer|null} chunk
       * @returns {boolean}
       */
      push(chunk) {
        if (chunk) {
          this[kBytesRead] += chunk.length;
          if (this[kConsume]) {
            consumePush(this[kConsume], chunk);
            return this[kReading] ? super.push(chunk) : true;
          }
        }
        return super.push(chunk);
      }
      /**
       * Consumes and returns the body as a string.
       *
       * @see https://fetch.spec.whatwg.org/#dom-body-text
       * @returns {Promise<string>}
       */
      text() {
        return consume(this, "text");
      }
      /**
       * Consumes and returns the body as a JavaScript Object.
       *
       * @see https://fetch.spec.whatwg.org/#dom-body-json
       * @returns {Promise<unknown>}
       */
      json() {
        return consume(this, "json");
      }
      /**
       * Consumes and returns the body as a Blob
       *
       * @see https://fetch.spec.whatwg.org/#dom-body-blob
       * @returns {Promise<Blob>}
       */
      blob() {
        return consume(this, "blob");
      }
      /**
       * Consumes and returns the body as an Uint8Array.
       *
       * @see https://fetch.spec.whatwg.org/#dom-body-bytes
       * @returns {Promise<Uint8Array>}
       */
      bytes() {
        return consume(this, "bytes");
      }
      /**
       * Consumes and returns the body as an ArrayBuffer.
       *
       * @see https://fetch.spec.whatwg.org/#dom-body-arraybuffer
       * @returns {Promise<ArrayBuffer>}
       */
      arrayBuffer() {
        return consume(this, "arrayBuffer");
      }
      /**
       * Not implemented
       *
       * @see https://fetch.spec.whatwg.org/#dom-body-formdata
       * @throws {NotSupportedError}
       */
      async formData() {
        throw new NotSupportedError();
      }
      /**
       * Returns true if the body is not null and the body has been consumed.
       * Otherwise, returns false.
       *
       * @see https://fetch.spec.whatwg.org/#dom-body-bodyused
       * @readonly
       * @returns {boolean}
       */
      get bodyUsed() {
        return util.isDisturbed(this);
      }
      /**
       * @see https://fetch.spec.whatwg.org/#dom-body-body
       * @readonly
       * @returns {ReadableStream}
       */
      get body() {
        if (!this[kBody]) {
          this[kBody] = ReadableStreamFrom(this);
          if (this[kConsume]) {
            this[kBody].getReader();
            assert(this[kBody].locked);
          }
        }
        return this[kBody];
      }
      /**
       * Dumps the response body by reading `limit` number of bytes.
       * @param {object} opts
       * @param {number} [opts.limit = 131072] Number of bytes to read.
       * @param {AbortSignal} [opts.signal] An AbortSignal to cancel the dump.
       * @returns {Promise<null>}
       */
      dump(opts) {
        const signal = opts?.signal;
        if (signal != null && (typeof signal !== "object" || !("aborted" in signal))) {
          return Promise.reject(new InvalidArgumentError("signal must be an AbortSignal"));
        }
        const limit = opts?.limit && Number.isFinite(opts.limit) ? opts.limit : 128 * 1024;
        if (signal?.aborted) {
          return Promise.reject(signal.reason ?? new AbortError());
        }
        if (this._readableState.closeEmitted) {
          return Promise.resolve(null);
        }
        return new Promise((resolve, reject) => {
          if (this[kContentLength] && this[kContentLength] > limit || this[kBytesRead] > limit) {
            this.destroy(new AbortError());
          }
          if (signal) {
            const onAbort = /* @__PURE__ */ __name(() => {
              this.destroy(signal.reason ?? new AbortError());
            }, "onAbort");
            signal.addEventListener("abort", onAbort);
            this.on("close", function() {
              signal.removeEventListener("abort", onAbort);
              if (signal.aborted) {
                reject(signal.reason ?? new AbortError());
              } else {
                resolve(null);
              }
            });
          } else {
            this.on("close", resolve);
          }
          this.on("error", noop).on("data", () => {
            if (this[kBytesRead] > limit) {
              this.destroy();
            }
          }).resume();
        });
      }
      /**
       * @param {BufferEncoding} encoding
       * @returns {this}
       */
      setEncoding(encoding) {
        if (Buffer.isEncoding(encoding)) {
          this._readableState.encoding = encoding;
        }
        return this;
      }
    };
    function isLocked(bodyReadable) {
      return bodyReadable[kBody]?.locked === true || bodyReadable[kConsume] !== null;
    }
    __name(isLocked, "isLocked");
    function isUnusable(bodyReadable) {
      return util.isDisturbed(bodyReadable) || isLocked(bodyReadable);
    }
    __name(isUnusable, "isUnusable");
    function consume(stream, type) {
      assert(!stream[kConsume]);
      return new Promise((resolve, reject) => {
        if (isUnusable(stream)) {
          const rState = stream._readableState;
          if (rState.destroyed && rState.closeEmitted === false) {
            stream.on("error", reject).on("close", () => {
              reject(new TypeError("unusable"));
            });
          } else {
            reject(rState.errored ?? new TypeError("unusable"));
          }
        } else {
          queueMicrotask(() => {
            stream[kConsume] = {
              type,
              stream,
              resolve,
              reject,
              length: 0,
              body: []
            };
            stream.on("error", function(err) {
              consumeFinish(this[kConsume], err);
            }).on("close", function() {
              if (this[kConsume].body !== null) {
                consumeFinish(this[kConsume], new RequestAbortedError());
              }
            });
            consumeStart(stream[kConsume]);
          });
        }
      });
    }
    __name(consume, "consume");
    function consumeStart(consume2) {
      if (consume2.body === null) {
        return;
      }
      const { _readableState: state } = consume2.stream;
      if (state.bufferIndex) {
        const start = state.bufferIndex;
        const end = state.buffer.length;
        for (let n = start; n < end; n++) {
          consumePush(consume2, state.buffer[n]);
        }
      } else {
        for (const chunk of state.buffer) {
          consumePush(consume2, chunk);
        }
      }
      if (state.endEmitted) {
        consumeEnd(this[kConsume], this._readableState.encoding);
      } else {
        consume2.stream.on("end", function() {
          consumeEnd(this[kConsume], this._readableState.encoding);
        });
      }
      consume2.stream.resume();
      while (consume2.stream.read() != null) {
      }
    }
    __name(consumeStart, "consumeStart");
    function chunksDecode(chunks, length, encoding) {
      if (chunks.length === 0 || length === 0) {
        return "";
      }
      const buffer = chunks.length === 1 ? chunks[0] : Buffer.concat(chunks, length);
      const bufferLength = buffer.length;
      const start = bufferLength > 2 && buffer[0] === 239 && buffer[1] === 187 && buffer[2] === 191 ? 3 : 0;
      if (!encoding || encoding === "utf8" || encoding === "utf-8") {
        return buffer.utf8Slice(start, bufferLength);
      } else {
        return buffer.subarray(start, bufferLength).toString(encoding);
      }
    }
    __name(chunksDecode, "chunksDecode");
    function chunksConcat(chunks, length) {
      if (chunks.length === 0 || length === 0) {
        return new Uint8Array(0);
      }
      if (chunks.length === 1) {
        return new Uint8Array(chunks[0]);
      }
      const buffer = new Uint8Array(Buffer.allocUnsafeSlow(length).buffer);
      let offset = 0;
      for (let i = 0; i < chunks.length; ++i) {
        const chunk = chunks[i];
        buffer.set(chunk, offset);
        offset += chunk.length;
      }
      return buffer;
    }
    __name(chunksConcat, "chunksConcat");
    function consumeEnd(consume2, encoding) {
      const { type, body, resolve, stream, length } = consume2;
      try {
        if (type === "text") {
          resolve(chunksDecode(body, length, encoding));
        } else if (type === "json") {
          resolve(JSON.parse(chunksDecode(body, length, encoding)));
        } else if (type === "arrayBuffer") {
          resolve(chunksConcat(body, length).buffer);
        } else if (type === "blob") {
          resolve(new Blob(body, { type: stream[kContentType] }));
        } else if (type === "bytes") {
          resolve(chunksConcat(body, length));
        }
        consumeFinish(consume2);
      } catch (err) {
        stream.destroy(err);
      }
    }
    __name(consumeEnd, "consumeEnd");
    function consumePush(consume2, chunk) {
      consume2.length += chunk.length;
      consume2.body.push(chunk);
    }
    __name(consumePush, "consumePush");
    function consumeFinish(consume2, err) {
      if (consume2.body === null) {
        return;
      }
      if (err) {
        consume2.reject(err);
      } else {
        consume2.resolve();
      }
      consume2.type = null;
      consume2.stream = null;
      consume2.resolve = null;
      consume2.reject = null;
      consume2.length = 0;
      consume2.body = null;
    }
    __name(consumeFinish, "consumeFinish");
    module2.exports = {
      Readable: BodyReadable,
      chunksDecode
    };
  }
});

// lib/api/api-request.js
var require_api_request = __commonJS({
  "lib/api/api-request.js"(exports2, module2) {
    "use strict";
    var assert = require("node:assert");
    var { AsyncResource } = require("node:async_hooks");
    var { Readable } = require_readable();
    var { InvalidArgumentError, RequestAbortedError } = require_errors();
    var util = require_util();
    function noop() {
    }
    __name(noop, "noop");
    var RequestHandler = class extends AsyncResource {
      static {
        __name(this, "RequestHandler");
      }
      constructor(opts, callback) {
        if (!opts || typeof opts !== "object") {
          throw new InvalidArgumentError("invalid opts");
        }
        const { signal, method, opaque, body, onInfo, responseHeaders, highWaterMark } = opts;
        try {
          if (typeof callback !== "function") {
            throw new InvalidArgumentError("invalid callback");
          }
          if (highWaterMark && (typeof highWaterMark !== "number" || highWaterMark < 0)) {
            throw new InvalidArgumentError("invalid highWaterMark");
          }
          if (signal && typeof signal.on !== "function" && typeof signal.addEventListener !== "function") {
            throw new InvalidArgumentError("signal must be an EventEmitter or EventTarget");
          }
          if (method === "CONNECT") {
            throw new InvalidArgumentError("invalid method");
          }
          if (onInfo && typeof onInfo !== "function") {
            throw new InvalidArgumentError("invalid onInfo callback");
          }
          super("UNDICI_REQUEST");
        } catch (err) {
          if (util.isStream(body)) {
            util.destroy(body.on("error", noop), err);
          }
          throw err;
        }
        this.method = method;
        this.responseHeaders = responseHeaders || null;
        this.opaque = opaque || null;
        this.callback = callback;
        this.res = null;
        this.abort = null;
        this.body = body;
        this.trailers = {};
        this.context = null;
        this.onInfo = onInfo || null;
        this.highWaterMark = highWaterMark;
        this.reason = null;
        this.removeAbortListener = null;
        if (signal?.aborted) {
          this.reason = signal.reason ?? new RequestAbortedError();
        } else if (signal) {
          this.removeAbortListener = util.addAbortListener(signal, () => {
            this.reason = signal.reason ?? new RequestAbortedError();
            if (this.res) {
              util.destroy(this.res.on("error", noop), this.reason);
            } else if (this.abort) {
              this.abort(this.reason);
            }
          });
        }
      }
      onConnect(abort, context) {
        if (this.reason) {
          abort(this.reason);
          return;
        }
        assert(this.callback);
        this.abort = abort;
        this.context = context;
      }
      onHeaders(statusCode, rawHeaders, resume, statusMessage) {
        const { callback, opaque, abort, context, responseHeaders, highWaterMark } = this;
        const headers = responseHeaders === "raw" ? util.parseRawHeaders(rawHeaders) : util.parseHeaders(rawHeaders);
        if (statusCode < 200) {
          if (this.onInfo) {
            this.onInfo({ statusCode, headers });
          }
          return;
        }
        const parsedHeaders = responseHeaders === "raw" ? util.parseHeaders(rawHeaders) : headers;
        const contentType = parsedHeaders["content-type"];
        const contentLength = parsedHeaders["content-length"];
        const res = new Readable({
          resume,
          abort,
          contentType,
          contentLength: this.method !== "HEAD" && contentLength ? Number(contentLength) : null,
          highWaterMark
        });
        if (this.removeAbortListener) {
          res.on("close", this.removeAbortListener);
          this.removeAbortListener = null;
        }
        this.callback = null;
        this.res = res;
        if (callback !== null) {
          try {
            this.runInAsyncScope(callback, null, null, {
              statusCode,
              statusText: statusMessage,
              headers,
              trailers: this.trailers,
              opaque,
              body: res,
              context
            });
          } catch (err) {
            this.res = null;
            util.destroy(res.on("error", noop), err);
            queueMicrotask(() => {
              throw err;
            });
          }
        }
      }
      onData(chunk) {
        return this.res.push(chunk);
      }
      onComplete(trailers) {
        util.parseHeaders(trailers, this.trailers);
        this.res.push(null);
      }
      onError(err) {
        const { res, callback, body, opaque } = this;
        if (callback) {
          this.callback = null;
          queueMicrotask(() => {
            this.runInAsyncScope(callback, null, err, { opaque });
          });
        }
        if (res) {
          this.res = null;
          queueMicrotask(() => {
            util.destroy(res.on("error", noop), err);
          });
        }
        if (body) {
          this.body = null;
          if (util.isStream(body)) {
            body.on("error", noop);
            util.destroy(body, err);
          }
        }
        if (this.removeAbortListener) {
          this.removeAbortListener();
          this.removeAbortListener = null;
        }
      }
    };
    function request(opts, callback) {
      if (callback === void 0) {
        return new Promise((resolve, reject) => {
          request.call(this, opts, (err, data) => {
            return err ? reject(err) : resolve(data);
          });
        });
      }
      try {
        const handler = new RequestHandler(opts, callback);
        this.dispatch(opts, handler);
      } catch (err) {
        if (typeof callback !== "function") {
          throw err;
        }
        const opaque = opts?.opaque;
        queueMicrotask(() => callback(err, { opaque }));
      }
    }
    __name(request, "request");
    module2.exports = request;
    module2.exports.RequestHandler = RequestHandler;
  }
});

// lib/api/abort-signal.js
var require_abort_signal = __commonJS({
  "lib/api/abort-signal.js"(exports2, module2) {
    "use strict";
    var { addAbortListener } = require_util();
    var { RequestAbortedError } = require_errors();
    var kListener = /* @__PURE__ */ Symbol("kListener");
    var kSignal = /* @__PURE__ */ Symbol("kSignal");
    function abort(self) {
      if (self.abort) {
        self.abort(self[kSignal]?.reason);
      } else {
        self.reason = self[kSignal]?.reason ?? new RequestAbortedError();
      }
      removeSignal(self);
    }
    __name(abort, "abort");
    function addSignal(self, signal) {
      self.reason = null;
      self[kSignal] = null;
      self[kListener] = null;
      if (!signal) {
        return;
      }
      if (signal.aborted) {
        abort(self);
        return;
      }
      self[kSignal] = signal;
      self[kListener] = () => {
        abort(self);
      };
      addAbortListener(self[kSignal], self[kListener]);
    }
    __name(addSignal, "addSignal");
    function removeSignal(self) {
      if (!self[kSignal]) {
        return;
      }
      if ("removeEventListener" in self[kSignal]) {
        self[kSignal].removeEventListener("abort", self[kListener]);
      } else {
        self[kSignal].removeListener("abort", self[kListener]);
      }
      self[kSignal] = null;
      self[kListener] = null;
    }
    __name(removeSignal, "removeSignal");
    module2.exports = {
      addSignal,
      removeSignal
    };
  }
});

// lib/api/api-stream.js
var require_api_stream = __commonJS({
  "lib/api/api-stream.js"(exports2, module2) {
    "use strict";
    var assert = require("node:assert");
    var { finished } = require("node:stream");
    var { AsyncResource } = require("node:async_hooks");
    var { InvalidArgumentError, InvalidReturnValueError } = require_errors();
    var util = require_util();
    var { addSignal, removeSignal } = require_abort_signal();
    function noop() {
    }
    __name(noop, "noop");
    var StreamHandler = class extends AsyncResource {
      static {
        __name(this, "StreamHandler");
      }
      constructor(opts, factory, callback) {
        if (!opts || typeof opts !== "object") {
          throw new InvalidArgumentError("invalid opts");
        }
        const { signal, method, opaque, body, onInfo, responseHeaders } = opts;
        try {
          if (typeof callback !== "function") {
            throw new InvalidArgumentError("invalid callback");
          }
          if (typeof factory !== "function") {
            throw new InvalidArgumentError("invalid factory");
          }
          if (signal && typeof signal.on !== "function" && typeof signal.addEventListener !== "function") {
            throw new InvalidArgumentError("signal must be an EventEmitter or EventTarget");
          }
          if (method === "CONNECT") {
            throw new InvalidArgumentError("invalid method");
          }
          if (onInfo && typeof onInfo !== "function") {
            throw new InvalidArgumentError("invalid onInfo callback");
          }
          super("UNDICI_STREAM");
        } catch (err) {
          if (util.isStream(body)) {
            util.destroy(body.on("error", noop), err);
          }
          throw err;
        }
        this.responseHeaders = responseHeaders || null;
        this.opaque = opaque || null;
        this.factory = factory;
        this.callback = callback;
        this.res = null;
        this.abort = null;
        this.context = null;
        this.trailers = null;
        this.body = body;
        this.onInfo = onInfo || null;
        if (util.isStream(body)) {
          body.on("error", (err) => {
            this.onError(err);
          });
        }
        addSignal(this, signal);
      }
      onConnect(abort, context) {
        if (this.reason) {
          abort(this.reason);
          return;
        }
        assert(this.callback);
        this.abort = abort;
        this.context = context;
      }
      onHeaders(statusCode, rawHeaders, resume, statusMessage) {
        const { factory, opaque, context, responseHeaders } = this;
        const headers = responseHeaders === "raw" ? util.parseRawHeaders(rawHeaders) : util.parseHeaders(rawHeaders);
        if (statusCode < 200) {
          if (this.onInfo) {
            this.onInfo({ statusCode, headers });
          }
          return;
        }
        this.factory = null;
        if (factory === null) {
          return;
        }
        const res = this.runInAsyncScope(factory, null, {
          statusCode,
          headers,
          opaque,
          context
        });
        if (!res || typeof res.write !== "function" || typeof res.end !== "function" || typeof res.on !== "function") {
          throw new InvalidReturnValueError("expected Writable");
        }
        finished(res, { readable: false }, (err) => {
          const { callback, res: res2, opaque: opaque2, trailers, abort } = this;
          this.res = null;
          if (err || !res2?.readable) {
            util.destroy(res2, err);
          }
          this.callback = null;
          this.runInAsyncScope(callback, null, err || null, { opaque: opaque2, trailers });
          if (err) {
            abort();
          }
        });
        res.on("drain", resume);
        this.res = res;
        const needDrain = res.writableNeedDrain !== void 0 ? res.writableNeedDrain : res._writableState?.needDrain;
        return needDrain !== true;
      }
      onData(chunk) {
        const { res } = this;
        return res ? res.write(chunk) : true;
      }
      onComplete(trailers) {
        const { res } = this;
        removeSignal(this);
        if (!res) {
          return;
        }
        this.trailers = util.parseHeaders(trailers);
        res.end();
      }
      onError(err) {
        const { res, callback, opaque, body } = this;
        removeSignal(this);
        this.factory = null;
        if (res) {
          this.res = null;
          util.destroy(res, err);
        } else if (callback) {
          this.callback = null;
          queueMicrotask(() => {
            this.runInAsyncScope(callback, null, err, { opaque });
          });
        }
        if (body) {
          this.body = null;
          util.destroy(body, err);
        }
      }
    };
    function stream(opts, factory, callback) {
      if (callback === void 0) {
        return new Promise((resolve, reject) => {
          stream.call(this, opts, factory, (err, data) => {
            return err ? reject(err) : resolve(data);
          });
        });
      }
      try {
        const handler = new StreamHandler(opts, factory, callback);
        this.dispatch(opts, handler);
      } catch (err) {
        if (typeof callback !== "function") {
          throw err;
        }
        const opaque = opts?.opaque;
        queueMicrotask(() => callback(err, { opaque }));
      }
    }
    __name(stream, "stream");
    module2.exports = stream;
  }
});

// lib/api/api-pipeline.js
var require_api_pipeline = __commonJS({
  "lib/api/api-pipeline.js"(exports2, module2) {
    "use strict";
    var {
      Readable,
      Duplex,
      PassThrough
    } = require("node:stream");
    var assert = require("node:assert");
    var { AsyncResource } = require("node:async_hooks");
    var {
      InvalidArgumentError,
      InvalidReturnValueError,
      RequestAbortedError
    } = require_errors();
    var util = require_util();
    var { addSignal, removeSignal } = require_abort_signal();
    function noop() {
    }
    __name(noop, "noop");
    var kResume = /* @__PURE__ */ Symbol("resume");
    var PipelineRequest = class extends Readable {
      static {
        __name(this, "PipelineRequest");
      }
      constructor() {
        super({ autoDestroy: true });
        this[kResume] = null;
      }
      _read() {
        const { [kResume]: resume } = this;
        if (resume) {
          this[kResume] = null;
          resume();
        }
      }
      _destroy(err, callback) {
        this._read();
        callback(err);
      }
    };
    var PipelineResponse = class extends Readable {
      static {
        __name(this, "PipelineResponse");
      }
      constructor(resume) {
        super({ autoDestroy: true });
        this[kResume] = resume;
      }
      _read() {
        this[kResume]();
      }
      _destroy(err, callback) {
        if (!err && !this._readableState.endEmitted) {
          err = new RequestAbortedError();
        }
        callback(err);
      }
    };
    var PipelineHandler = class extends AsyncResource {
      static {
        __name(this, "PipelineHandler");
      }
      constructor(opts, handler) {
        if (!opts || typeof opts !== "object") {
          throw new InvalidArgumentError("invalid opts");
        }
        if (typeof handler !== "function") {
          throw new InvalidArgumentError("invalid handler");
        }
        const { signal, method, opaque, onInfo, responseHeaders } = opts;
        if (signal && typeof signal.on !== "function" && typeof signal.addEventListener !== "function") {
          throw new InvalidArgumentError("signal must be an EventEmitter or EventTarget");
        }
        if (method === "CONNECT") {
          throw new InvalidArgumentError("invalid method");
        }
        if (onInfo && typeof onInfo !== "function") {
          throw new InvalidArgumentError("invalid onInfo callback");
        }
        super("UNDICI_PIPELINE");
        this.opaque = opaque || null;
        this.responseHeaders = responseHeaders || null;
        this.handler = handler;
        this.abort = null;
        this.context = null;
        this.onInfo = onInfo || null;
        this.req = new PipelineRequest().on("error", noop);
        this.ret = new Duplex({
          readableObjectMode: opts.objectMode,
          autoDestroy: true,
          read: /* @__PURE__ */ __name(() => {
            const { body } = this;
            if (body?.resume) {
              body.resume();
            }
          }, "read"),
          write: /* @__PURE__ */ __name((chunk, encoding, callback) => {
            const { req } = this;
            if (req.push(chunk, encoding) || req._readableState.destroyed) {
              callback();
            } else {
              req[kResume] = callback;
            }
          }, "write"),
          destroy: /* @__PURE__ */ __name((err, callback) => {
            const { body, req, res, ret, abort } = this;
            if (!err && !ret._readableState.endEmitted) {
              err = new RequestAbortedError();
            }
            if (abort && err) {
              abort();
            }
            util.destroy(body, err);
            util.destroy(req, err);
            util.destroy(res, err);
            removeSignal(this);
            callback(err);
          }, "destroy")
        }).on("prefinish", () => {
          const { req } = this;
          req.push(null);
        });
        this.res = null;
        addSignal(this, signal);
      }
      onConnect(abort, context) {
        const { res } = this;
        if (this.reason) {
          abort(this.reason);
          return;
        }
        assert(!res, "pipeline cannot be retried");
        this.abort = abort;
        this.context = context;
      }
      onHeaders(statusCode, rawHeaders, resume) {
        const { opaque, handler, context } = this;
        if (statusCode < 200) {
          if (this.onInfo) {
            const headers = this.responseHeaders === "raw" ? util.parseRawHeaders(rawHeaders) : util.parseHeaders(rawHeaders);
            this.onInfo({ statusCode, headers });
          }
          return;
        }
        this.res = new PipelineResponse(resume);
        let body;
        try {
          this.handler = null;
          const headers = this.responseHeaders === "raw" ? util.parseRawHeaders(rawHeaders) : util.parseHeaders(rawHeaders);
          body = this.runInAsyncScope(handler, null, {
            statusCode,
            headers,
            opaque,
            body: this.res,
            context
          });
        } catch (err) {
          this.res.on("error", noop);
          throw err;
        }
        if (!body || typeof body.on !== "function") {
          throw new InvalidReturnValueError("expected Readable");
        }
        body.on("data", (chunk) => {
          const { ret, body: body2 } = this;
          if (!ret.push(chunk) && body2.pause) {
            body2.pause();
          }
        }).on("error", (err) => {
          const { ret } = this;
          util.destroy(ret, err);
        }).on("end", () => {
          const { ret } = this;
          ret.push(null);
        }).on("close", () => {
          const { ret } = this;
          if (!ret._readableState.ended) {
            util.destroy(ret, new RequestAbortedError());
          }
        });
        this.body = body;
      }
      onData(chunk) {
        const { res } = this;
        return res.push(chunk);
      }
      onComplete(trailers) {
        const { res } = this;
        res.push(null);
      }
      onError(err) {
        const { ret } = this;
        this.handler = null;
        util.destroy(ret, err);
      }
    };
    function pipeline(opts, handler) {
      try {
        const pipelineHandler = new PipelineHandler(opts, handler);
        this.dispatch({ ...opts, body: pipelineHandler.req }, pipelineHandler);
        return pipelineHandler.ret;
      } catch (err) {
        return new PassThrough().destroy(err);
      }
    }
    __name(pipeline, "pipeline");
    module2.exports = pipeline;
  }
});

// lib/api/api-upgrade.js
var require_api_upgrade = __commonJS({
  "lib/api/api-upgrade.js"(exports2, module2) {
    "use strict";
    var { InvalidArgumentError, SocketError } = require_errors();
    var { AsyncResource } = require("node:async_hooks");
    var assert = require("node:assert");
    var util = require_util();
    var { kHTTP2Stream } = require_symbols();
    var { addSignal, removeSignal } = require_abort_signal();
    var UpgradeHandler = class extends AsyncResource {
      static {
        __name(this, "UpgradeHandler");
      }
      constructor(opts, callback) {
        if (!opts || typeof opts !== "object") {
          throw new InvalidArgumentError("invalid opts");
        }
        if (typeof callback !== "function") {
          throw new InvalidArgumentError("invalid callback");
        }
        const { signal, opaque, responseHeaders } = opts;
        if (signal && typeof signal.on !== "function" && typeof signal.addEventListener !== "function") {
          throw new InvalidArgumentError("signal must be an EventEmitter or EventTarget");
        }
        super("UNDICI_UPGRADE");
        this.responseHeaders = responseHeaders || null;
        this.opaque = opaque || null;
        this.callback = callback;
        this.abort = null;
        this.context = null;
        addSignal(this, signal);
      }
      onConnect(abort, context) {
        if (this.reason) {
          abort(this.reason);
          return;
        }
        assert(this.callback);
        this.abort = abort;
        this.context = null;
      }
      onHeaders() {
        throw new SocketError("bad upgrade", null);
      }
      onUpgrade(statusCode, rawHeaders, socket) {
        assert(socket[kHTTP2Stream] === true ? statusCode === 200 : statusCode === 101);
        const { callback, opaque, context } = this;
        removeSignal(this);
        this.callback = null;
        const headers = this.responseHeaders === "raw" ? util.parseRawHeaders(rawHeaders) : util.parseHeaders(rawHeaders);
        this.runInAsyncScope(callback, null, null, {
          headers,
          socket,
          opaque,
          context
        });
      }
      onError(err) {
        const { callback, opaque } = this;
        removeSignal(this);
        if (callback) {
          this.callback = null;
          queueMicrotask(() => {
            this.runInAsyncScope(callback, null, err, { opaque });
          });
        }
      }
    };
    function upgrade(opts, callback) {
      if (callback === void 0) {
        return new Promise((resolve, reject) => {
          upgrade.call(this, opts, (err, data) => {
            return err ? reject(err) : resolve(data);
          });
        });
      }
      try {
        const upgradeHandler = new UpgradeHandler(opts, callback);
        const upgradeOpts = {
          ...opts,
          method: opts.method || "GET",
          upgrade: opts.protocol || "Websocket"
        };
        this.dispatch(upgradeOpts, upgradeHandler);
      } catch (err) {
        if (typeof callback !== "function") {
          throw err;
        }
        const opaque = opts?.opaque;
        queueMicrotask(() => callback(err, { opaque }));
      }
    }
    __name(upgrade, "upgrade");
    module2.exports = upgrade;
  }
});

// lib/api/api-connect.js
var require_api_connect = __commonJS({
  "lib/api/api-connect.js"(exports2, module2) {
    "use strict";
    var assert = require("node:assert");
    var { AsyncResource } = require("node:async_hooks");
    var { InvalidArgumentError, SocketError } = require_errors();
    var util = require_util();
    var { addSignal, removeSignal } = require_abort_signal();
    var ConnectHandler = class extends AsyncResource {
      static {
        __name(this, "ConnectHandler");
      }
      constructor(opts, callback) {
        if (!opts || typeof opts !== "object") {
          throw new InvalidArgumentError("invalid opts");
        }
        if (typeof callback !== "function") {
          throw new InvalidArgumentError("invalid callback");
        }
        const { signal, opaque, responseHeaders } = opts;
        if (signal && typeof signal.on !== "function" && typeof signal.addEventListener !== "function") {
          throw new InvalidArgumentError("signal must be an EventEmitter or EventTarget");
        }
        super("UNDICI_CONNECT");
        this.opaque = opaque || null;
        this.responseHeaders = responseHeaders || null;
        this.callback = callback;
        this.abort = null;
        addSignal(this, signal);
      }
      onConnect(abort, context) {
        if (this.reason) {
          abort(this.reason);
          return;
        }
        assert(this.callback);
        this.abort = abort;
        this.context = context;
      }
      onHeaders() {
        throw new SocketError("bad connect", null);
      }
      onUpgrade(statusCode, rawHeaders, socket) {
        const { callback, opaque, context } = this;
        removeSignal(this);
        this.callback = null;
        let headers = rawHeaders;
        if (headers != null) {
          headers = this.responseHeaders === "raw" ? util.parseRawHeaders(rawHeaders) : util.parseHeaders(rawHeaders);
        }
        this.runInAsyncScope(callback, null, null, {
          statusCode,
          headers,
          socket,
          opaque,
          context
        });
      }
      onError(err) {
        const { callback, opaque } = this;
        removeSignal(this);
        if (callback) {
          this.callback = null;
          queueMicrotask(() => {
            this.runInAsyncScope(callback, null, err, { opaque });
          });
        }
      }
    };
    function connect(opts, callback) {
      if (callback === void 0) {
        return new Promise((resolve, reject) => {
          connect.call(this, opts, (err, data) => {
            return err ? reject(err) : resolve(data);
          });
        });
      }
      try {
        const connectHandler = new ConnectHandler(opts, callback);
        const connectOptions = { ...opts, method: "CONNECT" };
        this.dispatch(connectOptions, connectHandler);
      } catch (err) {
        if (typeof callback !== "function") {
          throw err;
        }
        const opaque = opts?.opaque;
        queueMicrotask(() => callback(err, { opaque }));
      }
    }
    __name(connect, "connect");
    module2.exports = connect;
  }
});

// lib/api/index.js
var require_api = __commonJS({
  "lib/api/index.js"(exports2, module2) {
    "use strict";
    module2.exports.request = require_api_request();
    module2.exports.stream = require_api_stream();
    module2.exports.pipeline = require_api_pipeline();
    module2.exports.upgrade = require_api_upgrade();
    module2.exports.connect = require_api_connect();
  }
});

// index-fetch.js
var { getGlobalDispatcher, setGlobalDispatcher } = require_global2();
var EnvHttpProxyAgent = require_env_http_proxy_agent();
var fetchImpl = require_fetch().fetch;
var currentFilename = typeof __filename !== "undefined" ? __filename : void 0;
function appendFetchStackTrace(err, filename) {
  if (!err || typeof err !== "object") {
    return;
  }
  const stack = typeof err.stack === "string" ? err.stack : "";
  const normalizedFilename = filename.replace(/\\/g, "/");
  if (stack && (stack.includes(filename) || stack.includes(normalizedFilename))) {
    return;
  }
  const capture = {};
  Error.captureStackTrace(capture, appendFetchStackTrace);
  if (!capture.stack) {
    return;
  }
  const captureLines = capture.stack.split("\n").slice(1).join("\n");
  err.stack = stack ? `${stack}
${captureLines}` : capture.stack;
}
__name(appendFetchStackTrace, "appendFetchStackTrace");
module.exports.fetch = /* @__PURE__ */ __name(function fetch(init, options = void 0) {
  return fetchImpl(init, options).catch((err) => {
    if (currentFilename) {
      appendFetchStackTrace(err, currentFilename);
    } else if (err && typeof err === "object") {
      Error.captureStackTrace(err, module.exports.fetch);
    }
    throw err;
  });
}, "fetch");
module.exports.FormData = require_formdata().FormData;
module.exports.Headers = require_headers().Headers;
module.exports.Response = require_response().Response;
module.exports.Request = require_request2().Request;
var { CloseEvent, ErrorEvent, MessageEvent, createFastMessageEvent } = require_events();
module.exports.WebSocket = require_websocket().WebSocket;
module.exports.CloseEvent = CloseEvent;
module.exports.ErrorEvent = ErrorEvent;
module.exports.MessageEvent = MessageEvent;
module.exports.createFastMessageEvent = createFastMessageEvent;
module.exports.EventSource = require_eventsource().EventSource;
var api = require_api();
var Dispatcher = require_dispatcher();
Object.assign(Dispatcher.prototype, api);
module.exports.EnvHttpProxyAgent = EnvHttpProxyAgent;
module.exports.getGlobalDispatcher = getGlobalDispatcher;
module.exports.setGlobalDispatcher = setGlobalDispatcher;
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! ws. MIT License. Einar Otto Stangvik <einaros@gmail.com> */
