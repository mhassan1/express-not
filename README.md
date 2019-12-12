# express-not
Skip middleware when a path matches

## Install
`npm install express-not`

## Usage
```javascript
const not = require('express-not')

app.use('/mount',
  not(['/skip'], (req, res) => res.send('stopped')),
  (req, res) => res.send('skipped')
)

// GET /mount/skip => skipped
// GET /mount/other => stopped
```

## Documentation
`not(path, middleware, [options])`:
* `path`: An Express path that should be skipped over. If the path of the request matches, the passed `middleware` will be skipped. Supports any of [Express Path Examples](https://expressjs.com/en/api.html#path-examples).
* `middleware`: An Express callback or router, or an array of callbacks and/or routers
* `options`:
  * `caseSensitive`: Enable case sensitivity when matching the route ([express.Router docs](https://expressjs.com/en/api.html#express.router)),
  _default `false`_
  * `strict`: Enable strict routing when matching the route ([express.Router docs](https://expressjs.com/en/api.html#express.router)),
  _default `false`_
  * `end`: Match the route completely (like `.all`) instead of just the prefix (like `.use`),
  _default `false`_

## License
MIT
