// An HTTP/1.1 server whose JavaScript layer is fed in batches.
//
// Sockets and llhttp live here. Every request head and body chunk parsed
// during one event loop iteration is appended to a flat little-endian outbox,
// and a single call into JavaScript delivers the whole batch from a check
// handle. JavaScript answers with one apply() call carrying every response
// produced so far, which is written to the sockets before apply() returns.
//
// Request head record (native -> JS):
//   u32 id, u8 flags, u8 method, u8 http_major, u8 http_minor,
//   u32 url_length, u16 header_count, u16 reserved, u32 connection_id,
//   url bytes, then
//   header_count times: u16 name (kKnownHeader | index, or the byte length
//   followed by the name), u32 value_length, value bytes.
// Request body record (native -> JS):
//   u32 id, u32 length, data. Length 0 ends the body, kBodyAbort reports that
//   the exchange was abandoned (client gone or parse error) and has no data.
//   kConnectionClosed reports, in place of the request id, the connection
//   id of a connection that carried at least one request and is now gone.
//   kTrailers is followed by u32 length and the trailer fields of a chunked
//   body: u16 count, then fields encoded as in the head record.
// Response record (JS -> native), padded to a multiple of 4 bytes:
//   u8 op, u8 flags, u16 status, u32 id, u32 head_length, u32 body_length,
//   head bytes (status line and user headers, CRLF terminated), body bytes.

#include "async_context_frame.h"
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
#include <string>
#include <unordered_map>
#include <vector>

#ifndef _WIN32
#include <unistd.h>  // dup()
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
using v8::Object;
using v8::String;
using v8::Uint32;
using v8::Value;

constexpr size_t kSlabSize = 64 * 1024;
constexpr size_t kMaxPendingInput = 64 * 1024;
constexpr size_t kHeadPrefix = 20;
constexpr size_t kResponsePrefix = 16;
constexpr uint32_t kBodyAbort = 0xFFFFFFFF;
constexpr uint32_t kConnectionClosed = 0xFFFFFFFE;
constexpr uint32_t kTrailers = 0xFFFFFFFD;
constexpr uint16_t kKnownHeader = 0x8000;
constexpr uint64_t kSweepIntervalMs = 1000;

enum HeadFlags : uint8_t {
  kHasBody = 1 << 0,
  kUpgrade = 1 << 1,
  kKeepAlive = 1 << 2,
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

class BatchServer;

struct Connection {
  uv_tcp_t handle;
  llhttp_t parser;
  Environment* env;
  BatchServer* server;  // nullptr once the server is gone.
  Connection* prev = nullptr;
  Connection* next = nullptr;

  std::string head;           // Request head record being built.
  std::string pending_input;  // Unparsed bytes while the parser is paused.
  std::string out;            // Response bytes staged during one apply().

  size_t name_pos = 0;
  size_t value_pos = SIZE_MAX;
  int current_header = -1;
  uint32_t id = 0;
  uint32_t connection_id = 0;
  uint32_t url_length = 0;
  uint32_t header_bytes = 0;
  uint16_t header_count = 0;
  uint32_t writes_in_flight = 0;
  uint64_t last_active = 0;
  uint64_t message_start = 0;

  bool in_header_field = false;
  bool in_message = false;
  bool has_body = false;
  bool expect_continue = false;
  bool keep_alive = true;
  bool head_method = false;
  bool http10 = false;
  bool request_complete = false;
  bool response_started = false;
  bool response_done = false;
  bool response_no_body = false;
  bool chunked = false;
  bool close_after_response = false;
  bool paused = false;
  bool reading = false;
  bool touched = false;
  bool shutdown_requested = false;
  bool closing = false;
  bool announced = false;    // JavaScript has seen this connection.
  bool user_paused = false;  // JavaScript asked to stop reading.
  bool read_eof = false;      // The client ended its side.
  bool delivered = false;     // JavaScript has seen the current request.
  bool eof_grace = false;     // One more iteration to answer after EOF.
  bool in_eof_list = false;
  bool headers_done = false;  // Fields from now on are trailers.
  bool in_trailers = false;

  inline uv_stream_t* stream() {
    return reinterpret_cast<uv_stream_t*>(&handle);
  }

  void ResetExchange();
  void Execute(const char* data, size_t len);
  void Feed(const char* data, size_t len);
  void FinishExchange();
  void OnParseError(llhttp_errno_t err);
  void StartReading();
  void StopReading();
  void FlushOut();
  void Shutdown();
  void Close(bool notify);
  void FinishValue();

  static Connection* From(llhttp_t* p) {
    return static_cast<Connection*>(p->data);
  }
};

class BatchServer : public BaseObject {
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
  static void GetSockName(const FunctionCallbackInfo<Value>& args);
  static void Apply(const FunctionCallbackInfo<Value>& args);
  static void Close(const FunctionCallbackInfo<Value>& args);
  static void CloseIdleConnections(const FunctionCallbackInfo<Value>& args);
  static void CloseAllConnections(const FunctionCallbackInfo<Value>& args);
  static void Ref(const FunctionCallbackInfo<Value>& args);
  static void Unref(const FunctionCallbackInfo<Value>& args);
  static void SetTimeouts(const FunctionCallbackInfo<Value>& args);
  static void Detach(const FunctionCallbackInfo<Value>& args);
  static void CloseConnection(const FunctionCallbackInfo<Value>& args);
  static void PauseConnection(const FunctionCallbackInfo<Value>& args);
  static void ResumeConnection(const FunctionCallbackInfo<Value>& args);
  static void ConnectionAddress(const FunctionCallbackInfo<Value>& args);

  void MemoryInfo(MemoryTracker* tracker) const override;
  SET_MEMORY_INFO_NAME(BatchServer)
  SET_SELF_SIZE(BatchServer)

  uint32_t NextId() {
    if (++next_id_ == 0) next_id_ = 1;
    return next_id_;
  }

  void PushHead(Connection* conn) {
    heads_.append(conn->head);
    ids_[conn->id] = conn;
    conn->delivered = false;
    pushed_.push_back(conn);
    ScheduleFlush();
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

  void ForgetPushed(Connection* conn) {
    for (size_t i = 0; i < pushed_.size(); i++) {
      if (pushed_[i] == conn) pushed_[i] = nullptr;
    }
  }

  void PushBody(uint32_t id, const char* data, uint32_t len) {
    AppendU32(&bodies_, id);
    AppendU32(&bodies_, len);
    if (len != 0 && len != kBodyAbort) bodies_.append(data, len);
    ScheduleFlush();
  }

  void Forget(uint32_t id) { ids_.erase(id); }

  void PushTrailers(uint32_t id, const std::string& fields) {
    AppendU32(&bodies_, id);
    AppendU32(&bodies_, kTrailers);
    AppendU32(&bodies_, static_cast<uint32_t>(fields.size()));
    bodies_.append(fields);
    ScheduleFlush();
  }

  void PushConnectionClosed(uint32_t connection_id) {
    AppendU32(&bodies_, connection_id);
    AppendU32(&bodies_, kConnectionClosed);
    ScheduleFlush();
  }

  Connection* FindConnection(uint32_t connection_id) {
    auto it = connections_by_id_.find(connection_id);
    return it == connections_by_id_.end() ? nullptr : it->second;
  }
  void Link(Connection* conn);
  void Unlink(Connection* conn);

  uint64_t max_header_size() const { return max_header_size_; }
  uv_loop_t* loop() { return env()->event_loop(); }
  char* slab() { return slab_.get(); }
  const std::string& date() const { return date_; }

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
                 uint8_t flags,
                 uint16_t status,
                 const uint8_t* head,
                 uint32_t head_length,
                 uint32_t body_length,
                 bool complete);
  void UpdateDate();
  void StopListening();
  void MaybeEmitClose();
  void Sweep();

  std::unique_ptr<char[]> slab_;
  uv_tcp_t* listener_ = nullptr;
  uv_check_t* check_ = nullptr;
  uv_idle_t* idle_ = nullptr;
  uv_timer_t* sweep_ = nullptr;

  Global<Function> on_batch_;
  Global<Function> on_close_;
  Global<Value> context_frame_;
  std::shared_ptr<BackingStore> shared_;
  char* shared_data_;
  size_t shared_length_;

  std::string heads_;
  std::string bodies_;
  std::unordered_map<uint32_t, Connection*> ids_;
  std::unordered_map<uint32_t, Connection*> connections_by_id_;
  std::vector<Connection*> touched_;
  // Connections whose head is in heads_, and connections the client ended.
  std::vector<Connection*> pushed_;
  std::vector<Connection*> eof_;
  Connection* connections_ = nullptr;
  size_t connection_count_ = 0;

  uint64_t max_header_size_;
  uint64_t keep_alive_timeout_ = 5000;
  uint64_t headers_timeout_ = 60000;
  time_t date_time_ = 0;
  std::string date_;
  uint32_t next_id_ = 0;
  uint32_t next_connection_id_ = 0;
  bool flush_scheduled_ = false;
  bool listening_ = false;
  bool closing_ = false;
  bool close_emitted_ = false;
  bool refed_ = true;

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
  conn->message_start = uv_now(conn->server->loop());
  return 0;
}

static inline int CountHeaderBytes(Connection* conn, size_t len) {
  conn->header_bytes += static_cast<uint32_t>(len);
  if (conn->header_bytes > conn->server->max_header_size()) {
    llhttp_set_error_reason(&conn->parser,
                            "HPE_HEADER_OVERFLOW:Header overflow");
    return HPE_USER;
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
      llhttp_set_error_reason(p, "HPE_HEADER_OVERFLOW:Header overflow");
      return HPE_USER;
    }
    WriteU16(&conn->head, conn->name_pos, static_cast<uint16_t>(name_length));
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
      value_length == 12) {
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
  conn->id = server->NextId();
  conn->has_body = (p->flags & F_CHUNKED) ||
                   ((p->flags & F_CONTENT_LENGTH) && p->content_length > 0);
  conn->keep_alive = llhttp_should_keep_alive(p);
  conn->head_method = p->method == HTTP_HEAD;
  conn->http10 = p->http_major == 1 && p->http_minor == 0;
  // Upgrades and CONNECT are answered as plain requests, then the
  // connection is closed.
  if (p->upgrade) conn->close_after_response = true;

  std::string& h = conn->head;
  WriteU32(&h, 0, conn->id);
  h[4] = static_cast<char>((conn->has_body ? kHasBody : 0) |
                           (p->upgrade ? kUpgrade : 0) |
                           (conn->keep_alive ? kKeepAlive : 0));
  h[5] = static_cast<char>(p->method);
  h[6] = static_cast<char>(p->http_major);
  h[7] = static_cast<char>(p->http_minor);
  WriteU32(&h, 8, conn->url_length);
  WriteU16(&h, 12, conn->header_count);
  WriteU32(&h, 16, conn->connection_id);
  conn->announced = true;
  server->PushHead(conn);

  if (conn->expect_continue && conn->has_body && !conn->http10) {
    conn->out.append("HTTP/1.1 100 Continue\r\n\r\n");
    conn->FlushOut();
  }
  return 0;
}

static int OnBody(llhttp_t* p, const char* at, size_t len) {
  Connection* conn = Connection::From(p);
  // An early response ends the exchange for JavaScript; the rest of the
  // body is read and dropped.
  if (!conn->response_done)
    conn->server->PushBody(conn->id, at, static_cast<uint32_t>(len));
  return 0;
}

static int OnMessageComplete(llhttp_t* p) {
  Connection* conn = Connection::From(p);
  conn->request_complete = true;
  conn->last_active = uv_now(conn->server->loop());
  if (!conn->response_done) {
    if (conn->in_trailers) {
      conn->FinishValue();
      WriteU16(&conn->head, 0, conn->header_count);
      conn->server->PushTrailers(conn->id, conn->head);
    }
    if (conn->has_body) conn->server->PushBody(conn->id, nullptr, 0);
    // Whatever follows an upgrade request may belong to another protocol:
    // leave it in the kernel until JavaScript takes the connection over.
    if (p->upgrade) conn->StopReading();
    return HPE_PAUSED;
  }
  // The response went out before the body was fully read.
  if (!conn->keep_alive || conn->close_after_response) {
    return HPE_PAUSED;
  }
  conn->ResetExchange();
  return 0;
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
    s.on_message_complete = OnMessageComplete;
    return s;
  }();
  return &settings;
}

// Connection.

void Connection::ResetExchange() {
  if (id != 0 && server != nullptr) server->Forget(id);
  id = 0;
  has_body = false;
  request_complete = false;
  response_started = false;
  response_done = false;
  response_no_body = false;
  chunked = false;
  delivered = false;
  eof_grace = false;
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
  llhttp_errno_t err = llhttp_execute(&parser, data, len);
  if (err == HPE_OK) return;
  if (err == HPE_PAUSED || err == HPE_PAUSED_UPGRADE) {
    paused = true;
    if (err == HPE_PAUSED_UPGRADE) {
      // Bytes after an upgrade request are not HTTP. They are handed over
      // with the connection by detach(), or dropped with it.
      close_after_response = true;
      StopReading();
    }
    const char* pos = llhttp_get_error_pos(&parser);
    pending_input.assign(pos, data + len - pos);
    // Paused after an early response that closes the connection.
    if (response_done && request_complete) FinishExchange();
    return;
  }
  OnParseError(err);
}

void Connection::OnParseError(llhttp_errno_t err) {
  const bool overflow =
      err == HPE_USER && strncmp(llhttp_get_error_reason(&parser),
                                 "HPE_HEADER_OVERFLOW",
                                 19) == 0;
  if (!response_started) {
    out.append(overflow ? "HTTP/1.1 431 Request Header Fields Too Large\r\n"
                        : "HTTP/1.1 400 Bad Request\r\n");
    out.append("Connection: close\r\n\r\n");
    FlushOut();
  }
  if (id != 0 && !response_done) {
    server->PushBody(id, nullptr, kBodyAbort);
    response_done = true;
  }
  Shutdown();
}

void Connection::FinishExchange() {
  last_active = uv_now(server->loop());
  // As in node:http, close() does not end busy keep-alive connections; they
  // stay open until they are idle and time out, or the client leaves.
  bool close = !keep_alive || close_after_response;
  ResetExchange();
  if (close) {
    Shutdown();
    return;
  }
  if (!paused) return;
  llhttp_resume(&parser);
  paused = false;
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
  if (read_eof) {
    if (id == 0 && !closing) Shutdown();
    return;
  }
  if (!paused && !closing) StartReading();
}

static void OnAlloc(uv_handle_t* handle, size_t, uv_buf_t* buf) {
  Connection* conn = ContainerOf(&Connection::handle,
                                 reinterpret_cast<uv_tcp_t*>(handle));
  *buf = uv_buf_init(conn->server->slab(), kSlabSize);
}

static void OnRead(uv_stream_t* stream, ssize_t nread, const uv_buf_t* buf) {
  Connection* conn = ContainerOf(&Connection::handle,
                                 reinterpret_cast<uv_tcp_t*>(stream));
  if (conn->closing) return;
  if (nread > 0) {
    conn->last_active = uv_now(conn->server->loop());
    conn->Feed(buf->base, static_cast<size_t>(nread));
  } else if (nread == UV_EOF) {
    conn->StopReading();
    conn->read_eof = true;
    if (conn->id != 0 && !conn->request_complete) {
      // The request body was cut short.
      if (!conn->response_done) {
        conn->server->PushBody(conn->id, nullptr, kBodyAbort);
        conn->response_done = true;
      }
      conn->Shutdown();
    } else if (conn->id == 0 && conn->pending_input.empty()) {
      conn->Shutdown();
    } else {
      conn->server->AddEof(conn);
    }
  } else if (nread < 0) {
    conn->Close(true);
  }
}

void Connection::StartReading() {
  if (reading || closing || user_paused) return;
  if (uv_read_start(stream(), OnAlloc, OnRead) == 0) reading = true;
}

void Connection::StopReading() {
  if (!reading) return;
  uv_read_stop(stream());
  reading = false;
}

struct WriteReq {
  uv_write_t req;
  std::string data;
};

static void AfterWrite(uv_write_t* req, int status) {
  WriteReq* w = ContainerOf(&WriteReq::req, req);
  Connection* conn = ContainerOf(&Connection::handle,
                                 reinterpret_cast<uv_tcp_t*>(req->handle));
  delete w;
  conn->writes_in_flight--;
  if (status < 0 && status != UV_ECANCELED) conn->Close(true);
}

void Connection::FlushOut() {
  if (out.empty() || closing) {
    out.clear();
    return;
  }
  size_t offset = 0;
  if (writes_in_flight == 0) {
    uv_buf_t buf = uv_buf_init(out.data(), out.size());
    int r = uv_try_write(stream(), &buf, 1);
    if (r == static_cast<int>(out.size())) {
      out.clear();
      return;
    }
    if (r < 0 && r != UV_EAGAIN && r != UV_ENOSYS) {
      out.clear();
      Close(true);
      return;
    }
    if (r > 0) offset = r;
  }
  WriteReq* w = new WriteReq();
  if (offset == 0) {
    w->data.swap(out);
  } else {
    w->data.assign(out, offset, std::string::npos);
    out.clear();
  }
  uv_buf_t buf = uv_buf_init(w->data.data(), w->data.size());
  int err = uv_write(&w->req, stream(), &buf, 1, AfterWrite);
  if (err != 0) {
    delete w;
    Close(true);
    return;
  }
  writes_in_flight++;
}

static void OnConnectionClosed(uv_tcp_t* handle) {
  Connection* conn = ContainerOf(&Connection::handle, handle);
  delete conn;
}

void Connection::Close(bool notify) {
  if (uv_is_closing(reinterpret_cast<uv_handle_t*>(&handle))) return;
  closing = true;
  reading = false;
  if (server != nullptr) {
    server->RemoveEof(this);
    server->ForgetPushed(this);
    if (id != 0 && !response_done && notify)
      server->PushBody(id, nullptr, kBodyAbort);
    if (announced) server->PushConnectionClosed(connection_id);
    ResetExchange();
    server->Unlink(this);
  }
  env->CloseHandle(&handle, OnConnectionClosed);
}

static void AfterShutdown(uv_shutdown_t* req, int status) {
  Connection* conn = static_cast<Connection*>(req->data);
  delete req;
  conn->Close(true);
}

void Connection::Shutdown() {
  if (closing) return;
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

// BatchServer.

BatchServer::BatchServer(Environment* env,
                         Local<Object> object,
                         Local<Function> on_batch,
                         Local<Function> on_close,
                         std::shared_ptr<BackingStore> shared,
                         char* shared_data,
                         size_t shared_length)
    : BaseObject(env, object),
      slab_(new char[kSlabSize]),
      on_batch_(env->isolate(), on_batch),
      on_close_(env->isolate(), on_close),
      context_frame_(env->isolate(),
                     async_context_frame::current(env->isolate())),
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
}

template <typename T>
static void FreeHandle(T* handle) {
  delete handle;
}

BatchServer::~BatchServer() {
  Environment* env = this->env();
  if (listener_ != nullptr) {
    env->CloseHandle(listener_, FreeHandle<uv_tcp_t>);
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
    if (!uv_is_closing(reinterpret_cast<uv_handle_t*>(&conn->handle)))
      env->CloseHandle(&conn->handle, OnConnectionClosed);
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
  if (!heads_.empty() || !bodies_.empty()) {
    for (Connection* conn : pushed_) {
      if (conn != nullptr) conn->delivered = true;
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
  for (size_t i = 0; i < eof_.size();) {
    Connection* conn = eof_[i];
    if (conn->closing) {
      conn->in_eof_list = false;
      eof_.erase(eof_.begin() + i);
      continue;
    }
    if (conn->id == 0) {
      conn->in_eof_list = false;
      eof_.erase(eof_.begin() + i);
      conn->Shutdown();
      continue;
    }
    if (conn->delivered && !conn->response_done) {
      if (!conn->eof_grace) {
        conn->eof_grace = true;
        ScheduleFlush();
      } else {
        PushBody(conn->id, nullptr, kBodyAbort);
        conn->response_done = true;
        conn->in_eof_list = false;
        eof_.erase(eof_.begin() + i);
        conn->Shutdown();
        continue;
      }
    }
    i++;
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
  InternalMakeCallback(env(),
                       object(),
                       object(),
                       on_batch_.Get(isolate),
                       arraysize(argv),
                       argv,
                       {0, 0},
                       context_frame_.Get(isolate));
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
                            uint8_t flags,
                            uint16_t status,
                            const uint8_t* head,
                            uint32_t head_length,
                            uint32_t body_length,
                            bool complete) {
  std::string& out = conn->out;
  conn->response_started = true;
  const bool status_no_body =
      status == 204 || status == 304 || (status >= 100 && status < 200);
  conn->response_no_body = status_no_body || conn->head_method;
  out.append(reinterpret_cast<const char*>(head), head_length);
  if (!(flags & kUserDate)) out.append(date_);

  if (flags & kUserConnectionClose) conn->close_after_response = true;
  bool close = conn->close_after_response || !conn->keep_alive;

  if (complete) {
    conn->chunked = false;
    if ((flags & kUserTransferEncoding) && !conn->response_no_body) {
      conn->chunked = true;
    } else if (!(flags & kUserContentLength) && !status_no_body) {
      out.append("Content-Length: ");
      AppendDecimal(&out, body_length);
      out.append("\r\n");
    }
  } else if ((flags & kUserContentLength) || conn->response_no_body) {
    conn->chunked = false;
  } else if (conn->http10) {
    // No chunked encoding before HTTP/1.1: the end of the body is the end
    // of the connection.
    conn->chunked = false;
    close = true;
  } else {
    conn->chunked = true;
    if (!(flags & kUserTransferEncoding))
      out.append("Transfer-Encoding: chunked\r\n");
  }

  if (close) conn->close_after_response = true;
  if (!(flags & kUserConnection)) {
    if (close) {
      out.append("Connection: close\r\n");
    } else if (conn->http10) {
      out.append("Connection: keep-alive\r\n");
    }
  }
  out.append("\r\n");
}

static inline void AppendChunk(Connection* conn,
                               const uint8_t* data,
                               uint32_t len) {
  if (conn->response_no_body || len == 0) return;
  if (conn->chunked) {
    AppendHex(&conn->out, len);
    conn->out.append("\r\n");
    conn->out.append(reinterpret_cast<const char*>(data), len);
    conn->out.append("\r\n");
  } else {
    conn->out.append(reinterpret_cast<const char*>(data), len);
  }
}

static inline void EndResponse(Connection* conn) {
  if (conn->chunked && !conn->response_no_body) conn->out.append("0\r\n\r\n");
  conn->response_done = true;
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

    if (op == kOpShutdown) {
      Connection* conn = FindConnection(id);
      if (conn == nullptr || conn->closing) continue;
      conn->shutdown_requested = true;
      if (!conn->touched) {
        conn->touched = true;
        touched_.push_back(conn);
      }
      continue;
    }

    auto it = ids_.find(id);
    if (it == ids_.end()) continue;  // The client went away.
    Connection* conn = it->second;
    if (conn->closing || conn->response_done) continue;

    switch (op) {
      case kOpComplete:
        WriteHead(conn, flags, status, head, head_length, body_length, true);
        AppendChunk(conn, body, body_length);
        EndResponse(conn);
        break;
      case kOpHead:
        WriteHead(conn, flags, status, head, head_length, 0, false);
        break;
      case kOpData:
        AppendChunk(conn, body, body_length);
        break;
      case kOpEnd:
        if (flags & kUserConnectionClose) conn->close_after_response = true;
        EndResponse(conn);
        break;
      case kOpRaw:
        conn->response_started = true;
        conn->chunked = false;
        conn->out.append(reinterpret_cast<const char*>(body), body_length);
        break;
      case kOpDestroy:
        conn->out.clear();
        conn->Close(false);
        continue;
      default:
        continue;
    }
    if (!conn->touched) {
      conn->touched = true;
      touched_.push_back(conn);
    }
  }

  // Connections are only freed from uv_close callbacks, so every pointer in
  // touched_ is still valid here.
  for (size_t i = 0; i < touched_.size(); i++) {
    Connection* conn = touched_[i];
    conn->touched = false;
    if (conn->closing) continue;
    conn->FlushOut();
    if (conn->shutdown_requested) {
      conn->Shutdown();
    } else if (conn->response_done && conn->request_complete &&
               !conn->closing) {
      conn->FinishExchange();
    }
  }
  touched_.clear();
}

void BatchServer::OnConnection(uv_stream_t* listener, int status) {
  BatchServer* server = static_cast<BatchServer*>(listener->data);
  if (status != 0) return;
  Connection* conn = new Connection();
  conn->env = server->env();
  conn->server = server;
  CHECK_EQ(0, uv_tcp_init(server->loop(), &conn->handle));
  if (uv_accept(listener, conn->stream()) != 0) {
    conn->closing = true;
    conn->server = nullptr;
    server->env()->CloseHandle(&conn->handle, OnConnectionClosed);
    return;
  }
  uv_tcp_nodelay(&conn->handle, 1);
  llhttp_init(&conn->parser, HTTP_REQUEST, Settings());
  conn->parser.data = conn;
  conn->head.reserve(512);
  conn->out.reserve(512);
  conn->last_active = uv_now(server->loop());
  server->Link(conn);
  if (server->closing_) {
    conn->Close(false);
    return;
  }
  conn->StartReading();
}

void BatchServer::OnSweep(uv_timer_t* handle) {
  static_cast<BatchServer*>(handle->data)->Sweep();
}

void BatchServer::Sweep() {
  uint64_t now = uv_now(loop());
  Connection* conn = connections_;
  while (conn != nullptr) {
    Connection* next = conn->next;
    if (!conn->closing) {
      if (conn->in_message) {
        if (headers_timeout_ != 0 &&
            now - conn->message_start >= headers_timeout_) {
          conn->out.append(
              "HTTP/1.1 408 Request Timeout\r\nConnection: close\r\n\r\n");
          conn->FlushOut();
          conn->Shutdown();
        }
      } else if (conn->id == 0 && keep_alive_timeout_ != 0 &&
                 conn->writes_in_flight == 0 &&
                 now - conn->last_active >= keep_alive_timeout_) {
        conn->Close(false);
      }
    }
    conn = next;
  }
}

void BatchServer::StopListening() {
  if (listener_ == nullptr) return;
  listening_ = false;
  env()->CloseHandle(listener_, FreeHandle<uv_tcp_t>);
  listener_ = nullptr;
}

void BatchServer::MaybeEmitClose() {
  if (!closing_ || close_emitted_ || connection_count_ != 0) return;
  close_emitted_ = true;
  uv_timer_stop(sweep_);
  Isolate* isolate = env()->isolate();
  HandleScope handle_scope(isolate);
  Context::Scope context_scope(env()->context());
  BaseObjectPtr<BatchServer> strong_ref{this};
  MakeWeak();
  // Emitted from a native immediate: this may run inside a uv_close
  // callback or from close() itself.
  env()->SetImmediate([strong_ref](Environment* env) {
    HandleScope handle_scope(env->isolate());
    Context::Scope context_scope(env->context());
    BatchServer* server = strong_ref.get();
    InternalMakeCallback(env,
                         server->object(),
                         server->object(),
                         server->on_close_.Get(env->isolate()),
                         0,
                         nullptr,
                         {0, 0},
                         server->context_frame_.Get(env->isolate()));
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

  uv_tcp_t* listener = new uv_tcp_t();
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
    env->CloseHandle(listener, FreeHandle<uv_tcp_t>);
    return args.GetReturnValue().Set(err);
  }
  if (!server->refed_) uv_unref(reinterpret_cast<uv_handle_t*>(listener));
  server->listener_ = listener;
  server->listening_ = true;
  uv_timer_start(server->sweep_, OnSweep, kSweepIntervalMs, kSweepIntervalMs);
  args.GetReturnValue().Set(0);
}

void BatchServer::GetSockName(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  CHECK(args[0]->IsObject());
  if (server->listener_ == nullptr)
    return args.GetReturnValue().Set(UV_EBADF);
  sockaddr_storage storage;
  int len = sizeof(storage);
  sockaddr* addr = reinterpret_cast<sockaddr*>(&storage);
  int err = uv_tcp_getsockname(server->listener_, addr, &len);
  if (err == 0) AddressToJS(server->env(), addr, args[0].As<Object>());
  args.GetReturnValue().Set(err);
}

// apply(buffer, length)
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

// Stops accepting connections. Idle connections close now, busy ones after
// their current response.
void BatchServer::Close(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  if (server->closing_) return;
  server->closing_ = true;
  server->StopListening();
  Connection* conn = server->connections_;
  while (conn != nullptr) {
    Connection* next = conn->next;
    if (conn->id == 0 && !conn->in_message) conn->Close(false);
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
    if (conn->id == 0 && !conn->in_message) conn->Close(false);
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
    conn->Close(true);
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

// setTimeouts(keepAliveTimeoutMs, headersTimeoutMs, maxHeaderSize)
void BatchServer::SetTimeouts(const FunctionCallbackInfo<Value>& args) {
  BatchServer* server;
  ASSIGN_OR_RETURN_UNWRAP(&server, args.This());
  CHECK(args[0]->IsNumber());
  CHECK(args[1]->IsNumber());
  CHECK(args[2]->IsNumber());
  server->keep_alive_timeout_ =
      static_cast<uint64_t>(args[0].As<v8::Number>()->Value());
  server->headers_timeout_ =
      static_cast<uint64_t>(args[1].As<v8::Number>()->Value());
  uint64_t max_header_size =
      static_cast<uint64_t>(args[2].As<v8::Number>()->Value());
  if (max_header_size != 0) server->max_header_size_ = max_header_size;
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
  // Queued writes would be cancelled by the close below.
  if (conn->writes_in_flight != 0 || !conn->out.empty())
    return args.GetReturnValue().Set(UV_EBUSY);
#ifdef _WIN32
  args.GetReturnValue().Set(UV_ENOTSUP);
#else
  Environment* env = conn->env;
  uv_os_fd_t fd;
  int err = uv_fileno(reinterpret_cast<uv_handle_t*>(&conn->handle), &fd);
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
  conn->Close(false);
  Local<Value> result[] = {Integer::New(env->isolate(), duplicate), head};
  args.GetReturnValue().Set(
      Array::New(env->isolate(), result, arraysize(result)));
#endif
}

void BatchServer::CloseConnection(const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn != nullptr) conn->Close(true);
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
  if (conn->pending_input.size() <= kMaxPendingInput) conn->StartReading();
}

// connectionAddress(connectionId, remote, out) fills out with the remote or
// local address of the connection and returns a libuv error code.
void BatchServer::ConnectionAddress(const FunctionCallbackInfo<Value>& args) {
  Connection* conn = ConnectionFromArgs(args);
  if (conn == nullptr) return args.GetReturnValue().Set(UV_EBADF);
  CHECK(args[2]->IsObject());
  sockaddr_storage storage;
  int len = sizeof(storage);
  sockaddr* addr = reinterpret_cast<sockaddr*>(&storage);
  int err = args[1]->IsTrue()
                ? uv_tcp_getpeername(&conn->handle, addr, &len)
                : uv_tcp_getsockname(&conn->handle, addr, &len);
  if (err == 0) AddressToJS(conn->env, addr, args[2].As<Object>());
  args.GetReturnValue().Set(err);
}

static void Initialize(Local<Object> target,
                       Local<Value> unused,
                       Local<Context> context,
                       void* priv) {
  Environment* env = Environment::GetCurrent(context);
  Isolate* isolate = env->isolate();

  Local<FunctionTemplate> t = NewFunctionTemplate(isolate, BatchServer::New);
  t->InstanceTemplate()->SetInternalFieldCount(
      BaseObject::kInternalFieldCount);
  SetProtoMethod(isolate, t, "listen", BatchServer::Listen);
  SetProtoMethod(isolate, t, "getsockname", BatchServer::GetSockName);
  SetProtoMethod(isolate, t, "writeResponses", BatchServer::Apply);
  SetProtoMethod(isolate, t, "close", BatchServer::Close);
  SetProtoMethod(
      isolate, t, "closeIdleConnections", BatchServer::CloseIdleConnections);
  SetProtoMethod(
      isolate, t, "closeAllConnections", BatchServer::CloseAllConnections);
  SetProtoMethod(isolate, t, "ref", BatchServer::Ref);
  SetProtoMethod(isolate, t, "unref", BatchServer::Unref);
  SetProtoMethod(isolate, t, "setTimeouts", BatchServer::SetTimeouts);
  SetProtoMethod(isolate, t, "detach", BatchServer::Detach);
  SetProtoMethod(isolate, t, "closeConnection", BatchServer::CloseConnection);
  SetProtoMethod(isolate, t, "pauseConnection", BatchServer::PauseConnection);
  SetProtoMethod(
      isolate, t, "resumeConnection", BatchServer::ResumeConnection);
  SetProtoMethod(
      isolate, t, "connectionAddress", BatchServer::ConnectionAddress);
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
  registry->Register(BatchServer::GetSockName);
  registry->Register(BatchServer::Apply);
  registry->Register(BatchServer::Close);
  registry->Register(BatchServer::CloseIdleConnections);
  registry->Register(BatchServer::CloseAllConnections);
  registry->Register(BatchServer::Ref);
  registry->Register(BatchServer::Unref);
  registry->Register(BatchServer::SetTimeouts);
  registry->Register(BatchServer::Detach);
  registry->Register(BatchServer::CloseConnection);
  registry->Register(BatchServer::PauseConnection);
  registry->Register(BatchServer::ResumeConnection);
  registry->Register(BatchServer::ConnectionAddress);
}

}  // namespace http_batch
}  // namespace node

NODE_BINDING_CONTEXT_AWARE_INTERNAL(http_batch,
                                    node::http_batch::Initialize)
NODE_BINDING_EXTERNAL_REFERENCE(http_batch,
                                node::http_batch::RegisterExternalReferences)
