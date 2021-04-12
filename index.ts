
const Layer = require('express/lib/router/layer')
const flatten = require('array-flatten')

module.exports = (path, ...middleware) => {
  // if first middleware is an object, it's options
  const options = {}
  if (middleware[0] && typeof middleware[0] === 'object' && !Array.isArray(middleware[0])) {
    Object.assign(options, middleware.shift())
  }

  const layerOpts = {
    sensitive: 'caseSensitive' in options ? options.caseSensitive : false,
    strict: 'strict' in options ? options.strict : false,
    // set this so that the match acts like `.all` rather than `.use`
    // e.g. '/a' should match '/a' and not '/a/b'
    end: 'matchToEnd' in options ? options.matchToEnd : false,
  }

  const noOp = () => {}

  const layer = new Layer(path, layerOpts, noOp)

  return flatten(middleware).map(_middleware => (req, res, next) => {
    if (layer.match(req.path)) return next()
    _middleware(req, res, next)
  })
}
