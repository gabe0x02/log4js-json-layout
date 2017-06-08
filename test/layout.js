var vows = require('vows');
var assert = require('assert');
var jsonLayout = require('../layout.js');

var log4js = require('log4js');
log4js.layouts.addLayout('json', jsonLayout);

vows.describe('JSON layout').addBatch({
    'test json layout': {        
        topic: log4js.layouts,
        'should be able to get a json line from layout': function (layouts) {
          var serializer = layouts.layout('json');
          var json = serializer({data: "OMG IT WORKED", level: {levelStr: "DEBUG"}});
          assert.ok(json);
          var log = JSON.parse(json);
          assert.equal(log.message, "OMG IT WORKED");
          assert.equal(log.level, "DEBUG");
        },
        'should replace %s in strings with other input': function (layouts) {
          var serializer = layouts.layout('json');
          var json = serializer({data: ["  <-- %s %s","POST","/api/v2/tree"], level: {levelStr: "DEBUG"}});
          assert.ok(json);
          var log = JSON.parse(json);
          assert.deepEqual(log.message, ["  <-- POST /api/v2/tree"]);
          assert.equal(log.level, "DEBUG");
        },
        'should replace include unused vars with $s': function (layouts) {
          var serializer = layouts.layout('json');
          var json = serializer({data: ["  <-- %s %s","POST","/api/v2/tree", "good times"], level: {levelStr: "DEBUG"}});
          assert.ok(json);
          var log = JSON.parse(json);
          assert.deepEqual(log.message, ["  <-- POST /api/v2/tree", "good times"]);
          assert.equal(log.level, "DEBUG");
        },
        'should handle %% correctly': function (layouts) {
          var serializer = layouts.layout('json');
          var json = serializer({data: ["  <-- %s %s %s%%","POST","/api/v2/tree", 100, "good times"], level: {levelStr: "DEBUG"}});
          assert.ok(json);
          var log = JSON.parse(json);
          assert.deepEqual(log.message, ["  <-- POST /api/v2/tree 100%", "good times"]);
          assert.equal(log.level, "DEBUG");
        },        
        'should handle objects correctly': function (layouts) {
          var serializer = layouts.layout('json');
          var json = serializer({data: [{test:"this"}], level: {levelStr: "DEBUG"}});
          assert.ok(json);
          var log = JSON.parse(json);
          assert.deepEqual(log.message, [{test: "this"}]);
          assert.equal(log.level, "DEBUG");          
        },
        'should handle circular objects reasonably': function (layouts) {
          var serializer = layouts.layout('json');
          var data = [{test:"this"}]
          data.push(data);
          var json = serializer({data: data, level: {levelStr: "DEBUG"}});
          assert.ok(json);
          var log = JSON.parse(json);
          assert.deepEqual(log.message, [{test: "this"}, '[Circular ~.message]']);
          assert.equal(log.level, "DEBUG");          
        },
        'should handle a context config': function(layouts) {
          var serializer = layouts.layout('json', {context: {context_data: "state"}});
          var data = [{message:'this message %s', context: {request_id: 123}}, 1234]
          var json = serializer({data: data, level: {levelStr: "DEBUG"}});
          var log = JSON.parse(json);
          assert.equal(log.context_data, "state");
          assert.equal(log.request_id, 123);
          assert.deepEqual(log.message, ["this message 1234"]);
        }
      }        
}).run();