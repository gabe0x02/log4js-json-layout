var layouts = require('log4js').layouts;
var sprintf = require("sprintf-js").sprintf;

layouts.addLayout('json', function(){//config){ (ignore config for now)
  return function(loggingEvent) {
    var to_json = {
      date: loggingEvent.startTime,
      level: loggingEvent.level && loggingEvent.level.levelStr || undefined,
      category: loggingEvent.categoryName,
      data: loggingEvent.data
    };
    try {
      if(Array.isArray(to_json.data)) {
        var count = (to_json.data[0].match(/%/g) || []).length;
        count -= (to_json.data[0].match(/%%/g) || []).length*2;
        var params = to_json.data.splice(0, count+1);           
        var str = sprintf.apply(this, params);
        to_json.data.splice(0, 0, str);
      }
      
      
      return JSON.stringify(to_json);
    } catch (e) {
      return JSON.stringify(["ERROR CONVERTING LOG MESSAGE TO JSON;", e.message]);
    }
  };
});
