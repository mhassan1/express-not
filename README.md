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
`not(path, middleware)`:
* `path`: An Express path that should be skipped over. If the path of the request matches, the passed `middleware` will be skipped. Supports any of [Express Path Examples](https://expressjs.com/en/api.html#path-examples).
* `middleware`: An Express callback or router

## Limitations
* Only works with `.use` because it adds an Express `router` into the middleware stack

## License
MIT
