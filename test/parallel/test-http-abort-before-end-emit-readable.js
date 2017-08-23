'use strict';

const common = require('../common');
const http = require('http');
const assert = require('assert');

{
  const server = http.createServer(common.mustCall(function(req, res) {
    res.write('kaboom', function () {
      res.socket.destroy();
      server.close();
    });
  }));

  server.listen(0, function() {
    const req = http.get({
      port: this.address().port
    }, common.mustCall(function (res) {
      const expected = [Buffer.from('kaboom'), null]

      res.on('readable', common.mustCall(function() {
        let data = res.read()
        assert.deepStrictEqual(data, expected.shift())
      }, 2));

      res.on('close', common.mustCall())
    }));
  });
}

{
  const server = http.createServer(common.mustCall(function(req, res) {
    res.writeHead(200);
    res.flushHeaders();
    setImmediate(function () {
      res.socket.destroy();
      server.close();
    });
  }));

  server.listen(0, function() {
    const req = http.get({
      port: this.address().port
    }, common.mustCall(function (res) {
      const expected = [null]

      res.on('readable', common.mustCall(function() {
        let data = res.read();
        assert.deepStrictEqual(data, expected.shift());
      }, 1));

      res.on('close', common.mustCall());
    }));
  });
}
