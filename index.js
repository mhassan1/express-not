
const Layer = require('express/lib/router/layer')

module.exports = (path, middleware, options = {}) => {
  const layerOpts = {
    sensitive: 'caseSensitive' in options ? options.caseSensitive : false,
    strict: 'strict' in options ? options.strict : false,
    // set this so that the match acts like `.all` rather than `.use`
    // e.g. '/a' should match '/a' and not '/a/b'
    end: 'end' in options ? options.end : false,
  }

  const noOp = () => {}

  const layer = new Layer(path, layerOpts, noOp)

  return (req, res, next) => {
    if (layer.match(req.path)) return next()
    middleware(req, res, next)
  }
}
