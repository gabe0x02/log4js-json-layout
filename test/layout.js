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
        }
    }
}).run();