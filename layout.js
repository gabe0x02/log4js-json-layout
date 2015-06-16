var layouts = require('log4js').layouts;

layouts.addLayout('json', function(){//config){ (ignore config for now)
  return function(loggingEvent) {
    var to_json = {
      date: loggingEvent.startTime,
      level: loggingEvent.level && loggingEvent.level.levelStr || undefined,
      category: loggingEvent.categoryName,
      data: loggingEvent.data
    };
    return JSON.stringify(to_json);
  };
});
