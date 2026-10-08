// An HTTP/1.1 server whose JavaScript layer is fed in batches.
//
// Sockets, TLS and llhttp live here. Every request head and body chunk parsed
// during one event loop iteration is appended to a flat little-endian outbox,
// and a single call into JavaScript delivers the whole batch from a check
// handle. JavaScript answers with one writeResponses() call carrying every
// response produced so far, which is written to the sockets before the call
// returns.
//
// Pipelined requests are parsed ahead, up to kMaxInflight per connection.
// Responses are written in request order: a response finished before the
// ones of earlier requests is buffered until its turn.
//
// Request head record (native -> JS):
//   u32 id, u8 flags, u8 method, u8 http_major, u8 http_minor,
//   u32 url_length, u16 header_count, u16 reserved, u32 connection_id,
//   url bytes, then
//   header_count times: u16 name (kKnownHeader | index, or the byte length
//   followed by the name), u32 value_length, value bytes.
// Body stream records (native -> JS): u32 id, u32 length, data.
//   Length 0 ends a request body. Lengths from kFirstMarker up are markers:
//   kBodyAbort        the request was abandoned (client gone, parse error).
//   kConnectionClosed id is a connection id; the connection is gone.
//   kDrain            id is a connection id; its write queue is empty.
//   kTimeout          id is a connection id; it was idle for its timeout.
//   kConnectionOpen   id is a connection id; a new connection.
//   kRawEnd           id is a connection id; the client ended a raw stream.
//   kSecureConnection id is a connection id; its TLS handshake completed.
//   The following markers are followed by u32 length and payload bytes:
//   kTrailers         trailer fields: u16 count, fields as in head records.
//   kClientError      id is a connection id; u32 bytes parsed, then
//                     "code\0reason\0" and the raw packet.
//   kRawData          id is a connection id; bytes of an upgraded stream.
//   kServername       id is a connection id; SNI name awaiting a context.
//   kKeylog           id is a connection id; one NSS key log line.
//   kTlsError         id is a connection id; "code\0message\0reason".
//   kDrop             id is 0; "local\0port\0remote\0port" of a connection
//                     refused because of maxConnections.
// Response record (JS -> native), padded to a multiple of 4 bytes:
//   u8 op, u8 flags, u16 status, u32 id, u32 head_length, u32 body_length,
//   head bytes (status line and user headers, CRLF terminated), body bytes.

#include "async_wrap-inl.h"
#if HAVE_OPENSSL
#include "crypto/crypto_common.h"
#include "crypto/crypto_context.h"
#endif
#include "base_object-inl.h"
#include "env-inl.h"
#include "llhttp.h"
#include "memory_tracker-inl.h"
#include "node_buffer.h"
#include "node_external_reference.h"
#include "node_internals.h"
#include "util-inl.h"
#include "uv.h"
#include "v8.h"

#include <cerrno>
#include <cstring>
#include <ctime>
#include <deque>
#include <string>
#include <unordered_map>
#include <vector>

#ifndef _WIN32
#include <unistd.h>  // dup()
#endif

#if HAVE_OPENSSL
#include <openssl/bio.h>
#include <openssl/err.h>
#include <openssl/ssl.h>
#endif

namespace node {
namespace http_batch {

using v8::Array;
using v8::ArrayBuffer;
using v8::ArrayBufferView;
using v8::BackingStore;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::HandleScope;
using v8::Integer;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Uint32;
using v8::Value;

constexpr size_t kSlabSize = 64 * 1024;
constexpr size_t kMaxPendingInput = 64 * 1024;
// Reading stops while this much response data waits for the client, like
// the flood protection of node:http.
constexpr size_t kMaxWriteBacklog = 64 * 1024;
constexpr size_t kMaxInflight = 32;
constexpr size_t kMaxChunkExtensionsSize = 16384;
constexpr size_t kHeadPrefix = 20;
constexpr size_t kResponsePrefix = 16;
constexpr uint16_t kKnownHeader = 0x8000;

constexpr uint32_t kBodyAbort = 0xFFFFFFFF;
constexpr uint32_t kConnectionClosed = 0xFFFFFFFE;
constexpr uint32_t kTrailers = 0xFFFFFFFD;
constexpr uint32_t kDrain = 0xFFFFFFFC;
constexpr uint32_t kTimeout = 0xFFFFFFFB;
constexpr uint32_t kConnectionOpen = 0xFFFFFFFA;
constexpr uint32_t kClientError = 0xFFFFFFF9;
constexpr uint32_t kRawData = 0xFFFFFFF8;
constexpr uint32_t kRawEnd = 0xFFFFFFF7;
constexpr uint32_t kServername = 0xFFFFFFF6;
constexpr uint32_t kKeylog = 0xFFFFFFF5;
constexpr uint32_t kTlsError = 0xFFFFFFF4;
constexpr uint32_t kDrop = 0xFFFFFFF3;
constexpr uint32_t kSecureConnection = 0xFFFFFFF2;

enum HeadFlags : uint8_t {
  kHasBody = 1 << 0,
  kUpgrade = 1 << 1,
  kKeepAlive = 1 << 2,
  kExpectContinue = 1 << 3,
  kHasExpect = 1 << 4,
};

enum ResponseOp : uint8_t {
  kOpHead = 1,
  kOpData = 2,
  kOpEnd = 3,
  kOpComplete = 4,
  kOpDestroy = 5,
  // Bytes already framed by JavaScript (node:http's ServerResponse).
  kOpRaw = 6,
  // Ends the connection once everything queued before is written. The id
  // field holds a connection id.
  kOpShutdown = 7,
  // Raw bytes for the connection whose id is in the id field: error replies
  // and upgraded streams.
  kOpConnectionRaw = 8,
};

enum ResponseFlags : uint8_t {
  kUserContentLength = 1 << 0,
  kUserTransferEncoding = 1 << 1,
  kUserDate = 1 << 2,
  kUserConnection = 1 << 3,
  kUserConnectionClose = 1 << 4,
};

enum ListenFlags : uint32_t {
  kListenIPv6Only = 1 << 0,
  kListenReusePort = 1 << 1,
  kListenReadableAll = 1 << 2,
  kListenWritableAll = 1 << 3,
};

// configure() flags. The plain batched API leaves them all off; the
// node:http compatible server delegates these decisions to JavaScript.
enum ServerFlags : uint32_t {
  kDelegateContinue = 1 << 0,
  kDelegateErrors = 1 << 1,
  kForwardBodyAfterResponse = 1 << 2,
  kAnnounceConnections = 1 << 3,
  kNoDelay = 1 << 4,
  kTcpKeepAlive = 1 << 5,
  kAnnounceSecure = 1 << 6,
};

// Same bits as node_http_parser.cc.
enum LenientFlags : uint32_t {
  kLenientHeaders = 1 << 0,
  kLenientChunkedLength = 1 << 1,
  kLenientKeepAlive = 1 << 2,
  kLenientTransferEncoding = 1 << 3,
  kLenientVersion = 1 << 4,
  kLenientDataAfterClose = 1 << 5,
  kLenientOptionalLFAfterCR = 1 << 6,
  kLenientOptionalCRLFAfterChunk = 1 << 7,
  kLenientOptionalCRBeforeLF = 1 << 8,
  kLenientSpacesAfterChunkSize = 1 << 9,
  kLenientHeaderValueRelaxed = 1 << 10,
};

// Request header names sent as an index instead of bytes. The order is part
// of the protocol: JavaScript gets the same list through the binding.
static const char* const kKnownHeaders[] = {
    "host",
    "user-agent",
    "accept",
    "accept-encoding",
    "accept-language",
    "connection",
    "content-length",
    "content-type",
    "cookie",
    "authorization",
    "cache-control",
    "origin",
    "referer",
    "upgrade",
    "transfer-encoding",
    "expect",
    "if-none-match",
    "if-modified-since",
    "x-forwarded-for",
    "x-forwarded-proto",
    "x-forwarded-host",
    "x-real-ip",
    "x-request-id",
    "pragma",
    "range",
    "accept-charset",
    "keep-alive",
    "te",
    "priority",
    "dnt",
    "upgrade-insecure-requests",
    "sec-fetch-dest",
    "sec-fetch-mode",
    "sec-fetch-site",
    "sec-fetch-user",
    "sec-ch-ua",
    "sec-ch-ua-mobile",
    "sec-ch-ua-platform",
};
constexpr size_t kExpectHeader = 15;
constexpr size_t kKnownHeaderCount = arraysize(kKnownHeaders);

static inline char ToLower(char c) {
  return (c >= 'A' && c <= 'Z') ? c + ('a' - 'A') : c;
}

static inline char ToUpper(char c) {
  return (c >= 'a' && c <= 'z') ? c - ('a' - 'A') : c;
}

// Names are matched with their case preserved, because rawHeaders keeps the
// case the client used. Every known header has two indexes: the lowercase
// name, then its Canonical-Case spelling at kKnownHeaderCount + index.
static const std::vector<std::string>& KnownHeaderNames() {
  static const std::vector<std::string> names = [] {
    std::vector<std::string> v;
    for (size_t i = 0; i < kKnownHeaderCount; i++)
      v.push_back(kKnownHeaders[i]);
    for (size_t i = 0; i < kKnownHeaderCount; i++) {
      std::string name = kKnownHeaders[i];
      for (size_t j = 0; j < name.size(); j++) {
        if (j == 0 || name[j - 1] == '-') name[j] = ToUpper(name[j]);
      }
      v.push_back(std::move(name));
    }
    return v;
  }();
  return names;
}

static int FindKnownHeader(const char* name, size_t len) {
  const std::vector<std::string>& names = KnownHeaderNames();
  for (size_t i = 0; i < names.size(); i++) {
    if (names[i].size() == len && memcmp(names[i].data(), name, len) == 0) {
      return static_cast<int>(i);
    }
  }
  return -1;
}

static inline void WriteU16(std::string* s, size_t pos, uint16_t v) {
  (*s)[pos] = static_cast<char>(v & 0xff);
  (*s)[pos + 1] = static_cast<char>(v >> 8);
}

static inline void WriteU32(std::string* s, size_t pos, uint32_t v) {
  (*s)[pos] = static_cast<char>(v & 0xff);
  (*s)[pos + 1] = static_cast<char>((v >> 8) & 0xff);
  (*s)[pos + 2] = static_cast<char>((v >> 16) & 0xff);
  (*s)[pos + 3] = static_cast<char>(v >> 24);
}

static inline void AppendU32(std::string* s, uint32_t v) {
  char b[4] = {static_cast<char>(v & 0xff),
               static_cast<char>((v >> 8) & 0xff),
               static_cast<char>((v >> 16) & 0xff),
               static_cast<char>(v >> 24)};
  s->append(b, 4);
}

static inline uint16_t ReadU16(const uint8_t* p) {
  return static_cast<uint16_t>(p[0] | (p[1] << 8));
}

static inline uint32_t ReadU32(const uint8_t* p) {
  return static_cast<uint32_t>(p[0]) | (static_cast<uint32_t>(p[1]) << 8) |
         (static_cast<uint32_t>(p[2]) << 16) |
         (static_cast<uint32_t>(p[3]) << 24);
}

static void AppendDecimal(std::string* s, uint64_t v) {
  char buf[24];
  size_t i = sizeof(buf);
  do {
    buf[--i] = static_cast<char>('0' + v % 10);
    v /= 10;
  } while (v != 0);
  s->append(buf + i, sizeof(buf) - i);
}

static void AppendHex(std::string* s, uint64_t v) {
  static const char digits[] = "0123456789abcdef";
  char buf[16];
  size_t i = sizeof(buf);
  do {
    buf[--i] = digits[v & 0xf];
    v >>= 4;
  } while (v != 0);
  s->append(buf + i, sizeof(buf) - i);
}

template <typename T>
static void FreeHandle(T* handle) {
  delete handle;
}

class BatchServer;

// One request whose response is not finished yet. The front exchange of a
// connection is the one being answered; the back one is the one being
// parsed.
struct Exchange {
  uint32_t id = 0;
  bool keep_alive = true;
  bool head_method = false;
  bool http10 = false;
  bool has_body = false;
  bool upgrade = false;
  bool request_complete = false;
  bool delivered = false;  // JavaScript has seen the head.
  bool response_started = false;
  bool response_no_body = false;
  bool chunked = false;
  bool response_done = false;
  bool close_after = false;  // The response ends the connection.
  std::string out;           // Response bytes waiting for earlier responses.
};

struct Connection {
  union {
    uv_tcp_t tcp;
    uv_pipe_t pipe;
  } h;
  llhttp_t parser;
  Environment* env;
  BatchServer* server;  // nullptr once the server is gone.
  Connection* prev = nullptr;
  Connection* next = nullptr;

  std::deque<Exchange> exchanges;
  std::string head;           // Request head record being built.
  std::string pending_input;  // Unparsed bytes while the parser is paused.
  std::string out;            // Bytes to write, staged during one call.
  const char* user_error = nullptr;  // "HPE_CODE:Reason" of our callbacks.
  std::string parse_error;           // "code\0reason\0" once parsing failed.

  size_t name_pos = 0;
  size_t value_pos = SIZE_MAX;
  size_t chunk_extensions = 0;
  int current_header = -1;
  uint32_t connection_id = 0;
  uint32_t url_length = 0;
  uint32_t header_bytes = 0;
  uint16_t header_count = 0;
  uint32_t writes_in_flight = 0;
  uint64_t last_active = 0;
  uint64_t message_start = 0;
  uint64_t accepted_at = 0;
  uint64_t timeout_ms = 0;
  uv_timer_t* timer = nullptr;

  bool is_pipe = false;
  bool seen_request = false;  // Bytes of a first request arrived.
  bool in_header_field = false;
  bool in_message = false;
  bool headers_done = false;  // Fields from now on are trailers.
  bool in_trailers = false;
  bool expect_continue = false;
  bool has_expect = false;
  bool paused = false;
  bool parse_stopped = false;  // Parse error, timeout or upgrade.
  bool reading = false;
  bool touched = false;
  bool shutdown_requested = false;
  bool closing = false;
  bool announced = false;    // JavaScript knows this connection.
  bool user_paused = false;  // JavaScript asked to stop reading.
  bool read_eof = false;     // The client ended its side.
  bool eof_grace = false;    // One more iteration to answer after EOF.
  bool in_eof_list = false;
  bool raw = false;          // Upgraded: bytes go to JavaScript as they are.
  bool raw_pending = false;  // Upgrade once the upgrade request completes.
  bool drain_wanted = false;
  bool write_paused = false;  // Too much response data queued.
  bool in_close_list = false;

#if HAVE_OPENSSL
  // TLS runs over memory BIOs: ciphertext read from the socket goes into
  // tls_in, ciphertext to send is drained from tls_out into `wire`.
  ncrypto::SSLPointer ssl;  // Owns the BIOs too.
  BIO* tls_in = nullptr;
  BIO* tls_out = nullptr;
  std::string wire;
  BaseObjectPtr<crypto::SecureContext> sni_context;
  uint64_t reneg_window_start = 0;
  uint32_t renegotiations = 0;
  bool tls_verified = false;
  bool handshake_done = false;
  bool sni_pending = false;
  bool sni_done = false;
  bool tls_attack = false;
  bool tls_error_reported = false;
  bool got_data = false;
#endif

  inline uv_stream_t* stream() { return reinterpret_cast<uv_stream_t*>(&h); }
  inline uv_handle_t* handle() { return reinterpret_cast<uv_handle_t*>(&h); }

  Exchange* Find(uint32_t id) {
    for (Exchange& ex : exchanges) {
      if (ex.id == id) return &ex;
    }
    return nullptr;
  }

  // Where the response bytes of `ex` go: straight to the socket for the
  // front exchange, buffered otherwise.
  std::string& Target(Exchange* ex) {
    return ex == &exchanges.front() ? out : ex->out;
  }

  bool CanParseMore() const;
  void Execute(const char* data, size_t len);
  void Feed(const char* data, size_t len);
  void Advance();
  void ResumeParsing();
  void OnParseError(llhttp_errno_t err, const char* data, size_t len);
  void StopParsing();
  void SwitchToRaw();
  void OnData(const char* data, size_t len);
  void StartReading();
  void StopReading();
  void FlushOut();
  void WriteWire(std::string* data);
  void CheckDrain();
  void Touch();
  void SetTimeout(uint64_t ms);
  void OnEof();
  void AbortAll();
  void Shutdown();
  void Close(bool notify);
  void FinishValue();
#if HAVE_OPENSSL
  void OnCiphertext(const char* data, size_t len);
  void ReportTlsError(const char* code, const char* message);
#endif

  static Connection* From(llhttp_t* p) {
    return static_cast<Connection*>(p->data);
  }
  static Connection* From(uv_handle_t* h) {
    return static_cast<Connection*>(h->data);
  }
};

// The listening server is an async resource like a net.Server handle
// (TCPSERVERWRAP): batches run in its context.
class BatchServer : public AsyncWrap {
 public:
  BatchServer(Environment* env,
              Local<Object> object,
              Local<Function> on_batch,
              Local<Function> on_close,
              std::shared_ptr<BackingStore> shared,
              char* shared_data,
              size_t shared_length);
  ~BatchServer() override;

  static void New(const FunctionCallbackInfo<Value>& args);
  static void Listen(const FunctionCallbackInfo<Value>& args);
  static void ListenPipe(const FunctionCallbackInfo<Value>& args);
  static void ListenFd(const FunctionCallbackInfo<Value>& args);
  static void Adopt(const FunctionCallbackInfo<Value>& args);
  static void GetSockName(const FunctionCallbackInfo<Value>& args);
  static void Apply(const FunctionCallbackInfo<Value>& args);
  static void Close(const FunctionCallbackInfo<Value>& args);
  static void CloseIdleConnections(const FunctionCallbackInfo<Value>& args);
  static void CloseAllConnections(const FunctionCallbackInfo<Value>& args);
  static void Ref(const FunctionCallbackInfo<Value>& args);
  static void Unref(const FunctionCallbackInfo<Value>& args);
  static void Configure(const FunctionCallbackInfo<Value>& args);
  static void SetTimeouts(const FunctionCallbackInfo<Value>& args);
  static void ConnectionCount(const FunctionCallbackInfo<Value>& args);
  static void Detach(const FunctionCallbackInfo<Value>& args);
  static void Upgrade(const FunctionCallbackInfo<Value>& args);
  static void CloseConnection(const FunctionCallbackInfo<Value>& args);
  static void PauseConnection(const FunctionCallbackInfo<Value>& args);
  static void ResumeConnection(const FunctionCallbackInfo<Value>& args);
  static void SetConnectionTimeout(const FunctionCallbackInfo<Value>& args);
  static void SetNoDelay(const FunctionCallbackInfo<Value>& args);
  static void SetKeepAlive(const FunctionCallbackInfo<Value>& args);
  static void WriteQueueSize(const FunctionCallbackInfo<Value>& args);
  static void WatchDrain(const FunctionCallbackInfo<Value>& args);
  static void ConnectionAddress(const FunctionCallbackInfo<Value>& args);
  static void SetSecureContext(const FunctionCallbackInfo<Value>& args);
  static void EnableSni(const FunctionCallbackInfo<Value>& args);
  static void SniDone(const FunctionCallbackInfo<Value>& args);
  static void EnableKeylog(const FunctionCallbackInfo<Value>& args);
  static void SetAlpnCallback(const FunctionCallbackInfo<Value>& args);
  static void SetRenegotiationLimit(const FunctionCallbackInfo<Value>& args);
  static void PeerCertificate(const FunctionCallbackInfo<Value>& args);
  static void PeerVerifyError(const FunctionCallbackInfo<Value>& args);
  static void TlsInfo(const FunctionCallbackInfo<Value>& args);

  void MemoryInfo(MemoryTracker* tracker) const override;
  SET_MEMORY_INFO_NAME(BatchServer)
  SET_SELF_SIZE(BatchServer)

  uint32_t NextId() {
    do {
      if (++next_id_ == 0) next_id_ = 1;
    } while (ids_.count(next_id_) != 0);
    return next_id_;
  }

  void PushHead(Connection* conn, uint32_t id) {
    heads_.append(conn->head);
    ids_[id] = conn;
    pushed_.push_back({conn, id});
    ScheduleFlush();
  }

  void PushRecord(uint32_t id, uint32_t marker) {
    AppendU32(&bodies_, id);
    AppendU32(&bodies_, marker);
    ScheduleFlush();
  }

  void PushRecord(uint32_t id,
                  uint32_t marker,
                  const char* data,
                  size_t len) {
    AppendU32(&bodies_, id);
    AppendU32(&bodies_, marker);
    AppendU32(&bodies_, static_cast<uint32_t>(len));
    bodies_.append(data, len);
    ScheduleFlush();
  }

  void PushBody(uint32_t id, const char* data, uint32_t len) {
    AppendU32(&bodies_, id);
    AppendU32(&bodies_, len);
    if (len != 0 && len != kBodyAbort) bodies_.append(data, len);
    ScheduleFlush();
  }

  void Announce(Connection* conn) {
    if (conn->announced) return;
    conn->announced = true;
    PushRecord(conn->connection_id, kConnectionOpen);
  }

  void AddEof(Connection* conn) {
    if (!conn->in_eof_list) {
      conn->in_eof_list = true;
      eof_.push_back(conn);
    }
    ScheduleFlush();
  }

  void RemoveEof(Connection* conn) {
    if (!conn->in_eof_list) return;
    conn->in_eof_list = false;
    for (size_t i = 0; i < eof_.size(); i++) {
      if (eof_[i] == conn) {
        eof_.erase(eof_.begin() + i);
        break;
      }
    }
  }

  void CloseLater(Connection* conn) {
    if (conn->in_close_list) return;
    conn->in_close_list = true;
    close_.push_back(conn);
    ScheduleFlush();
  }

  void RemoveCloseLater(Connection* conn) {
    if (!conn->in_close_list) return;
    conn->in_close_list = false;
    for (size_t i = 0; i < close_.size(); i++) {
      if (close_[i] == conn) {
        close_.erase(close_.begin() + i);
        break;
      }
    }
  }

  void ForgetPushed(Connection* conn) {
    for (auto& entry : pushed_) {
      if (entry.first == conn) entry.first = nullptr;
    }
  }

  void Forget(uint32_t id) { ids_.erase(id); }

  Connection* FindConnection(uint32_t connection_id) {
    auto it = connections_by_id_.find(connection_id);
    return it == connections_by_id_.end() ? nullptr : it->second;
  }

  void Link(Connection* conn);
  void Unlink(Connection* conn);
  bool SetupConnection(Connection* conn);

  uv_loop_t* loop() { return env()->event_loop(); }
  char* slab() { return slab_.get(); }
  uint64_t max_header_size() const { return max_header_size_; }
  uint32_t max_headers() const { return max_headers_; }
  bool flag(uint32_t f) const { return (flags_ & f) != 0; }

 private:
  static void OnConnection(uv_stream_t* listener, int status);
  static void OnCheck(uv_check_t* handle);
  static void OnSweep(uv_timer_t* handle);

  void ScheduleFlush();
  void Flush();
  void DeliverBatch();
  void ProcessEof();
  void ApplyResponses(const uint8_t* data, size_t len);
  void WriteHead(Connection* conn,
                 Exchange* ex,
                 uint8_t flags,
                 uint16_t status,
                 const uint8_t* head,
                 uint32_t head_length,
                 uint32_t body_length,
                 bool complete);
  void UpdateDate();
  void StartListening(uv_stream_t* listener);
  void StopListening();
  void MaybeEmitClose();
  void RestartSweep();
  void Sweep();
  void Drop(Connection* conn);

  std::unique_ptr<char[]> slab_;
  uv_stream_t* listener_ = nullptr;
  uv_check_t* check_ = nullptr;
  uv_idle_t* idle_ = nullptr;
  uv_timer_t* sweep_ = nullptr;

  Global<Function> on_batch_;
  Global<Function> on_close_;
  std::shared_ptr<BackingStore> shared_;
  char* shared_data_;
  size_t shared_length_;

  std::string heads_;
  std::string bodies_;
  std::unordered_map<uint32_t, Connection*> ids_;
  std::unordered_map<uint32_t, Connection*> connections_by_id_;
  std::vector<Connection*> touched_;
  // Heads in heads_, by connection and request id.
  std::vector<std::pair<Connection*, uint32_t>> pushed_;
  // Connections whose client ended its side.
  std::vector<Connection*> eof_;
  // Connections whose writes failed, closed on the next flush.
  std::vector<Connection*> close_;
  Connection* connections_ = nullptr;
  size_t connection_count_ = 0;

  uint32_t flags_ = 0;
  uint32_t lenient_flags_ = 0;
  int64_t max_connections_ = -1;
  uint32_t keep_alive_delay_ = 0;
  uint32_t max_headers_ = 2000;
  uint64_t max_header_size_;
  uint64_t keep_alive_timeout_ = 5000;
  uint64_t headers_timeout_ = 60000;
  uint64_t request_timeout_ = 0;
  uint64_t checking_interval_ = 1000;
  uint64_t default_timeout_ = 0;
  uint64_t handshake_timeout_ = 120000;
  time_t date_time_ = 0;
  std::string date_;
  uint32_t next_id_ = 0;
  uint32_t next_connection_id_ = 0;
  bool flush_scheduled_ = false;
  bool closing_ = false;
  bool close_emitted_ = false;
  bool refed_ = true;
  bool listener_is_pipe_ = false;

#if HAVE_OPENSSL
  // Set for HTTPS: every accepted connection gets an SSL from it.
  BaseObjectPtr<crypto::SecureContext> secure_context_;
  std::string alpn_;  // Wire format, from ALPNProtocols.
  bool request_cert_ = false;
  bool reject_unauthorized_ = false;
  bool sni_enabled_ = false;
  bool keylog_enabled_ = false;
  Global<Function> alpn_callback_;
  uint32_t reneg_limit_ = 3;
  uint64_t reneg_window_ms_ = 600 * 1000;

 public:
  // With rejectUnauthorized, a client certificate that failed verification
  // ends the connection before any request is read, as tls.Server does.
  bool PeerAccepted(Connection* conn) {
    if (!request_cert_ || !reject_unauthorized_) return true;
    return VerifyError(conn) == X509_V_OK;
  }

  static long VerifyError(Connection* conn) {  // NOLINT(runtime/int)
    // TLS 1.3 resumption reports X509_V_OK without a certificate.
    if (SSL_get0_peer_certificate(conn->ssl) == nullptr)
      return X509_V_ERR_UNABLE_TO_GET_ISSUER_CERT;
    return conn->ssl.verifyPeerCertificate().value_or(
        X509_V_ERR_UNABLE_TO_GET_ISSUER_CERT);
  }

  const std::string& alpn() const { return alpn_; }
  int CallAlpnCallback(Connection* conn,
                       const unsigned char** out,
                       unsigned char* outlen,
                       const unsigned char* in,
                       unsigned int inlen);
  uint32_t reneg_limit() const { return reneg_limit_; }
  uint64_t reneg_window_ms() const { return reneg_window_ms_; }
  uint64_t default_timeout() const { return default_timeout_; }
  void InstallContextCallbacks(SSL_CTX* ctx);

 private:
#endif

  friend struct Connection;
};

// llhttp callbacks.

static int OnMessageBegin(llhttp_t* p) {
  Connection* conn = Connection::From(p);
  conn->head.assign(kHeadPrefix, '\0');
  conn->url_length = 0;
  conn->header_bytes = 0;
  conn->header_count = 0;
  conn->value_pos = SIZE_MAX;
  conn->current_header = -1;
  conn->in_header_field = false;
  conn->in_message = true;
  conn->headers_done = false;
  conn->in_trailers = false;
  conn->expect_continue = false;
  conn->has_expect = false;
  conn->seen_request = true;
  conn->message_start = uv_now(conn->server->loop());
  return 0;
}

// llhttp replaces the reason of failing *_complete callbacks, so the error
// is kept on the connection too.
static inline int UserError(Connection* conn, const char* error) {
  conn->user_error = error;
  llhttp_set_error_reason(&conn->parser, error);
  return HPE_USER;
}

static inline int CountHeaderBytes(Connection* conn, size_t len) {
  conn->header_bytes += static_cast<uint32_t>(len);
  if (conn->header_bytes >= conn->server->max_header_size()) {
    return UserError(conn, "HPE_HEADER_OVERFLOW:Header overflow");
  }
  return 0;
}

static int OnUrl(llhttp_t* p, const char* at, size_t len) {
  Connection* conn = Connection::From(p);
  conn->head.append(at, len);
  conn->url_length += static_cast<uint32_t>(len);
  return CountHeaderBytes(conn, len);
}

static int OnHeaderField(llhttp_t* p, const char* at, size_t len) {
  Connection* conn = Connection::From(p);
  if (conn->headers_done && !conn->in_trailers) {
    conn->in_trailers = true;
    conn->head.assign(2, '\0');
    conn->header_count = 0;
    conn->value_pos = SIZE_MAX;
  }
  if (!conn->in_header_field) {
    conn->FinishValue();
    conn->in_header_field = true;
    conn->name_pos = conn->head.size();
    conn->head.append(2, '\0');
  }
  conn->head.append(at, len);
  return CountHeaderBytes(conn, len);
}

static int OnHeaderFieldComplete(llhttp_t* p) {
  Connection* conn = Connection::From(p);
  if (!conn->in_header_field) return 0;
  conn->in_header_field = false;
  size_t name_length = conn->head.size() - conn->name_pos - 2;
  int index = FindKnownHeader(conn->head.data() + conn->name_pos + 2,
                              name_length);
  if (index >= 0) {
    conn->head.resize(conn->name_pos + 2);
    WriteU16(&conn->head, conn->name_pos, kKnownHeader | index);
  } else {
    if (name_length >= kKnownHeader) {
      return UserError(conn, "HPE_HEADER_OVERFLOW:Header overflow");
    }
    WriteU16(&conn->head, conn->name_pos, static_cast<uint16_t>(name_length));
  }
  if (index < 0 && name_length == 6) {
    // Expect in an unusual case still matters.
    const char* name = conn->head.data() + conn->name_pos + 2;
    static const char kExpect[] = "expect";
    bool match = true;
    for (size_t i = 0; i < 6; i++) {
      if (ToLower(name[i]) != kExpect[i]) {
        match = false;
        break;
      }
    }
    if (match) index = static_cast<int>(kExpectHeader);
  }
  if (conn->header_count >= conn->server->max_headers() &&
      !conn->in_trailers) {
    return UserError(conn, "HPE_HEADER_OVERFLOW:Header overflow");
  }
  conn->current_header = index;
  conn->value_pos = conn->head.size();
  conn->head.append(4, '\0');
  return 0;
}

void Connection::FinishValue() {
  if (value_pos == SIZE_MAX) return;
  size_t end = head.size();
  while (end > value_pos + 4 && (head[end - 1] == ' ' || head[end - 1] == '\t'))
    end--;
  head.resize(end);
  uint32_t value_length = static_cast<uint32_t>(end - value_pos - 4);
  WriteU32(&head, value_pos, value_length);
  if (current_header >= 0 &&
      static_cast<size_t>(current_header) % kKnownHeaderCount ==
          kExpectHeader &&
      !in_trailers) {
    has_expect = true;
    if (value_length == 12) {
      const char* v = head.data() + value_pos + 4;
      static const char kContinue[] = "100-continue";
      bool match = true;
      for (size_t i = 0; i < 12; i++) {
        if (ToLower(v[i]) != kContinue[i]) {
          match = false;
          break;
        }
      }
      expect_continue = match;
    }
  }
  header_count++;
  value_pos = SIZE_MAX;
}

static int OnHeaderValue(llhttp_t* p, const char* at, size_t len) {
  Connection* conn = Connection::From(p);
  conn->head.append(at, len);
  return CountHeaderBytes(conn, len);
}

static int OnHeaderValueComplete(llhttp_t* p) {
  Connection::From(p)->FinishValue();
  return 0;
}

static int OnHeadersComplete(llhttp_t* p) {
  Connection* conn = Connection::From(p);
  BatchServer* server = conn->server;
  conn->FinishValue();
  conn->in_message = false;
  conn->headers_done = true;

  conn->exchanges.emplace_back();
  Exchange& ex = conn->exchanges.back();
  ex.id = server->NextId();
  // Any Transfer-Encoding means a body, even one llhttp rejects later.
  ex.has_body = (p->flags & (F_CHUNKED | F_TRANSFER_ENCODING)) ||
                ((p->flags & F_CONTENT_LENGTH) && p->content_length > 0);
  ex.keep_alive = llhttp_should_keep_alive(p);
  ex.head_method = p->method == HTTP_HEAD;
  ex.http10 = p->http_major == 1 && p->http_minor == 0;
  ex.upgrade = p->upgrade;

  std::string& h = conn->head;
  WriteU32(&h, 0, ex.id);
  h[4] = static_cast<char>((ex.has_body ? kHasBody : 0) |
                           (ex.upgrade ? kUpgrade : 0) |
                           (ex.keep_alive ? kKeepAlive : 0) |
                           (conn->expect_continue ? kExpectContinue : 0) |
                           (conn->has_expect ? kHasExpect : 0));
  h[5] = static_cast<char>(p->method);
  h[6] = static_cast<char>(p->http_major);
  h[7] = static_cast<char>(p->http_minor);
  WriteU32(&h, 8, conn->url_length);
  WriteU16(&h, 12, conn->header_count);
  WriteU32(&h, 16, conn->connection_id);
  conn->announced = true;
  server->PushHead(conn, ex.id);

  if (conn->expect_continue && ex.has_body && !ex.http10 &&
      !server->flag(kDelegateContinue)) {
    conn->Target(&ex).append("HTTP/1.1 100 Continue\r\n\r\n");
    conn->FlushOut();
  }
  return 0;
}

// The exchange whose request is being parsed.
static inline Exchange* Parsing(Connection* conn) {
  if (conn->exchanges.empty()) return nullptr;
  Exchange* ex = &conn->exchanges.back();
  return ex->request_complete ? nullptr : ex;
}

static int OnBody(llhttp_t* p, const char* at, size_t len) {
  Connection* conn = Connection::From(p);
  Exchange* ex = Parsing(conn);
  // The plain API ends the exchange for JavaScript with the response; the
  // rest of the body is read and dropped.
  if (ex != nullptr &&
      (!ex->response_done || conn->server->flag(kForwardBodyAfterResponse))) {
    conn->server->PushBody(ex->id, at, static_cast<uint32_t>(len));
  }
  return 0;
}

static int OnChunkHeader(llhttp_t* p) {
  Connection::From(p)->chunk_extensions = 0;
  return 0;
}

static int OnChunkExtension(llhttp_t* p, const char* at, size_t len) {
  Connection* conn = Connection::From(p);
  conn->chunk_extensions += len;
  if (conn->chunk_extensions > kMaxChunkExtensionsSize) {
    return UserError(conn,
                     "HPE_CHUNK_EXTENSIONS_OVERFLOW:Chunk extensions overflow");
  }
  return 0;
}

static int OnMessageComplete(llhttp_t* p) {
  Connection* conn = Connection::From(p);
  BatchServer* server = conn->server;
  Exchange* ex = Parsing(conn);
  if (ex == nullptr) return HPE_PAUSED;
  ex->request_complete = true;
  conn->last_active = uv_now(server->loop());
  const bool forward =
      !ex->response_done || server->flag(kForwardBodyAfterResponse);
  if (forward) {
    if (conn->in_trailers) {
      conn->FinishValue();
      WriteU16(&conn->head, 0, conn->header_count);
      server->PushRecord(
          ex->id, kTrailers, conn->head.data(), conn->head.size());
    }
    if (ex->has_body) server->PushBody(ex->id, nullptr, 0);
  }
  // Execute() decides whether to go on with the next pipelined request.
  return HPE_PAUSED;
}

static const llhttp_settings_t* Settings() {
  static const llhttp_settings_t settings = [] {
    llhttp_settings_t s;
    llhttp_settings_init(&s);
    s.on_message_begin = OnMessageBegin;
    s.on_url = OnUrl;
    s.on_header_field = OnHeaderField;
    s.on_header_field_complete = OnHeaderFieldComplete;
    s.on_header_value = OnHeaderValue;
    s.on_header_value_complete = OnHeaderValueComplete;
    s.on_headers_complete = OnHeadersComplete;
    s.on_body = OnBody;
    s.on_chunk_header = OnChunkHeader;
    s.on_chunk_extension_name = OnChunkExtension;
    s.on_chunk_extension_value = OnChunkExtension;
    s.on_message_complete = OnMessageComplete;
    return s;
  }();
  return &settings;
}

static void ApplyLenientFlags(llhttp_t* parser, uint32_t flags) {
  if (flags & kLenientHeaders) llhttp_set_lenient_headers(parser, 1);
  if (flags & kLenientChunkedLength)
    llhttp_set_lenient_chunked_length(parser, 1);
  if (flags & kLenientKeepAlive) llhttp_set_lenient_keep_alive(parser, 1);
  if (flags & kLenientTransferEncoding)
    llhttp_set_lenient_transfer_encoding(parser, 1);
  if (flags & kLenientVersion) llhttp_set_lenient_version(parser, 1);
  if (flags & kLenientDataAfterClose)
    llhttp_set_lenient_data_after_close(parser, 1);
  if (flags & kLenientOptionalLFAfterCR)
    llhttp_set_lenient_optional_lf_after_cr(parser, 1);
  if (flags & kLenientOptionalCRLFAfterChunk)
    llhttp_set_lenient_optional_crlf_after_chunk(parser, 1);
  if (flags & kLenientOptionalCRBeforeLF)
    llhttp_set_lenient_optional_cr_before_lf(parser, 1);
  if (flags & kLenientSpacesAfterChunkSize)
    llhttp_set_lenient_spaces_after_chunk_size(parser, 1);
#if LLHTTP_VERSION_MAJOR * 1000 + LLHTTP_VERSION_MINOR >= 9004
  if (flags & kLenientHeaderValueRelaxed)
    llhttp_set_lenient_header_value_relaxed(parser, 1);
#endif
}

// Connection.

bool Connection::CanParseMore() const {
  // Like node:http, no new requests while their responses would pile up.
  if (closing || raw || parse_stopped || write_paused ||
      exchanges.size() >= kMaxInflight)
    return false;
  if (exchanges.empty()) return true;
  const Exchange& last = exchanges.back();
  // Nothing after a request that ends the connection or changes protocol.
  return last.keep_alive && !last.upgrade && !last.close_after;
}

void Connection::Feed(const char* data, size_t len) {
  if (paused) {
    pending_input.append(data, len);
    if (pending_input.size() > kMaxPendingInput) StopReading();
    return;
  }
  Execute(data, len);
}

void Connection::Execute(const char* data, size_t len) {
  const char* p = data;
  size_t n = len;
  for (;;) {
    llhttp_errno_t err = llhttp_execute(&parser, p, n);
    if (closing) return;
    if (err == HPE_OK) break;
    if (err != HPE_PAUSED && err != HPE_PAUSED_UPGRADE) {
      OnParseError(err, p, n);
      return;
    }
    const char* pos = llhttp_get_error_pos(&parser);
    n -= pos - p;
    p = pos;
    if (err == HPE_PAUSED_UPGRADE) parse_stopped = true;
    if (err == HPE_PAUSED && CanParseMore()) {
      llhttp_resume(&parser);
      if (n == 0) break;
      continue;
    }
    paused = true;
    pending_input.assign(p, n);
    break;
  }
  Advance();
}

void Connection::ResumeParsing() {
  if (!paused || !CanParseMore()) return;
  paused = false;
  llhttp_resume(&parser);
  if (!pending_input.empty()) {
    std::string input;
    input.swap(pending_input);
    Execute(input.data(), input.size());
    // Keep the larger allocation for the next pause.
    if (pending_input.empty()) {
      input.clear();
      pending_input.swap(input);
    }
  }
}

// Retires the answered exchanges at the front, moves the next buffered
// response to the socket, and goes on parsing when possible.
void Connection::Advance() {
  if (closing || server == nullptr) return;
  while (!exchanges.empty()) {
    Exchange& front = exchanges.front();
    if (!front.response_done || !front.request_complete) break;
    const bool close = !front.keep_alive || front.close_after || front.upgrade;
    server->Forget(front.id);
    exchanges.pop_front();
    last_active = uv_now(server->loop());
    if (close) {
      AbortAll();
      Shutdown();
      return;
    }
    if (!exchanges.empty() && !exchanges.front().out.empty()) {
      out.append(exchanges.front().out);
      exchanges.front().out.clear();
      FlushOut();
      if (closing) return;
    }
  }
  if (raw_pending && !exchanges.empty() && exchanges.front().request_complete) {
    SwitchToRaw();
    return;
  }
  ResumeParsing();
  if (closing) return;
  if (read_eof) {
    if (exchanges.empty() && (pending_input.empty() || parse_stopped))
      Shutdown();
    return;
  }
  if (!paused || pending_input.size() <= kMaxPendingInput) StartReading();
}

void Connection::StopParsing() {
  parse_stopped = true;
  paused = true;
  StopReading();
}

void Connection::OnParseError(llhttp_errno_t err,
                              const char* data,
                              size_t len) {
  const char* reason =
      user_error != nullptr ? user_error : llhttp_get_error_reason(&parser);
  std::string code = llhttp_errno_name(err);
  std::string text = reason != nullptr ? reason : "";
  // "HPE_CODE:Reason" from our own callbacks (reported by llhttp as
  // HPE_USER, or as HPE_CB_* from the *_complete ones).
  if (text.compare(0, 4, "HPE_") == 0) {
    size_t colon = text.find(':');
    if (colon != std::string::npos) {
      code = text.substr(0, colon);
      text = text.substr(colon + 1);
    }
  }
  const char* pos = llhttp_get_error_pos(&parser);
  uint32_t parsed = pos != nullptr && pos >= data && pos <= data + len
                        ? static_cast<uint32_t>(pos - data)
                        : 0;
  parse_stopped = true;
  paused = true;

  if (server->flag(kDelegateErrors)) {
    // Reading goes on, to notice the client's end; more bytes report the
    // same error again, like a failed llhttp parser does in node:http.
    // JavaScript emits 'clientError' and decides what to send and when to
    // close, like node:http.
    server->Announce(this);
    parse_error = code;
    parse_error.push_back('\0');
    parse_error.append(text);
    parse_error.push_back('\0');
    std::string payload;
    AppendU32(&payload, parsed);
    payload.append(parse_error);
    payload.append(data, len);
    server->PushRecord(
        connection_id, kClientError, payload.data(), payload.size());
    return;
  }

  StopReading();
  const bool started =
      !exchanges.empty() && exchanges.front().response_started;
  if (!started) {
    if (code == "HPE_HEADER_OVERFLOW") {
      out.append("HTTP/1.1 431 Request Header Fields Too Large\r\n");
    } else if (code == "HPE_CHUNK_EXTENSIONS_OVERFLOW") {
      out.append("HTTP/1.1 413 Payload Too Large\r\n");
    } else {
      out.append("HTTP/1.1 400 Bad Request\r\n");
    }
    out.append("Connection: close\r\n\r\n");
    FlushOut();
  }
  AbortAll();
  Shutdown();
}

// Whether JavaScript still waits for something of `ex`: its response, or
// the rest of its body when bodies outlive responses.
static inline bool Pending(BatchServer* server, const Exchange& ex) {
  return !ex.response_done ||
         (!ex.request_complete && server->flag(kForwardBodyAfterResponse));
}

// Abandons every exchange JavaScript still waits for.
void Connection::AbortAll() {
  for (Exchange& ex : exchanges) {
    if (server != nullptr) {
      if (Pending(server, ex)) server->PushBody(ex.id, nullptr, kBodyAbort);
      server->Forget(ex.id);
    }
  }
  exchanges.clear();
}

// Upgraded connections pass bytes through as they are, in both directions.
void Connection::SwitchToRaw() {
  raw_pending = false;
  raw = true;
  parse_stopped = true;
  for (Exchange& ex : exchanges) server->Forget(ex.id);
  exchanges.clear();
  if (!pending_input.empty()) {
    server->PushRecord(connection_id,
                       kRawData,
                       pending_input.data(),
                       pending_input.size());
    pending_input.clear();
  }
  paused = false;
  if (read_eof) {
    server->PushRecord(connection_id, kRawEnd);
  } else {
    StartReading();
  }
}

void Connection::OnData(const char* data, size_t len) {
  if (raw) {
    server->PushRecord(connection_id, kRawData, data, len);
    return;
  }
  if (parse_stopped) {
    if (!parse_error.empty() && !raw_pending) {
      std::string payload;
      AppendU32(&payload, 0);
      payload.append(parse_error);
      payload.append(data, len);
      server->PushRecord(
          connection_id, kClientError, payload.data(), payload.size());
    }
    return;
  }
  Feed(data, len);
}

static void OnAlloc(uv_handle_t* handle, size_t, uv_buf_t* buf) {
  *buf = uv_buf_init(Connection::From(handle)->server->slab(), kSlabSize);
}

static void OnRead(uv_stream_t* stream, ssize_t nread, const uv_buf_t* buf) {
  Connection* conn = Connection::From(reinterpret_cast<uv_handle_t*>(stream));
  if (conn->closing) return;
  if (nread > 0) {
    conn->Touch();
#if HAVE_OPENSSL
    if (conn->ssl) {
      conn->OnCiphertext(buf->base, static_cast<size_t>(nread));
      return;
    }
#endif
    conn->OnData(buf->base, static_cast<size_t>(nread));
  } else if (nread == UV_EOF) {
#if HAVE_OPENSSL
    if (conn->ssl && !conn->handshake_done && conn->got_data)
      conn->ReportTlsError("ECONNRESET", "socket hang up");
#endif
    conn->OnEof();
  } else if (nread < 0) {
#if HAVE_OPENSSL
    if (conn->ssl && !conn->handshake_done && conn->got_data)
      conn->ReportTlsError("ECONNRESET", "socket hang up");
#endif
    conn->Close(true);
  }
}

void Connection::OnEof() {
  StopReading();
  read_eof = true;
  if (raw) {
    server->PushRecord(connection_id, kRawEnd);
    return;
  }
  if (parse_stopped && !raw_pending) {
    // Like socketOnEnd() after a client error: end our side too.
    Shutdown();
    return;
  }
  if (in_message || Parsing(this) != nullptr) {
    // A request was cut short.
    if (server->flag(kDelegateErrors) && !parse_stopped) {
      // Like socketOnEnd(): the parser's verdict goes to 'clientError'.
      llhttp_errno_t err = llhttp_finish(&parser);
      if (err == HPE_OK) err = HPE_INVALID_EOF_STATE;
      OnParseError(err, nullptr, 0);
      return;
    }
    AbortAll();
    Shutdown();
  } else if (exchanges.empty() && (pending_input.empty() || parse_stopped)) {
    Shutdown();
  } else {
    server->AddEof(this);
  }
}

#if HAVE_OPENSSL
void Connection::ReportTlsError(const char* code, const char* message) {
  if (tls_error_reported || server == nullptr) return;
  tls_error_reported = true;
  server->Announce(this);
  std::string payload = code;
  payload.push_back('\0');
  payload.append(message);
  payload.push_back('\0');
  server->PushRecord(
      connection_id, kTlsError, payload.data(), payload.size());
}

// Decrypts everything available. The plaintext goes through the read slab,
// which is free again once the ciphertext is in tls_in.
void Connection::OnCiphertext(const char* data, size_t len) {
  if (len != 0) {
    got_data = true;
    if (BIO_write(tls_in, data, static_cast<int>(len)) !=
        static_cast<int>(len)) {
      Close(true);
      return;
    }
  }
  if (sni_pending) return;  // The handshake waits for an SNI context.
  char* plain = server->slab();
  for (;;) {
    int n = SSL_read(ssl, plain, kSlabSize);
    if (tls_attack) {
      ReportTlsError("ERR_TLS_SESSION_ATTACK",
                     "TLS session renegotiation attack detected");
      Close(true);
      return;
    }
    if (n > 0) {
      if (!tls_verified) {
        tls_verified = true;
        if (!server->PeerAccepted(this)) {
          Close(true);
          return;
        }
      }
      OnData(plain, static_cast<size_t>(n));
      if (closing) return;
      continue;
    }
    int err = SSL_get_error(ssl, n);
    if (err == SSL_ERROR_WANT_READ || err == SSL_ERROR_WANT_WRITE) break;
    if (err == SSL_ERROR_WANT_X509_LOOKUP) {
      // The cert callback suspended the handshake for SNI.
      FlushOut();
      return;
    }
    if (err == SSL_ERROR_ZERO_RETURN) {  // close_notify
      FlushOut();
      OnEof();
      return;
    }
    // Handshake failure or corrupted record.
    if (!handshake_done) {
      unsigned long e = ERR_peek_last_error();  // NOLINT(runtime/int)
      const char* reason = ERR_reason_error_string(e);
      std::string code = "ERR_SSL_";
      for (const char* r = reason != nullptr ? reason : "unknown";
           *r != '\0';
           r++) {
        code.push_back(*r == ' ' ? '_' : ToUpper(*r));
      }
      char message[256];
      ERR_error_string_n(e, message, sizeof(message));
      ReportTlsError(code.c_str(), message);
    }
    ERR_clear_error();
    // Send the alert, if any.
    FlushOut();
    Shutdown();
    return;
  }
  // Handshake messages and session tickets.
  FlushOut();
}
#endif

void Connection::StartReading() {
  if (reading || closing || user_paused || write_paused || (read_eof && !raw))
    return;
  if (read_eof) return;
  if (uv_read_start(stream(), OnAlloc, OnRead) == 0) reading = true;
}

void Connection::StopReading() {
  if (!reading) return;
  uv_read_stop(stream());
  reading = false;
}

static void OnConnectionTimeout(uv_timer_t* timer) {
  Connection* conn = static_cast<Connection*>(timer->data);
  if (conn->closing || conn->server == nullptr) return;
  conn->server->Announce(conn);
  conn->server->PushRecord(conn->connection_id, kTimeout);
}

void Connection::SetTimeout(uint64_t ms) {
  timeout_ms = ms;
  if (ms == 0) {
    if (timer != nullptr) uv_timer_stop(timer);
    return;
  }
  if (timer == nullptr) {
    timer = new uv_timer_t();
    CHECK_EQ(0, uv_timer_init(server->loop(), timer));
    timer->data = this;
    uv_unref(reinterpret_cast<uv_handle_t*>(timer));
  }
  uv_timer_start(timer, OnConnectionTimeout, ms, 0);
}

// Activity restarts the idle timeout, like net.Socket.
void Connection::Touch() {
  if (server != nullptr) last_active = uv_now(server->loop());
  if (timeout_ms != 0 && timer != nullptr)
    uv_timer_start(timer, OnConnectionTimeout, timeout_ms, 0);
}

// The connection is kept here rather than taken from handle->data, which
// Environment::CloseHandle() replaces while the handle closes, when pending
// writes are cancelled.
struct WriteReq {
  uv_write_t req;
  Connection* conn;
  std::string data;
};

void Connection::CheckDrain() {
  if (!drain_wanted || server == nullptr || closing) return;
  if (uv_stream_get_write_queue_size(stream()) != 0 || !out.empty()) return;
  drain_wanted = false;
  server->PushRecord(connection_id, kDrain);
}

static void AfterWrite(uv_write_t* req, int status) {
  WriteReq* w = ContainerOf(&WriteReq::req, req);
  Connection* conn = w->conn;
  delete w;
  conn->writes_in_flight--;
  if (status < 0 && status != UV_ECANCELED) {
    // Closing from inside libuv's write callbacks, with other writes still
    // queued, is left to the next flush.
    if (conn->server != nullptr && !conn->closing) {
      conn->StopReading();
      conn->server->CloseLater(conn);
    }
    return;
  }
  if (status == 0) {
    conn->Touch();
    if (conn->write_paused &&
        uv_stream_get_write_queue_size(conn->stream()) <=
            kMaxWriteBacklog / 2) {
      conn->write_paused = false;
      conn->Advance();
    }
    conn->CheckDrain();
  }
}

void Connection::FlushOut() {
  if (closing) {
    out.clear();
    return;
  }
#if HAVE_OPENSSL
  if (ssl) {
    if (!out.empty()) {
      // Memory BIOs never apply backpressure, so this writes everything.
      if (SSL_write(ssl, out.data(), static_cast<int>(out.size())) <= 0) {
        out.clear();
        ERR_clear_error();
        Close(true);
        return;
      }
      out.clear();
    }
    size_t pending = BIO_ctrl_pending(tls_out);
    if (pending == 0) return;
    size_t start = wire.size();
    wire.resize(start + pending);
    BIO_read(tls_out, &wire[start], static_cast<int>(pending));
    WriteWire(&wire);
    return;
  }
#endif
  WriteWire(&out);
}

// Writes `data` to the socket now or queues it, and leaves `data` empty.
void Connection::WriteWire(std::string* data) {
  std::string& bytes = *data;
  if (bytes.empty()) return;
  size_t offset = 0;
  if (writes_in_flight == 0) {
    uv_buf_t buf = uv_buf_init(bytes.data(), bytes.size());
    int r = uv_try_write(stream(), &buf, 1);
    if (r == static_cast<int>(bytes.size())) {
      bytes.clear();
      Touch();
      CheckDrain();
      return;
    }
    if (r < 0 && r != UV_EAGAIN && r != UV_ENOSYS) {
      bytes.clear();
      Close(true);
      return;
    }
    if (r > 0) offset = r;
  }
  WriteReq* w = new WriteReq();
  w->conn = this;
  if (offset == 0) {
    w->data.swap(bytes);
  } else {
    w->data.assign(bytes, offset, std::string::npos);
    bytes.clear();
  }
  uv_buf_t buf = uv_buf_init(w->data.data(), w->data.size());
  int err = uv_write(&w->req, stream(), &buf, 1, AfterWrite);
  if (err != 0) {
    delete w;
    Close(true);
    return;
  }
  writes_in_flight++;
  if (!write_paused &&
      uv_stream_get_write_queue_size(stream()) > kMaxWriteBacklog) {
    write_paused = true;
    StopReading();
  }
}

static void OnConnectionClosed(uv_handle_t* handle) {
  delete Connection::From(handle);
}

void Connection::Close(bool notify) {
  if (uv_is_closing(handle())) return;
  closing = true;
  reading = false;
  if (server != nullptr) {
    server->RemoveEof(this);
    server->RemoveCloseLater(this);
    server->ForgetPushed(this);
    for (Exchange& ex : exchanges) {
      if (notify && Pending(server, ex))
        server->PushBody(ex.id, nullptr, kBodyAbort);
      server->Forget(ex.id);
    }
    exchanges.clear();
    if (announced) server->PushRecord(connection_id, kConnectionClosed);
    server->Unlink(this);
  }
  if (timer != nullptr) {
    env->CloseHandle(timer, FreeHandle<uv_timer_t>);
    timer = nullptr;
  }
  env->CloseHandle(handle(), OnConnectionClosed);
}

static void AfterShutdown(uv_shutdown_t* req, int status) {
  Connection* conn = static_cast<Connection*>(req->data);
  delete req;
  conn->Close(true);
}

void Connection::Shutdown() {
  if (closing) return;
#if HAVE_OPENSSL
  if (ssl && SSL_is_init_finished(ssl)) {
    SSL_shutdown(ssl);
    FlushOut();
    if (closing) return;
  }
#endif
  StopReading();
  closing = true;
  uv_shutdown_t* req = new uv_shutdown_t();
  req->data = this;
  if (uv_shutdown(req, stream(), AfterShutdown) != 0) {
    delete req;
    closing = false;
    Close(true);
  }
}

#if HAVE_OPENSSL
// Only the protocols of ALPNProtocols are served (http/1.1 by default).
static int SelectALPN(SSL* ssl,
                      const unsigned char** out,
                      unsigned char* outlen,
                      const unsigned char* in,
                      unsigned int inlen,
                      void* arg) {
  Connection* conn = static_cast<Connection*>(SSL_get_app_data(ssl));
  if (conn == nullptr || conn->server == nullptr) return SSL_TLSEXT_ERR_NOACK;
  int ret = conn->server->CallAlpnCallback(conn, out, outlen, in, inlen);
  if (ret != SSL_TLSEXT_ERR_NOACK) return ret;
  const std::string& alpn = conn->server->alpn();
  if (alpn.empty()) return SSL_TLSEXT_ERR_NOACK;
  unsigned char* selected;
  if (SSL_select_next_proto(&selected,
                            outlen,
                            reinterpret_cast<const unsigned char*>(alpn.data()),
                            static_cast<unsigned int>(alpn.size()),
                            in,
                            inlen) != OPENSSL_NPN_NEGOTIATED) {
    // Like tls.Server: no common protocol is fatal.
    return SSL_TLSEXT_ERR_ALERT_FATAL;
  }
  *out = selected;
  return SSL_TLSEXT_ERR_OK;
}

// Suspends the handshake while JavaScript picks a context for the server
// name (SNICallback, addContext()), like TLSWrap's cert callback.
static int CertCallback(SSL* ssl, void* arg) {
  Connection* conn = static_cast<Connection*>(SSL_get_app_data(ssl));
  if (conn == nullptr || conn->server == nullptr || conn->sni_done) return 1;
  conn->sni_done = true;
  const char* servername = SSL_get_servername(ssl, TLSEXT_NAMETYPE_host_name);
  if (servername == nullptr || *servername == '\0') return 1;
  conn->sni_pending = true;
  conn->server->Announce(conn);
  conn->server->PushRecord(
      conn->connection_id, kServername, servername, strlen(servername));
  return -1;
}

static void KeylogCallback(const SSL* ssl, const char* line) {
  Connection* conn = static_cast<Connection*>(SSL_get_app_data(ssl));
  if (conn == nullptr || conn->server == nullptr) return;
  std::string payload = line;
  payload.push_back('\n');
  conn->server->Announce(conn);
  conn->server->PushRecord(
      conn->connection_id, kKeylog, payload.data(), payload.size());
}

// Counts client initiated renegotiations like TLSSocket: more than
// tls.CLIENT_RENEG_LIMIT within tls.CLIENT_RENEG_WINDOW ends the connection.
static void InfoCallback(const SSL* ssl, int where, int ret) {
  Connection* conn = static_cast<Connection*>(SSL_get_app_data(ssl));
  if (conn == nullptr || conn->server == nullptr) return;
  if (where & SSL_CB_HANDSHAKE_START) {
    if (!conn->handshake_done) return;
    uint64_t now = uv_now(conn->server->loop());
    if (now - conn->reneg_window_start >= conn->server->reneg_window_ms()) {
      conn->reneg_window_start = now;
      conn->renegotiations = 0;
    }
    if (++conn->renegotiations > conn->server->reneg_limit())
      conn->tls_attack = true;
  }
  if ((where & SSL_CB_HANDSHAKE_DONE) && !conn->handshake_done) {
    conn->handshake_done = true;
    conn->reneg_window_start = uv_now(conn->server->loop());
    if (conn->timeout_ms == 0 && conn->server->default_timeout() != 0)
      conn->SetTimeout(conn->server->default_timeout());
    if (conn->server->flag(kAnnounceSecure)) {
      conn->server->Announce(conn);
      conn->server->PushRecord(conn->connection_id, kSecureConnection);
    }
  }
}

void BatchServer::InstallContextCallbacks(SSL_CTX* ctx) {
  SSL_CTX_set_alpn_select_cb(ctx, SelectALPN, nullptr);
  if (sni_enabled_) SSL_CTX_set_cert_cb(ctx, CertCallback, nullptr);
  if (keylog_enabled_) SSL_CTX_set_keylog_callback(ctx, KeylogCallback);
}
#endif

// BatchServer.

BatchServer::BatchServer(Environment* env,
                         Local<Object> object,
                         Local<Function> on_batch,
                         Local<Function> on_close,
                         std::shared_ptr<BackingStore> shared,
                         char* shared_data,
                         size_t shared_length)
    : AsyncWrap(env, object, AsyncWrap::PROVIDER_TCPSERVERWRAP),
      slab_(new char[kSlabSize]),
      on_batch_(env->isolate(), on_batch),
      on_close_(env->isolate(), on_close),
      shared_(std::move(shared)),
      shared_data_(shared_data),
      shared_length_(shared_length),
      max_header_size_(env->options()->max_http_header_size) {
  check_ = new uv_check_t();
  CHECK_EQ(0, uv_check_init(loop(), check_));
  check_->data = this;
  uv_unref(reinterpret_cast<uv_handle_t*>(check_));
  idle_ = new uv_idle_t();
  CHECK_EQ(0, uv_idle_init(loop(), idle_));
  uv_unref(reinterpret_cast<uv_handle_t*>(idle_));
  sweep_ = new uv_timer_t();
  CHECK_EQ(0, uv_timer_init(loop(), sweep_));
  sweep_->data = this;
  uv_unref(reinterpret_cast<uv_handle_t*>(sweep_));
  if (env->options()->insecure_http_parser) lenient_flags_ = 0x7ff;
}

BatchServer::~BatchServer() {
  Environment* env = this->env();
  if (listener_ != nullptr) {
    env->CloseHandle(reinterpret_cast<uv_handle_t*>(listener_),
                     [](uv_handle_t* h) { free(h); });
    listener_ = nullptr;
  }
  env->CloseHandle(check_, FreeHandle<uv_check_t>);
  env->CloseHandle(idle_, FreeHandle<uv_idle_t>);
  env->CloseHandle(sweep_, FreeHandle<uv_timer_t>);
  while (connections_ != nullptr) {
    Connection* conn = connections_;
    connections_ = conn->next;
    conn->server = nullptr;
    conn->closing = true;
    if (conn->timer != nullptr) {
      env->CloseHandle(conn->timer, FreeHandle<uv_timer_t>);
      conn->timer = nullptr;
    }
    if (!uv_is_closing(conn->handle()))
      env->CloseHandle(conn->handle(), OnConnectionClosed);
  }
}

void BatchServer::MemoryInfo(MemoryTracker* tracker) const {
  tracker->TrackFieldWithSize("slab", kSlabSize);
  tracker->TrackFieldWithSize("heads", heads_.capacity());
  tracker->TrackFieldWithSize("bodies", bodies_.capacity());
}

void BatchServer::Link(Connection* conn) {
  conn->prev = nullptr;
  conn->next = connections_;
  if (connections_ != nullptr) connections_->prev = conn;
  connections_ = conn;
  connection_count_++;
  do {
    conn->connection_id = ++next_connection_id_;
  } while (conn->connection_id == 0 ||
           connections_by_id_.count(conn->connection_id) != 0);
  connections_by_id_[conn->connection_id] = conn;
}

void BatchServer::Unlink(Connection* conn) {
  if (conn->prev != nullptr) {
    conn->prev->next = conn->next;
  } else {
    connections_ = conn->next;
  }
  if (conn->next != nullptr) conn->next->prev = conn->prev;
  conn->prev = conn->next = nullptr;
  connections_by_id_.erase(conn->connection_id);
  connection_count_--;
  MaybeEmitClose();
}

void BatchServer::ScheduleFlush() {
  if (flush_scheduled_) return;
  flush_scheduled_ = true;
  uv_check_start(check_, OnCheck);
  // Keeps the loop from blocking in poll when the flush is scheduled outside
  // of the poll phase (for example from an apply() in setImmediate).
  uv_idle_start(idle_, [](uv_idle_t*) {});
}

void BatchServer::OnCheck(uv_check_t* handle) {
  static_cast<BatchServer*>(handle->data)->Flush();
}

void BatchServer::Flush() {
  flush_scheduled_ = false;
  uv_check_stop(check_);
  uv_idle_stop(idle_);
  while (!close_.empty()) {
    Connection* conn = close_.back();
    close_.pop_back();
    conn->in_close_list = false;
    conn->Close(true);
  }
  if (!heads_.empty() || !bodies_.empty()) {
    for (auto& entry : pushed_) {
      if (entry.first == nullptr) continue;
      Exchange* ex = entry.first->Find(entry.second);
      if (ex != nullptr) ex->delivered = true;
    }
    pushed_.clear();
    DeliverBatch();
  }
  ProcessEof();
}

// After the client ends its side, node:http still answers the requests it
// had already received, and aborts the ones left unanswered when the socket
// closes. Requests delivered to JavaScript get one more loop iteration to
// be answered (responses produced from setImmediate() or promises), then the
// connection closes.
void BatchServer::ProcessEof() {
  // Shutdown() and AbortAll() may change eof_, so each connection leaves the
  // list before anything is done to it.
  std::vector<Connection*> pending;
  pending.swap(eof_);
  for (Connection* conn : pending) conn->in_eof_list = false;
  for (Connection* conn : pending) {
    if (conn->closing) continue;
    if (conn->exchanges.empty()) {
      if (conn->pending_input.empty() || conn->parse_stopped ||
          !conn->CanParseMore()) {
        conn->Shutdown();
        continue;
      }
    } else if (conn->exchanges.front().delivered &&
               !conn->exchanges.front().response_done) {
      if (conn->eof_grace) {
        conn->AbortAll();
        conn->Shutdown();
        continue;
      }
      conn->eof_grace = true;
      ScheduleFlush();
    }
    // Still waiting; no new flush unless something changes.
    conn->in_eof_list = true;
    eof_.push_back(conn);
  }
}

void BatchServer::DeliverBatch() {
  Isolate* isolate = env()->isolate();
  HandleScope handle_scope(isolate);
  Local<Context> context = env()->context();
  Context::Scope context_scope(context);

  Local<Value> argv[3];
  if (heads_.size() <= shared_length_) {
    memcpy(shared_data_, heads_.data(), heads_.size());
    argv[0] = Integer::NewFromUnsigned(isolate, heads_.size());
    argv[1] = Null(isolate);
  } else {
    Local<Object> overflow;
    if (!Buffer::Copy(env(), heads_.data(), heads_.size()).ToLocal(&overflow))
      return;
    argv[0] = Integer::New(isolate, 0);
    argv[1] = overflow;
  }
  if (bodies_.empty()) {
    argv[2] = Null(isolate);
  } else {
    // 'data' listeners may keep chunks, so every batch gets a fresh Buffer.
    Local<Object> bodies;
    if (!Buffer::Copy(env(), bodies_.data(), bodies_.size()).ToLocal(&bodies))
      return;
    argv[2] = bodies;
  }
  heads_.clear();
  bodies_.clear();

  BaseObjectPtr<BatchServer> strong_ref{this};
  MakeCallback(on_batch_.Get(isolate), arraysize(argv), argv);
}

static const char* const kDays[] = {
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
static const char* const kMonths[] = {"Jan",
                                      "Feb",
                                      "Mar",
                                      "Apr",
                                      "May",
                                      "Jun",
                                      "Jul",
                                      "Aug",
                                      "Sep",
                                      "Oct",
                                      "Nov",
                                      "Dec"};

void BatchServer::UpdateDate() {
  time_t now = time(nullptr);
  if (now == date_time_) return;
  date_time_ = now;
  // Civil date from days since the epoch (Howard Hinnant's algorithm), to
  // avoid gmtime_r portability issues and locale-dependent formatting.
  int64_t secs = static_cast<int64_t>(now);
  int64_t days = secs / 86400;
  int64_t rem = secs % 86400;
  if (rem < 0) {
    rem += 86400;
    days--;
  }
  int weekday = static_cast<int>((days + 4) % 7);
  if (weekday < 0) weekday += 7;
  int64_t z = days + 719468;
  int64_t era = (z >= 0 ? z : z - 146096) / 146097;
  int64_t doe = z - era * 146097;
  int64_t yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
  int64_t y = yoe + era * 400;
  int64_t doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
  int64_t mp = (5 * doy + 2) / 153;
  int64_t d = doy - (153 * mp + 2) / 5 + 1;
  int64_t m = mp < 10 ? mp + 3 : mp - 9;
  if (m <= 2) y++;
  char buf[64];
  snprintf(buf,
           sizeof(buf),
           "Date: %s, %02d %s %04d %02d:%02d:%02d GMT\r\n",
           kDays[weekday],
           static_cast<int>(d),
           kMonths[m - 1],
           static_cast<int>(y),
           static_cast<int>(rem / 3600),
           static_cast<int>((rem % 3600) / 60),
           static_cast<int>(rem % 60));
  date_ = buf;
}

void BatchServer::WriteHead(Connection* conn,
                            Exchange* ex,
                            uint8_t flags,
                            uint16_t status,
                            const uint8_t* head,
                            uint32_t head_length,
                            uint32_t body_length,
                            bool complete) {
  std::string& out = conn->Target(ex);
  ex->response_started = true;
  const bool status_no_body =
      status == 204 || status == 304 || (status >= 100 && status < 200);
  ex->response_no_body = status_no_body || ex->head_method;
  out.append(reinterpret_cast<const char*>(head), head_length);
  if (!(flags & kUserDate)) out.append(date_);

  if (flags & kUserConnectionClose) ex->close_after = true;
  bool close = ex->close_after || !ex->keep_alive || ex->upgrade;

  if (complete) {
    ex->chunked = false;
    if ((flags & kUserTransferEncoding) && !ex->response_no_body) {
      ex->chunked = true;
    } else if (!(flags & kUserContentLength) && !status_no_body) {
      out.append("Content-Length: ");
      AppendDecimal(&out, body_length);
      out.append("\r\n");
    }
  } else if ((flags & kUserContentLength) || ex->response_no_body) {
    ex->chunked = false;
  } else if (ex->http10) {
    // No chunked encoding before HTTP/1.1: the end of the body is the end
    // of the connection.
    ex->chunked = false;
    close = true;
  } else {
    ex->chunked = true;
    if (!(flags & kUserTransferEncoding))
      out.append("Transfer-Encoding: chunked\r\n");
  }

  if (close) ex->close_after = true;
  if (!(flags & kUserConnection)) {
    if (close) {
      out.append("Connection: close\r\n");
    } else if (ex->http10) {
      out.append("Connection: keep-alive\r\n");
    }
  }
  out.append("\r\n");
}

static inline void AppendChunk(std::string* out,
                               Exchange* ex,
                               const uint8_t* data,
                               uint32_t len) {
  if (ex->response_no_body || len == 0) return;
  if (ex->chunked) {
    AppendHex(out, len);
    out->append("\r\n");
    out->append(reinterpret_cast<const char*>(data), len);
    out->append("\r\n");
  } else {
    out->append(reinterpret_cast<const char*>(data), len);
  }
}

static inline void EndResponse(std::string* out, Exchange* ex) {
  if (ex->chunked && !ex->response_no_body) out->append("0\r\n\r\n");
  ex->response_done = true;
}

static inline void MarkTouched(std::vector<Connection*>* touched,
                               Connection* conn) {
  if (!conn->touched) {
    conn->touched = true;
    touched->push_back(conn);
  }
}

void BatchServer::ApplyResponses(const uint8_t* data, size_t len) {
  UpdateDate();
  const uint8_t* p = data;
  const uint8_t* end = data + len;
  while (static_cast<size_t>(end - p) >= kResponsePrefix) {
    uint8_t op = p[0];
    uint8_t flags = p[1];
    uint16_t status = ReadU16(p + 2);
    uint32_t id = ReadU32(p + 4);
    uint32_t head_length = ReadU32(p + 8);
    uint32_t body_length = ReadU32(p + 12);
    const uint8_t* head = p + kResponsePrefix;
    uint64_t record = kResponsePrefix + uint64_t{head_length} + body_length;
    if (record > static_cast<uint64_t>(end - p)) break;
    const uint8_t* body = head + head_length;
    p += (record + 3) & ~uint64_t{3};
    if (p > end) p = end;

    if (op == kOpShutdown || op == kOpConnectionRaw) {
      Connection* conn = FindConnection(id);
      if (conn == nullptr || conn->closing) continue;
      if (op == kOpShutdown) {
        conn->shutdown_requested = true;
      } else {
        conn->out.append(reinterpret_cast<const char*>(body), body_length);
      }
      MarkTouched(&touched_, conn);
      continue;
    }

    auto it = ids_.find(id);
    if (it == ids_.end()) continue;  // The client went away.
    Connection* conn = it->second;
    Exchange* ex = conn->Find(id);
    if (conn->closing || ex == nullptr || ex->response_done) continue;
    std::string& out = conn->Target(ex);

    switch (op) {
      case kOpComplete:
        WriteHead(conn, ex, flags, status, head, head_length, body_length,
                  true);
        AppendChunk(&out, ex, body, body_length);
        EndResponse(&out, ex);
        break;
      case kOpHead:
        WriteHead(conn, ex, flags, status, head, head_length, 0, false);
        break;
      case kOpData:
        AppendChunk(&out, ex, body, body_length);
        break;
      case kOpEnd:
        if (flags & kUserConnectionClose) ex->close_after = true;
        EndResponse(&out, ex);
        break;
      case kOpRaw:
        ex->response_started = true;
        out.append(reinterpret_cast<const char*>(body), body_length);
        break;
      case kOpDestroy:
        conn->out.clear();
        conn->Close(false);
        continue;
      default:
        continue;
    }
    MarkTouched(&touched_, conn);
  }

  // Connections are only freed from uv_close callbacks, so every pointer in
  // touched_ is still valid here.
  for (size_t i = 0; i < touched_.size(); i++) {
    Connection* conn = touched_[i];
    conn->touched = false;
    if (conn->closing) continue;
    conn->FlushOut();
    if (conn->closing) continue;
    if (conn->shutdown_requested) {
      conn->Shutdown();
    } else {
      conn->Advance();
    }
  }
  touched_.clear();
}

// Settings shared by accepted and adopted connections. Returns false when
// the connection was dropped.
bool BatchServer::SetupConnection(Connection* conn) {
  conn->h.tcp.data = conn;
  if (!conn->is_pipe) {
    if (flag(kNoDelay)) uv_tcp_nodelay(&conn->h.tcp, 1);
    if (flag(kTcpKeepAlive))
      uv_tcp_keepalive(&conn->h.tcp, 1, keep_alive_delay_);
  }
  llhttp_init(&conn->parser, HTTP_REQUEST, Settings());
  ApplyLenientFlags(&conn->parser, lenient_flags_);
  conn->parser.data = conn;
#if HAVE_OPENSSL
  if (secure_context_) {
    conn->ssl = secure_context_->CreateSSL();
    conn->tls_in = BIO_new(BIO_s_mem());
    conn->tls_out = BIO_new(BIO_s_mem());
    if (!conn->ssl || conn->tls_in == nullptr || conn->tls_out == nullptr) {
      BIO_free(conn->tls_in);
      BIO_free(conn->tls_out);
      conn->tls_in = conn->tls_out = nullptr;
      return false;
    }
    // An empty input BIO means "wait for more", not end of stream.
    BIO_set_mem_eof_return(conn->tls_in, -1);
    SSL_set_bio(conn->ssl, conn->tls_in, conn->tls_out);
    SSL_set_accept_state(conn->ssl);
    SSL_set_app_data(conn->ssl, conn);
    SSL_set_info_callback(conn->ssl, InfoCallback);
    if (request_cert_) {
      // Like TLSWrap: the handshake always goes through, and the result of
      // the verification is checked once it is done.
      int mode = SSL_VERIFY_PEER;
      if (reject_unauthorized_) mode |= SSL_VERIFY_FAIL_IF_NO_PEER_CERT;
      SSL_set_verify(conn->ssl, mode, [](int, X509_STORE_CTX*) { return 1; });
    }
  }
#endif
  conn->head.reserve(512);
  conn->out.reserve(512);
  conn->last_active = conn->accepted_at = conn->message_start =
      uv_now(loop());
  Link(conn);
  if (closing_) {
    conn->Close(false);
    return true;
  }
  if (max_connections_ >= 0 &&
      connection_count_ > static_cast<size_t>(max_connections_)) {
    Drop(conn);
    return true;
  }
  // Like the connection listener of https, TLS connections time out once they
  // are secure, and handshakeTimeout covers the handshake.
  if (default_timeout_ != 0 && conn->ssl == nullptr)
    conn->SetTimeout(default_timeout_);
  if (flag(kAnnounceConnections)) Announce(conn);
  conn->StartReading();
  return true;
}

// Refuses a connection over maxConnections, and tells JavaScript for the
// 'drop' event.
void BatchServer::Drop(Connection* conn) {
  std::string payload;
  if (!conn->is_pipe) {
    sockaddr_storage storage;
    char ip[INET6_ADDRSTRLEN];
    for (int remote = 0; remote < 2; remote++) {
      int len = sizeof(storage);
      sockaddr* addr = reinterpret_cast<sockaddr*>(&storage);
      int err = remote ? uv_tcp_getpeername(&conn->h.tcp, addr, &len)
                       : uv_tcp_getsockname(&conn->h.tcp, addr, &len);
      int port = 0;
      ip[0] = '\0';
      if (err == 0 && addr->sa_family == AF_INET) {
        auto in = reinterpret_cast<sockaddr_in*>(addr);
        uv_ip4_name(in, ip, sizeof(ip));
        port = ntohs(in->sin_port);
      } else if (err == 0 && addr->sa_family == AF_INET6) {
        auto in6 = reinterpret_cast<sockaddr_in6*>(addr);
        uv_ip6_name(in6, ip, sizeof(ip));
        port = ntohs(in6->sin6_port);
      }
      payload.append(ip);
      payload.push_back('\0');
      payload.append(std::to_string(port));
      payload.push_back('\0');
    }
  }
  PushRecord(0, kDrop, payload.data(), payload.size());
  conn->Close(false);
}

void BatchServer::OnConnection(uv_stream_t* listener, int status) {
  BatchServer* server = static_cast<BatchServer*>(listener->data);
  if (status != 0) return;
  Connection* conn = new Connection();
  conn->env = server->env();
  conn->server = server;
  conn->is_pipe = server->listener_is_pipe_;
  if (conn->is_pipe) {
    CHECK_EQ(0, uv_pipe_init(server->loop(), &conn->h.pipe, 0));
  } else {
    CHECK_EQ(0, uv_tcp_init(server->loop(), &conn->h.tcp));
  }
  conn->h.tcp.data = conn;
  if (uv_accept(listener, conn->stream()) != 0 ||
      !server->SetupConnection(conn)) {
    conn->closing = true;
    conn->server = nullptr;
    server->env()->CloseHandle(conn->handle(), OnConnectionClosed);
  }
}

void BatchServer::OnSweep(uv_timer_t* handle) {
  static_cast<BatchServer*>(handle->data)->Sweep();
}

void BatchServer::RestartSweep() {
  if (listener_ == nullptr && connections_ == nullptr) return;
  // Keep-alive expiry wants about a second of precision, and timeouts as
  // fine as connectionsCheckingInterval asks.
  uint64_t period = checking_interval_ == 0 ? 1000 : checking_interval_;
  if (period > 1000) period = 1000;
  if (period < 10) period = 10;
  uv_timer_start(sweep_, OnSweep, period, period);
}

void BatchServer::Sweep() {
  uint64_t now = uv_now(loop());
  Connection* conn = connections_;
  while (conn != nullptr) {
    Connection* next = conn->next;
    if (conn->closing || conn->raw) {
      conn = next;
      continue;
    }
#if HAVE_OPENSSL
    if (conn->ssl && !conn->handshake_done && handshake_timeout_ != 0 &&
        now - conn->accepted_at >= handshake_timeout_) {
      conn->ReportTlsError("ERR_TLS_HANDSHAKE_TIMEOUT",
                           "TLS handshake timeout");
      conn->Close(true);
      conn = next;
      continue;
    }
#endif
    // Like node:http, a new connection waits for its first request head
    // from the moment it is accepted.
    const bool awaiting_head =
        conn->in_message ||
        (!conn->seen_request && conn->exchanges.empty() && !conn->is_pipe);
    const bool receiving = awaiting_head || Parsing(conn) != nullptr;
    const bool headers_expired = awaiting_head && headers_timeout_ != 0 &&
                                 now - conn->message_start >= headers_timeout_;
    const bool request_expired = receiving && request_timeout_ != 0 &&
                                 now - conn->message_start >= request_timeout_;
    if (!conn->parse_stopped && (headers_expired || request_expired)) {
      conn->parse_stopped = true;
      conn->paused = true;
      if (flag(kDelegateErrors)) {
        Announce(conn);
        std::string payload;
        AppendU32(&payload, 0);
        payload.append("ERR_HTTP_REQUEST_TIMEOUT");
        payload.push_back('\0');
        payload.push_back('\0');
        PushRecord(
            conn->connection_id, kClientError, payload.data(), payload.size());
      } else {
        conn->StopReading();
        conn->out.append(
            "HTTP/1.1 408 Request Timeout\r\nConnection: close\r\n\r\n");
        conn->FlushOut();
        conn->AbortAll();
        conn->Shutdown();
      }
    } else if (conn->exchanges.empty() && !conn->in_message &&
               !conn->parse_stopped && keep_alive_timeout_ != 0 &&
               conn->writes_in_flight == 0 &&
               now - conn->last_active >= keep_alive_timeout_) {
      conn->Close(false);
    }
    conn = next;
  }
}

void BatchServer::StartListening(uv_stream_t* listener) {
  listener->data = this;
  if (!refed_) uv_unref(reinterpret_cast<uv_handle_t*>(listener));
  listener_ = listener;
  RestartSweep();
}

void BatchServer::StopListening() {
  if (listener_ == nullptr) return;
  env()->CloseHandle(reinterpret_cast<uv_handle_t*>(listener_),
                     [](uv_handle_t* h) { free(h); });
  listener_ = nullptr;
}

void BatchServer::MaybeEmitClose() {
  if (!closing_ || close_emitted_ || connection_count_ != 0) return;
  close_emitted_ = true;
  uv_timer_stop(sweep_);
  BaseObjectPtr<BatchServer> strong_ref{this};
  MakeWeak();
  // Emitted from a native immediate: this may run inside a uv_close
  // callback or from close() itself.
  env()->SetImmediate([strong_ref](Environment* env) {
    HandleScope handle_scope(env->isolate());
    Context::Scope context_scope(env->context());
    BatchServer* server = strong_ref.get();
    server->MakeCallback(server->on_close_.Get(env->isolate()), 0, nullptr);
  });
}

void BatchServer::New(const FunctionCallbackInfo<Value>& args) {
  Environment* env = Environment::GetCurrent(args);
  CHECK(args.IsConstructCall());
  CHECK(args[0]->IsFunction());
  CHECK(args[1]->IsFunction());
  CHECK(args[2]->IsArrayBufferView());
  Local<ArrayBufferView> shared = args[2].As<ArrayBufferView>();
  std::shared_ptr<BackingStore> store = shared->Buffer()->GetBackingStore();
  char* data = static_cast<char*>(store->Data()) + shared->ByteOffset();
  new BatchServer(env,
                  args.This(),
                  args[0].As<Function>(),
                  args[1].As<Function>(),
                  std::move(store),
                  data,
                  shared->ByteLength());
}

// listen(host, port, backlog, flags) returns a libuv error code.
void BatchServer::Listen(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  Environment* env = server->env();
  CHECK(args[0]->IsString());
  CHECK(args[1]->IsUint32());
  CHECK(args[2]->IsInt32());
  CHECK(args[3]->IsUint32());
  CHECK_NULL(server->listener_);
  Utf8Value host(env->isolate(), args[0]);
  int port = args[1].As<Uint32>()->Value();
  int backlog = args[2].As<v8::Int32>()->Value();
  uint32_t flags = args[3].As<Uint32>()->Value();

  sockaddr_storage addr;
  int err = uv_ip4_addr(*host, port, reinterpret_cast<sockaddr_in*>(&addr));
  if (err != 0) {
    err = uv_ip6_addr(*host, port, reinterpret_cast<sockaddr_in6*>(&addr));
  }
  if (err != 0) return args.GetReturnValue().Set(err);

  uv_tcp_t* listener = static_cast<uv_tcp_t*>(malloc(sizeof(uv_tcp_t)));
  CHECK_EQ(0, uv_tcp_init(server->loop(), listener));
  listener->data = server;
  unsigned int bind_flags = 0;
  if (flags & kListenIPv6Only) bind_flags |= UV_TCP_IPV6ONLY;
  if (flags & kListenReusePort) bind_flags |= UV_TCP_REUSEPORT;
  err = uv_tcp_bind(
      listener, reinterpret_cast<const sockaddr*>(&addr), bind_flags);
  if (err == 0) {
    err = uv_listen(reinterpret_cast<uv_stream_t*>(listener),
                    backlog,
                    OnConnection);
  }
  if (err != 0) {
    env->CloseHandle(reinterpret_cast<uv_handle_t*>(listener),
                     [](uv_handle_t* h) { free(h); });
    return args.GetReturnValue().Set(err);
  }
  server->listener_is_pipe_ = false;
  server->StartListening(reinterpret_cast<uv_stream_t*>(listener));
  args.GetReturnValue().Set(0);
}

// listenPipe(path, backlog, flags) listens on a Unix domain socket or a
// Windows named pipe, and returns a libuv error code.
void BatchServer::ListenPipe(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  Environment* env = server->env();
  CHECK(args[0]->IsString());
  CHECK(args[1]->IsInt32());
  CHECK(args[2]->IsUint32());
  CHECK_NULL(server->listener_);
  Utf8Value path(env->isolate(), args[0]);
  int backlog = args[1].As<v8::Int32>()->Value();
  uint32_t flags = args[2].As<Uint32>()->Value();

  uv_pipe_t* listener = static_cast<uv_pipe_t*>(malloc(sizeof(uv_pipe_t)));
  CHECK_EQ(0, uv_pipe_init(server->loop(), listener, 0));
  listener->data = server;
  int err = uv_pipe_bind2(listener, *path, path.length(), 0);
  if (err == 0) {
    int mode = 0;
    if (flags & kListenReadableAll) mode |= UV_READABLE;
    if (flags & kListenWritableAll) mode |= UV_WRITABLE;
    if (mode != 0) err = uv_pipe_chmod(listener, mode);
  }
  if (err == 0) {
    err = uv_listen(reinterpret_cast<uv_stream_t*>(listener),
                    backlog,
                    OnConnection);
  }
  if (err != 0) {
    env->CloseHandle(reinterpret_cast<uv_handle_t*>(listener),
                     [](uv_handle_t* h) { free(h); });
    return args.GetReturnValue().Set(err);
  }
  server->listener_is_pipe_ = true;
  server->StartListening(reinterpret_cast<uv_stream_t*>(listener));
  args.GetReturnValue().Set(0);
}

// listenFd(fd, backlog, duplicate) listens on an existing descriptor (TCP
// or pipe), or on a duplicate of it when it belongs to another handle, and
// returns a libuv error code.
void BatchServer::ListenFd(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  Environment* env = server->env();
  CHECK(args[0]->IsInt32());
  CHECK(args[1]->IsInt32());
  CHECK_NULL(server->listener_);
  int fd = args[0].As<v8::Int32>()->Value();
  int backlog = args[1].As<v8::Int32>()->Value();
#ifndef _WIN32
  if (args[2]->IsTrue()) {
    fd = dup(fd);
    if (fd < 0) return args.GetReturnValue().Set(-errno);
  }
#endif
  uv_handle_type type = uv_guess_handle(fd);
  int err;
  uv_stream_t* listener;
  if (type == UV_TCP) {
    uv_tcp_t* tcp = static_cast<uv_tcp_t*>(malloc(sizeof(uv_tcp_t)));
    CHECK_EQ(0, uv_tcp_init(server->loop(), tcp));
    err = uv_tcp_open(tcp, static_cast<uv_os_sock_t>(fd));
    listener = reinterpret_cast<uv_stream_t*>(tcp);
  } else if (type == UV_NAMED_PIPE) {
    uv_pipe_t* pipe = static_cast<uv_pipe_t*>(malloc(sizeof(uv_pipe_t)));
    CHECK_EQ(0, uv_pipe_init(server->loop(), pipe, 0));
    err = uv_pipe_open(pipe, fd);
    listener = reinterpret_cast<uv_stream_t*>(pipe);
  } else {
    return args.GetReturnValue().Set(UV_EINVAL);
  }
  listener->data = server;
  if (err == 0) err = uv_listen(listener, backlog, OnConnection);
  if (err != 0) {
    env->CloseHandle(reinterpret_cast<uv_handle_t*>(listener),
                     [](uv_handle_t* h) { free(h); });
    return args.GetReturnValue().Set(err);
  }
  server->listener_is_pipe_ = type == UV_NAMED_PIPE;
  server->StartListening(listener);
  args.GetReturnValue().Set(0);
}

// adopt(fd) serves a connection accepted elsewhere (cluster workers) on a
// duplicate of `fd`, and returns a libuv error code.
void BatchServer::Adopt(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  CHECK(args[0]->IsInt32());
#ifdef _WIN32
  return args.GetReturnValue().Set(UV_ENOTSUP);
#else
  uv_handle_type type = uv_guess_handle(args[0].As<v8::Int32>()->Value());
  if (type != UV_TCP && type != UV_NAMED_PIPE)
    return args.GetReturnValue().Set(UV_EINVAL);
  int fd = dup(args[0].As<v8::Int32>()->Value());
  if (fd < 0) return args.GetReturnValue().Set(-errno);
  Connection* conn = new Connection();
  conn->env = server->env();
  conn->server = server;
  conn->is_pipe = type == UV_NAMED_PIPE;
  int err;
  if (conn->is_pipe) {
    CHECK_EQ(0, uv_pipe_init(server->loop(), &conn->h.pipe, 0));
    err = uv_pipe_open(&conn->h.pipe, fd);
  } else {
    CHECK_EQ(0, uv_tcp_init(server->loop(), &conn->h.tcp));
    err = uv_tcp_open(&conn->h.tcp, static_cast<uv_os_sock_t>(fd));
  }
  conn->h.tcp.data = conn;
  if (err != 0) close(fd);
  if (err != 0 || !server->SetupConnection(conn)) {
    conn->closing = true;
    conn->server = nullptr;
    server->env()->CloseHandle(conn->handle(), OnConnectionClosed);
    return args.GetReturnValue().Set(err != 0 ? err : UV_ENOMEM);
  }
  if (server->connections_ != nullptr) server->RestartSweep();
  args.GetReturnValue().Set(0);
#endif
}

// getsockname(out) fills out like net.Server#address() for TCP, and returns
// the path for pipes, or a libuv error code.
void BatchServer::GetSockName(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  CHECK(args[0]->IsObject());
  if (server->listener_ == nullptr)
    return args.GetReturnValue().Set(UV_EBADF);
  if (server->listener_is_pipe_) {
    char path[1024];
    size_t len = sizeof(path);
    int err = uv_pipe_getsockname(
        reinterpret_cast<uv_pipe_t*>(server->listener_), path, &len);
    if (err != 0) return args.GetReturnValue().Set(err);
    Local<String> str;
    if (String::NewFromUtf8(server->env()->isolate(),
                            path,
                            v8::NewStringType::kNormal,
                            static_cast<int>(len))
            .ToLocal(&str)) {
      args.GetReturnValue().Set(str);
    }
    return;
  }
  sockaddr_storage storage;
  int len = sizeof(storage);
  sockaddr* addr = reinterpret_cast<sockaddr*>(&storage);
  int err = uv_tcp_getsockname(
      reinterpret_cast<uv_tcp_t*>(server->listener_), addr, &len);
  if (err == 0) AddressToJS(server->env(), addr, args[0].As<Object>());
  args.GetReturnValue().Set(err);
}

// writeResponses(buffer, length)
void BatchServer::Apply(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  CHECK(args[0]->IsArrayBufferView());
  CHECK(args[1]->IsUint32());
  ArrayBufferViewContents<uint8_t> buffer(args[0]);
  uint32_t length = args[1].As<Uint32>()->Value();
  CHECK_LE(length, buffer.length());
  server->ApplyResponses(buffer.data(), length);
}

// Stops accepting connections and closes the idle ones.
void BatchServer::Close(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  if (server->closing_) return;
  server->closing_ = true;
  server->StopListening();
  Connection* conn = server->connections_;
  while (conn != nullptr) {
    Connection* next = conn->next;
    if (conn->exchanges.empty() && !conn->in_message && !conn->raw)
      conn->Close(false);
    conn = next;
  }
  server->MaybeEmitClose();
}

void BatchServer::CloseIdleConnections(
    const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  Connection* conn = server->connections_;
  while (conn != nullptr) {
    Connection* next = conn->next;
    if (conn->exchanges.empty() && !conn->in_message && !conn->raw)
      conn->Close(false);
    conn = next;
  }
}

void BatchServer::CloseAllConnections(
    const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  Connection* conn = server->connections_;
  while (conn != nullptr) {
    Connection* next = conn->next;
    if (!conn->raw) conn->Close(true);
    conn = next;
  }
}

void BatchServer::Ref(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  server->refed_ = true;
  if (server->listener_ != nullptr)
    uv_ref(reinterpret_cast<uv_handle_t*>(server->listener_));
}

void BatchServer::Unref(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  server->refed_ = false;
  if (server->listener_ != nullptr)
    uv_unref(reinterpret_cast<uv_handle_t*>(server->listener_));
}

// configure(flags, lenientFlags, maxConnections, keepAliveInitialDelayMs,
//           maxHeadersCount)
void BatchServer::Configure(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  CHECK(args[0]->IsUint32());
  CHECK(args[1]->IsUint32());
  CHECK(args[2]->IsNumber());
  CHECK(args[3]->IsNumber());
  server->flags_ = args[0].As<Uint32>()->Value();
  server->lenient_flags_ = args[1].As<Uint32>()->Value();
  server->max_connections_ =
      static_cast<int64_t>(args[2].As<Number>()->Value());
  server->keep_alive_delay_ =
      static_cast<uint32_t>(args[3].As<Number>()->Value() / 1000);
  if (args[4]->IsUint32() && args[4].As<Uint32>()->Value() != 0)
    server->max_headers_ = args[4].As<Uint32>()->Value();
}

// setTimeouts(keepAliveTimeout, headersTimeout, maxHeaderSize,
//             requestTimeout, connectionsCheckingInterval, socketTimeout,
//             handshakeTimeout); all in milliseconds, 0 disables.
void BatchServer::SetTimeouts(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  uint64_t values[7];
  for (int i = 0; i < 7; i++) {
    CHECK(args[i]->IsNumber());
    values[i] = static_cast<uint64_t>(args[i].As<Number>()->Value());
  }
  server->keep_alive_timeout_ = values[0];
  server->headers_timeout_ = values[1];
  if (values[2] != 0) server->max_header_size_ = values[2];
  server->request_timeout_ = values[3];
  server->checking_interval_ = values[4];
  server->default_timeout_ = values[5];
  server->handshake_timeout_ = values[6];
  if (server->listener_ != nullptr) server->RestartSweep();
}

void BatchServer::ConnectionCount(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  args.GetReturnValue().Set(static_cast<double>(server->connection_count_));
}

static Connection* ConnectionFromArgs(
    const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This(), nullptr);
  CHECK(args[0]->IsUint32());
  Connection* conn =
      server->FindConnection(args[0].As<Uint32>()->Value());
  if (conn == nullptr || conn->closing) return nullptr;
  return conn;
}

// detach(connectionId) hands the connection over to JavaScript: it returns
// [fd, unparsed bytes] for a duplicate of the socket descriptor and forgets
// the connection, or a negative libuv error code.
void BatchServer::Detach(const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr) return args.GetReturnValue().Set(UV_EBADF);
  // Queued writes would be cancelled by the close below, and a request body
  // still to read belongs to the request.
  if (conn->writes_in_flight != 0 || !conn->out.empty() ||
      conn->exchanges.size() != 1 || !conn->exchanges.front().request_complete)
    return args.GetReturnValue().Set(UV_EBUSY);
#if HAVE_OPENSSL
  // The TLS session lives here; there is no descriptor to hand over.
  if (conn->ssl) return args.GetReturnValue().Set(UV_ENOTSUP);
#endif
#ifdef _WIN32
  args.GetReturnValue().Set(UV_ENOTSUP);
#else
  Environment* env = conn->env;
  uv_os_fd_t fd;
  int err = uv_fileno(conn->handle(), &fd);
  if (err != 0) return args.GetReturnValue().Set(err);
  Local<Object> head;
  if (!Buffer::Copy(env, conn->pending_input.data(), conn->pending_input.size())
           .ToLocal(&head)) {
    return;
  }
  int duplicate = dup(fd);
  if (duplicate < 0) return args.GetReturnValue().Set(-errno);
  conn->pending_input.clear();
  conn->announced = false;
  conn->exchanges.front().response_done = true;
  conn->Close(false);
  Local<Value> result[] = {Integer::New(env->isolate(), duplicate), head};
  args.GetReturnValue().Set(
      Array::New(env->isolate(), result, arraysize(result)));
#endif
}

// upgrade(connectionId) switches the connection to raw mode once the
// upgrade request is complete: bytes are passed through as kRawData records
// and kOpConnectionRaw writes.
void BatchServer::Upgrade(const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr) return args.GetReturnValue().Set(UV_EBADF);
  conn->raw_pending = true;
  conn->StopParsing();
  if (!conn->exchanges.empty() && conn->exchanges.front().request_complete)
    conn->SwitchToRaw();
  args.GetReturnValue().Set(0);
}

// closeConnection(connectionId, reset): reset sends a TCP RST.
void BatchServer::CloseConnection(const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr) return;
  if (args[1]->IsTrue() && !conn->is_pipe) {
    // A zero linger time turns the close into a reset.
    uv_os_fd_t fd;
    if (uv_fileno(conn->handle(), &fd) == 0) {
      struct linger l = {1, 0};
      setsockopt(reinterpret_cast<uv_os_sock_t>(fd),
                 SOL_SOCKET,
                 SO_LINGER,
                 reinterpret_cast<const char*>(&l),
                 sizeof(l));
    }
  }
  conn->Close(true);
}

void BatchServer::PauseConnection(const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr) return;
  conn->user_paused = true;
  conn->StopReading();
}

void BatchServer::ResumeConnection(const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr) return;
  conn->user_paused = false;
  if (conn->raw || !conn->parse_stopped) {
    if (conn->raw || conn->pending_input.size() <= kMaxPendingInput)
      conn->StartReading();
  }
}

void BatchServer::SetConnectionTimeout(
    const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr) return;
  CHECK(args[1]->IsNumber());
  conn->SetTimeout(static_cast<uint64_t>(args[1].As<Number>()->Value()));
}

void BatchServer::SetNoDelay(const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr || conn->is_pipe) return;
  uv_tcp_nodelay(&conn->h.tcp, args[1]->IsTrue() ? 1 : 0);
}

void BatchServer::SetKeepAlive(const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr || conn->is_pipe) return;
  CHECK(args[2]->IsNumber());
  uv_tcp_keepalive(&conn->h.tcp,
                   args[1]->IsTrue() ? 1 : 0,
                   static_cast<unsigned int>(
                       args[2].As<Number>()->Value() / 1000));
}

// writeQueueSize(connectionId): bytes not yet handed to the kernel.
void BatchServer::WriteQueueSize(const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr) return args.GetReturnValue().Set(0);
  args.GetReturnValue().Set(static_cast<double>(
      uv_stream_get_write_queue_size(conn->stream()) + conn->out.size()));
}

// watchDrain(connectionId): a kDrain record follows when the write queue is
// empty.
void BatchServer::WatchDrain(const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr) return;
  conn->drain_wanted = true;
  conn->CheckDrain();
}

// connectionAddress(connectionId, remote, out) fills out with the remote or
// local address of the connection and returns a libuv error code.
void BatchServer::ConnectionAddress(const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr) return args.GetReturnValue().Set(UV_EBADF);
  if (conn->is_pipe) return args.GetReturnValue().Set(UV_ENOTSUP);
  CHECK(args[2]->IsObject());
  sockaddr_storage storage;
  int len = sizeof(storage);
  sockaddr* addr = reinterpret_cast<sockaddr*>(&storage);
  int err = args[1]->IsTrue()
                ? uv_tcp_getpeername(&conn->h.tcp, addr, &len)
                : uv_tcp_getsockname(&conn->h.tcp, addr, &len);
  if (err == 0) AddressToJS(conn->env, addr, args[2].As<Object>());
  args.GetReturnValue().Set(err);
}

// setSecureContext(context, requestCert, rejectUnauthorized, alpn) makes the
// server speak TLS, or switches the context of new connections. `alpn` is
// the wire format list of ALPNProtocols.
void BatchServer::SetSecureContext(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
#if HAVE_OPENSSL
  CHECK(args[0]->IsObject());
  crypto::SecureContext* context;
  ASSIGN_OR_RETURN_UNWRAP(&context, args[0].As<Object>());
  server->secure_context_.reset(context);
  server->request_cert_ = args[1]->IsTrue();
  server->reject_unauthorized_ = args[2]->IsTrue();
  server->alpn_.clear();
  if (args[3]->IsArrayBufferView()) {
    ArrayBufferViewContents<char> alpn(args[3]);
    server->alpn_.assign(alpn.data(), alpn.length());
  }
  server->InstallContextCallbacks(context->ctx().get());
#else
  UNREACHABLE();
#endif
}

// enableSni() makes handshakes with a server name wait for a kServername
// answer through sniDone().
void BatchServer::EnableSni(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
#if HAVE_OPENSSL
  server->sni_enabled_ = true;
  if (server->secure_context_)
    server->InstallContextCallbacks(server->secure_context_->ctx().get());
#endif
}

// sniDone(connectionId, context) resumes a handshake suspended for SNI,
// with the given SecureContext handle or the default one.
void BatchServer::SniDone(const FunctionCallbackInfo<Value>& args) {
#if HAVE_OPENSSL
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr || !conn->ssl || !conn->sni_pending) return;
  if (args[1]->IsObject()) {
    crypto::SecureContext* context;
    ASSIGN_OR_RETURN_UNWRAP(&context, args[1].As<Object>());
    conn->sni_context.reset(context);
    conn->server->InstallContextCallbacks(context->ctx().get());
    SSL_set_SSL_CTX(conn->ssl, context->ctx().get());
  }
  conn->sni_pending = false;
  conn->OnCiphertext(nullptr, 0);
#endif
}

#if HAVE_OPENSSL
// Calls the ALPNCallback glue of JavaScript, synchronously like TLSWrap:
// alpnCallback(connectionId, offeredProtocols) returns the offset of the
// chosen protocol in the offered list, or undefined to refuse them all.
int BatchServer::CallAlpnCallback(Connection* conn,
                                  const unsigned char** out,
                                  unsigned char* outlen,
                                  const unsigned char* in,
                                  unsigned int inlen) {
  if (alpn_callback_.IsEmpty()) return SSL_TLSEXT_ERR_NOACK;
  Isolate* isolate = env()->isolate();
  HandleScope handle_scope(isolate);
  Context::Scope context_scope(env()->context());
  Local<Value> argv[2] = {Integer::NewFromUnsigned(isolate,
                                                   conn->connection_id),
                          Local<Value>()};
  if (!Buffer::Copy(env(), reinterpret_cast<const char*>(in), inlen)
           .ToLocal(&argv[1])) {
    return SSL_TLSEXT_ERR_ALERT_FATAL;
  }
  Local<Value> result;
  if (!MakeCallback(alpn_callback_.Get(isolate), arraysize(argv), argv)
           .ToLocal(&result) ||
      !result->IsNumber()) {
    return SSL_TLSEXT_ERR_ALERT_FATAL;
  }
  unsigned int offset = static_cast<unsigned int>(result.As<Number>()->Value());
  if (offset >= inlen || offset + 1 + in[offset] > inlen)
    return SSL_TLSEXT_ERR_ALERT_FATAL;
  *out = in + offset + 1;
  *outlen = in[offset];
  return SSL_TLSEXT_ERR_OK;
}
#endif

// setAlpnCallback(fn), see CallAlpnCallback().
void BatchServer::SetAlpnCallback(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
#if HAVE_OPENSSL
  CHECK(args[0]->IsFunction());
  server->alpn_callback_.Reset(server->env()->isolate(),
                               args[0].As<Function>());
#endif
}

// setRenegotiationLimit(limit, windowSeconds), from tls.CLIENT_RENEG_LIMIT
// and tls.CLIENT_RENEG_WINDOW.
void BatchServer::SetRenegotiationLimit(
    const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
#if HAVE_OPENSSL
  CHECK(args[0]->IsNumber());
  CHECK(args[1]->IsNumber());
  server->reneg_limit_ = static_cast<uint32_t>(args[0].As<Number>()->Value());
  server->reneg_window_ms_ =
      static_cast<uint64_t>(args[1].As<Number>()->Value() * 1000);
#endif
}

void BatchServer::EnableKeylog(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
#if HAVE_OPENSSL
  server->keylog_enabled_ = true;
  if (server->secure_context_)
    server->InstallContextCallbacks(server->secure_context_->ctx().get());
#endif
}

// peerCertificate(connectionId, detailed), like TLSSocket#getPeerCertificate.
void BatchServer::PeerCertificate(const FunctionCallbackInfo<Value>& args) {
#if HAVE_OPENSSL
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr || !conn->ssl) return;
  Local<Value> ret;
  if (crypto::GetPeerCert(conn->env, conn->ssl, !args[1]->IsTrue(), true)
          .ToLocal(&ret)) {
    args.GetReturnValue().Set(ret);
  }
#endif
}

// peerVerifyError(connectionId) returns null or the verification error code
// of the client certificate.
void BatchServer::PeerVerifyError(const FunctionCallbackInfo<Value>& args) {
#if HAVE_OPENSSL
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr || !conn->ssl) return;
  long err = VerifyError(conn);  // NOLINT(runtime/int)
  if (err == X509_V_OK) return args.GetReturnValue().SetNull();
  Local<Value> code;
  if (crypto::GetValidationErrorCode(conn->env, static_cast<int>(err))
          .ToLocal(&code)) {
    args.GetReturnValue().Set(code);
  }
#endif
}

// tlsInfo(connectionId, out) fills out with servername, alpnProtocol,
// protocol and cipher name.
void BatchServer::TlsInfo(const FunctionCallbackInfo<Value>& args) {
#if HAVE_OPENSSL
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr || !conn->ssl) return;
  CHECK(args[1]->IsObject());
  Isolate* isolate = conn->env->isolate();
  Local<Context> context = conn->env->context();
  Local<Object> out = args[1].As<Object>();
  auto set = [&](const char* key, const char* value) {
    Local<Value> v = value == nullptr
                         ? Local<Value>(v8::False(isolate))
                         : Local<Value>(OneByteString(isolate, value));
    out->Set(context, OneByteString(isolate, key), v).Check();
  };
  set("servername", SSL_get_servername(conn->ssl, TLSEXT_NAMETYPE_host_name));
  const unsigned char* alpn;
  unsigned int alpn_length;
  SSL_get0_alpn_selected(conn->ssl, &alpn, &alpn_length);
  std::string selected(reinterpret_cast<const char*>(alpn), alpn_length);
  set("alpnProtocol", alpn_length == 0 ? nullptr : selected.c_str());
  set("protocol", SSL_get_version(conn->ssl));
  set("cipher", SSL_get_cipher_name(conn->ssl));
  out->Set(context,
           OneByteString(isolate, "sessionReused"),
           v8::Boolean::New(isolate, SSL_session_reused(conn->ssl) == 1))
      .Check();
  out->Set(context,
           OneByteString(isolate, "secureEstablished"),
           v8::Boolean::New(isolate, conn->handshake_done))
      .Check();
#endif
}

static void Initialize(Local<Object> target,
                       Local<Value> unused,
                       Local<Context> context,
                       void* priv) {
  Environment* env = Environment::GetCurrent(context);
  Isolate* isolate = env->isolate();

  Local<FunctionTemplate> t = NewFunctionTemplate(isolate, BatchServer::New);
  t->InstanceTemplate()->SetInternalFieldCount(
      AsyncWrap::kInternalFieldCount);
  t->Inherit(AsyncWrap::GetConstructorTemplate(env));
  SetProtoMethod(isolate, t, "listen", BatchServer::Listen);
  SetProtoMethod(isolate, t, "listenPipe", BatchServer::ListenPipe);
  SetProtoMethod(isolate, t, "listenFd", BatchServer::ListenFd);
  SetProtoMethod(isolate, t, "adopt", BatchServer::Adopt);
  SetProtoMethod(isolate, t, "getsockname", BatchServer::GetSockName);
  SetProtoMethod(isolate, t, "writeResponses", BatchServer::Apply);
  SetProtoMethod(isolate, t, "close", BatchServer::Close);
  SetProtoMethod(
      isolate, t, "closeIdleConnections", BatchServer::CloseIdleConnections);
  SetProtoMethod(
      isolate, t, "closeAllConnections", BatchServer::CloseAllConnections);
  SetProtoMethod(isolate, t, "ref", BatchServer::Ref);
  SetProtoMethod(isolate, t, "unref", BatchServer::Unref);
  SetProtoMethod(isolate, t, "configure", BatchServer::Configure);
  SetProtoMethod(isolate, t, "setTimeouts", BatchServer::SetTimeouts);
  SetProtoMethod(isolate, t, "connectionCount", BatchServer::ConnectionCount);
  SetProtoMethod(isolate, t, "detach", BatchServer::Detach);
  SetProtoMethod(isolate, t, "upgrade", BatchServer::Upgrade);
  SetProtoMethod(isolate, t, "closeConnection", BatchServer::CloseConnection);
  SetProtoMethod(isolate, t, "pauseConnection", BatchServer::PauseConnection);
  SetProtoMethod(
      isolate, t, "resumeConnection", BatchServer::ResumeConnection);
  SetProtoMethod(
      isolate, t, "setConnectionTimeout", BatchServer::SetConnectionTimeout);
  SetProtoMethod(isolate, t, "setNoDelay", BatchServer::SetNoDelay);
  SetProtoMethod(isolate, t, "setKeepAlive", BatchServer::SetKeepAlive);
  SetProtoMethod(isolate, t, "writeQueueSize", BatchServer::WriteQueueSize);
  SetProtoMethod(isolate, t, "watchDrain", BatchServer::WatchDrain);
  SetProtoMethod(
      isolate, t, "connectionAddress", BatchServer::ConnectionAddress);
  SetProtoMethod(
      isolate, t, "setSecureContext", BatchServer::SetSecureContext);
  SetProtoMethod(isolate, t, "enableSni", BatchServer::EnableSni);
  SetProtoMethod(isolate, t, "sniDone", BatchServer::SniDone);
  SetProtoMethod(isolate, t, "enableKeylog", BatchServer::EnableKeylog);
  SetProtoMethod(
      isolate, t, "setAlpnCallback", BatchServer::SetAlpnCallback);
  SetProtoMethod(isolate,
                 t,
                 "setRenegotiationLimit",
                 BatchServer::SetRenegotiationLimit);
  SetProtoMethod(isolate, t, "peerCertificate", BatchServer::PeerCertificate);
  SetProtoMethod(isolate, t, "peerVerifyError", BatchServer::PeerVerifyError);
  SetProtoMethod(isolate, t, "tlsInfo", BatchServer::TlsInfo);
  SetConstructorFunction(context, target, "BatchServer", t);

  v8::LocalVector<Value> headers(isolate);
  for (const std::string& name : KnownHeaderNames()) {
    headers.push_back(OneByteString(isolate, name.data(), name.size()));
  }
  target
      ->Set(context,
            FIXED_ONE_BYTE_STRING(isolate, "knownHeaders"),
            Array::New(isolate, headers.data(), headers.size()))
      .Check();

  // Method names indexed by llhttp's method number.
  v8::LocalVector<Value> methods(isolate, 64);
  for (size_t i = 0; i < methods.size(); i++)
    methods[i] = v8::Undefined(isolate);
#define V(num, name, string)                                                   \
  methods[num] = FIXED_ONE_BYTE_STRING(isolate, #string);
  HTTP_METHOD_MAP(V)
#undef V
  target
      ->Set(context,
            FIXED_ONE_BYTE_STRING(isolate, "methods"),
            Array::New(isolate, methods.data(), methods.size()))
      .Check();
}

static void RegisterExternalReferences(ExternalReferenceRegistry* registry) {
  registry->Register(BatchServer::New);
  registry->Register(BatchServer::Listen);
  registry->Register(BatchServer::ListenPipe);
  registry->Register(BatchServer::ListenFd);
  registry->Register(BatchServer::Adopt);
  registry->Register(BatchServer::GetSockName);
  registry->Register(BatchServer::Apply);
  registry->Register(BatchServer::Close);
  registry->Register(BatchServer::CloseIdleConnections);
  registry->Register(BatchServer::CloseAllConnections);
  registry->Register(BatchServer::Ref);
  registry->Register(BatchServer::Unref);
  registry->Register(BatchServer::Configure);
  registry->Register(BatchServer::SetTimeouts);
  registry->Register(BatchServer::ConnectionCount);
  registry->Register(BatchServer::Detach);
  registry->Register(BatchServer::Upgrade);
  registry->Register(BatchServer::CloseConnection);
  registry->Register(BatchServer::PauseConnection);
  registry->Register(BatchServer::ResumeConnection);
  registry->Register(BatchServer::SetConnectionTimeout);
  registry->Register(BatchServer::SetNoDelay);
  registry->Register(BatchServer::SetKeepAlive);
  registry->Register(BatchServer::WriteQueueSize);
  registry->Register(BatchServer::WatchDrain);
  registry->Register(BatchServer::ConnectionAddress);
  registry->Register(BatchServer::SetSecureContext);
  registry->Register(BatchServer::EnableSni);
  registry->Register(BatchServer::SniDone);
  registry->Register(BatchServer::EnableKeylog);
  registry->Register(BatchServer::SetAlpnCallback);
  registry->Register(BatchServer::SetRenegotiationLimit);
  registry->Register(BatchServer::PeerCertificate);
  registry->Register(BatchServer::PeerVerifyError);
  registry->Register(BatchServer::TlsInfo);
}

}  // namespace http_batch
}  // namespace node

NODE_BINDING_CONTEXT_AWARE_INTERNAL(http_batch,
                                    node::http_batch::Initialize)
NODE_BINDING_EXTERNAL_REFERENCE(http_batch,
                                node::http_batch::RegisterExternalReferences)
