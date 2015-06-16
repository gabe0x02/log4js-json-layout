# log4js-json-layout
A Layout for log4js to output json lines

```javascript
var log4js = require('log4js');
require('log4js-json-layout');

log4js.configure({
        "appenders": [
            {
                "type": "console",
                "layout": {
                  "type": "json"
                }
            },
});

var log =  log4js.getLogger('jsonlog');
```
