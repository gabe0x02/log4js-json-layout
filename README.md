# log4js-json-layout
A Layout for log4js to output json lines 

Also this layout accepts context Objects in config as well at log time.

This context is logged at the root level with date and message info.

Remaining parameters to log functions are put in the message array.

Usage: 
```javascript
var log4js = require('log4js');
log4js.layouts.addLayout('json', require('log4js-json-layout'));

log4js.configure({
        "appenders": [
            {
                "type": "console",
                "layout": {
                  "type": "json",
                  "context": {
                      "app": "app_name"
                  }
                }
            }
          ]
});

var logger =  log4js.getLogger('jsonlog');


logger.info("message 1");
logger.warn({context: {message_id: 1234}, message: "message 2"});
logger.error({context: {message_id: 1235}}, "message 3");
```

Output:
```
{"app":"app_name","date":"2017-06-08T17:17:44.132Z","level":"INFO","category":"jsonlog","message":["message 1"]}
{"message_id":1234,"app":"app_name","date":"2017-06-08T17:17:44.134Z","level":"WARN","category":"jsonlog","message":["message 2"]}
{"message_id":1235,"app":"app_name","date":"2017-06-08T17:17:44.135Z","level":"ERROR","category":"jsonlog","message":["message 3"]}
```
