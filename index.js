
const { Router } = require('express')

const FLAG = '__skipByExpressNot'
const clearFlag = (req) => { delete req[FLAG] }

module.exports = function(path, middleware) {
  const router = new Router()

  router.use((req, res, next) => {
    clearFlag(req)
    next()
  })

  router.use(path, (req, res, next) => {
    req[FLAG] = true
    next()
  })

  router.use((req, res, next) => {
    const flagSet = req[FLAG]
    clearFlag(req)
    if (flagSet) return next()
    middleware(req, res, next)
  })

  return router
}
