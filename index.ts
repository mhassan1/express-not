
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Layer = require('express/lib/router/layer')
import { flatten } from 'array-flatten'

import { Request, Response, NextFunction, RequestHandler as ExpressRequestHandler, RouterOptions } from 'express'

export type ExpressNotOptions = {
  caseSensitive?: RouterOptions['caseSensitive']
  strict?: RouterOptions['strict']
  matchToEnd?: boolean
}

export type PathParams = string | RegExp | Array<string | RegExp>

type RequestHandler = ExpressRequestHandler | Array<ExpressRequestHandler>

function expressNot (path: PathParams, ...optionsOrMiddleware: (ExpressNotOptions | RequestHandler)[]): ((req: Request, res: Response, next: NextFunction) => void)[] {
  // if first middleware is an object, it's options
  const isFirstMiddlewareOptions: boolean = !!optionsOrMiddleware[0] && typeof optionsOrMiddleware[0] === 'object' && !Array.isArray(optionsOrMiddleware[0])
  const options: ExpressNotOptions = isFirstMiddlewareOptions ? optionsOrMiddleware[0] as ExpressNotOptions : {}
  const middleware: RequestHandler[] = optionsOrMiddleware.slice(isFirstMiddlewareOptions ? 1 : 0) as RequestHandler[]

  const layerOpts = {
    sensitive: 'caseSensitive' in options ? options.caseSensitive : false,
    strict: 'strict' in options ? options.strict : false,
    // set this so that the match acts like `.all` rather than `.use`
    // e.g. '/a' should match '/a' and not '/a/b'
    end: 'matchToEnd' in options ? options.matchToEnd : false,
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noOp = () => {}

  const layer = new Layer(path, layerOpts, noOp)

  return flatten(middleware).map((_middleware: ExpressRequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    if (layer.match(req.path)) return next()
    _middleware(req, res, next)
  })
}

export default expressNot
