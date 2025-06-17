import test from 'ava'
import express, { Express, Router, RequestHandler, ErrorRequestHandler } from 'express'
import got from 'got'
import not from '..'

let server: ReturnType<Express['listen']> | undefined

test.before(async () => {
  const app = express()

  const router = Router()
  const noOpMiddleware: RequestHandler = (_req, _res, next) => { next() }
  const middleware: RequestHandler = (_req, res) => { res.send('stopped') }
  const asyncErrorMiddleware: RequestHandler = async (_req, _res) => { throw new Error('oops') }
  router.use(middleware)

  app.use('/use',
    not(['/skip'], router),
    ((_req, res) => { res.send('skipped') }) as RequestHandler
  )

  app.use('/use-end',
    not(['/skip'], { matchToEnd: true }, router),
    ((_req, res) => { res.send('skipped') }) as RequestHandler
  )

  app.all(
    '/all/*rest',
    not(['/all/skip'], router),
    ((_req, res) => { res.send('skipped') }) as RequestHandler
  )

  app.all(
    '/all-end/*rest',
    not(['/all-end/skip'], { matchToEnd: true }, router),
    ((_req, res) => { res.send('skipped') }) as RequestHandler
  )

  app.use('/multiple',
    not(['/skip'], noOpMiddleware, [ noOpMiddleware, router ]),
    ((_req, res) => { res.send('skipped') }) as RequestHandler
  )

  app.use('/anonymous',
    not(['/skip'], middleware),
    ((_req, res) => { res.send('skipped') }) as RequestHandler
  )

  app.use('/error',
    not(['/skip'], asyncErrorMiddleware),
    ((_req, res) => { res.send('skipped') }) as RequestHandler,
    ((_err, _req, res, _next) => { res.send('errored') }) as ErrorRequestHandler
  )

  server = app.listen(3030)
})

test.after(async () => {
  server?.close()
})

test('use', async (t) => {
  t.is((await got('http://localhost:3030/use/other')).body, 'stopped')
  t.is((await got('http://localhost:3030/use/skip')).body, 'skipped')
  t.is((await got('http://localhost:3030/use/skip/more')).body, 'skipped')
})

test('use with end', async (t) => {
  t.is((await got('http://localhost:3030/use-end/other')).body, 'stopped')
  t.is((await got('http://localhost:3030/use-end/skip')).body, 'skipped')
  t.is((await got('http://localhost:3030/use-end/skip/more')).body, 'stopped')
})

test('all', async (t) => {
  t.is((await got('http://localhost:3030/all/other')).body, 'stopped')
  t.is((await got('http://localhost:3030/all/skip')).body, 'skipped')
  t.is((await got('http://localhost:3030/all/skip/more')).body, 'skipped')
})

test('all with end', async (t) => {
  t.is((await got('http://localhost:3030/all-end/other')).body, 'stopped')
  t.is((await got('http://localhost:3030/all-end/skip')).body, 'skipped')
  t.is((await got('http://localhost:3030/all-end/skip/more')).body, 'stopped')
})

test('multiple middleware', async (t) => {
  t.is((await got('http://localhost:3030/multiple/other')).body, 'stopped')
  t.is((await got('http://localhost:3030/multiple/skip')).body, 'skipped')
  t.is((await got('http://localhost:3030/multiple/skip/more')).body, 'skipped')
})

test('anonymous', async (t) => {
  t.is((await got('http://localhost:3030/anonymous/other')).body, 'stopped')
  t.is((await got('http://localhost:3030/anonymous/skip')).body, 'skipped')
  t.is((await got('http://localhost:3030/anonymous/skip/more')).body, 'skipped')
})

test('async error middleware', async (t) => {
  t.is((await got('http://localhost:3030/error/other')).body, 'errored')
  t.is((await got('http://localhost:3030/error/skip')).body, 'skipped')
  t.is((await got('http://localhost:3030/error/skip/more')).body, 'skipped')
})
