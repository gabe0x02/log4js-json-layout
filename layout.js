var sprintf = require("sprintf-js").sprintf;
var stringify = require('json-stringify-safe');

module.exports = function(config){ 
  config = config || {};
  config.context = config.context || {};
  return function(loggingEvent) {
    var to_json = Object.assign({}, config.context, {
      date: loggingEvent.startTime,
      level: loggingEvent.level && loggingEvent.level.levelStr || undefined,
      category: loggingEvent.categoryName,
      message: loggingEvent.data
    });
    try {
      if(Array.isArray(to_json.message)) {
        let msg = to_json.message[0] || {};
        if(msg.context) {
          // add context to base level
          to_json = Object.assign({}, msg.context, to_json);
          delete msg.context;

          // if only message remains then flatten context
          if(msg.message && Object.keys(msg).length === 1) {
            msg = msg.message;
            to_json.message.splice(0, 1, msg);
          } else if(Object.keys(msg).length === 0) {
            to_json.message.splice(0, 1);
          }
        }
        
        // handle
        if( typeof(msg) === "string" && msg.indexOf('%') !== -1 )  {
          var count = (msg.match(/%[sdifj]/g) || []).length;
          var params = to_json.message.splice(0, count+1);           
          var str = sprintf.apply(this, params);
          to_json.message.splice(0, 0, str);
        }
      }
      
      return stringify(to_json);
    } catch (e) {
      return JSON.stringify(["ERROR CONVERTING LOG MESSAGE TO JSON;", e.message]);
    }
  };
}
