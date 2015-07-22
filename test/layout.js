var vows = require('vows');
var assert = require('assert');
require('../layout.js');

vows.describe('JSON layout').addBatch({
    'test json layout': {        
        topic: require('log4js').layouts,
        'should be able to get a json line from layout': function (layouts) {
          var serializer = layouts.layout('json');
          var json = serializer({data: "OMG IT WORKED", level: {levelStr: "DEBUG"}});
          assert.ok(json);
          var log = JSON.parse(json);
          assert.equal(log.data, "OMG IT WORKED");
          assert.equal(log.level, "DEBUG");
        },
        'should replace %s in strings with other input': function (layouts) {
          var serializer = layouts.layout('json');
          var json = serializer({data: ["  <-- %s %s","POST","/api/v2/tree"], level: {levelStr: "DEBUG"}});
          assert.ok(json);
          var log = JSON.parse(json);
          assert.deepEqual(log.data, ["  <-- POST /api/v2/tree"]);
          assert.equal(log.level, "DEBUG");
        },
        'should replace include unused vars with $s': function (layouts) {
          var serializer = layouts.layout('json');
          var json = serializer({data: ["  <-- %s %s","POST","/api/v2/tree", "good times"], level: {levelStr: "DEBUG"}});
          assert.ok(json);
          var log = JSON.parse(json);
          assert.deepEqual(log.data, ["  <-- POST /api/v2/tree", "good times"]);
          assert.equal(log.level, "DEBUG");
        },
        'should handle %% correctly': function (layouts) {
          var serializer = layouts.layout('json');
          var json = serializer({data: ["  <-- %s %s %s%%","POST","/api/v2/tree", 100, "good times"], level: {levelStr: "DEBUG"}});
          assert.ok(json);
          var log = JSON.parse(json);
          assert.deepEqual(log.data, ["  <-- POST /api/v2/tree 100%", "good times"]);
          assert.equal(log.level, "DEBUG");
        }        
      }        
}).run();