import test from 'ava'
import express, { Router, Request, Response, NextFunction } from 'express'
import got from 'got'
import not from '..'

test.before(async () => {
  const app = express()

  const router = Router()
  const noOpMiddleware = (req: Request, res: Response, next: NextFunction) => next()
  const middleware = (req: Request, res: Response) => res.send('stopped')
  const asyncErrorMiddleware = async (_req: Request, _res: Response) => { throw new Error('oops') }
  router.use(middleware)

  app.use('/use',
    not(['/skip'], router),
    (req: Request, res: Response) => res.send('skipped')
  )

  app.use('/use-end',
    not(['/skip'], { matchToEnd: true }, router),
    (req: Request, res: Response) => res.send('skipped')
  )

  app.all(
    '/all/*rest',
    not(['/all/skip'], router),
    (req: Request, res: Response) => res.send('skipped')
  )

  app.all(
    '/all-end/*rest',
    not(['/all-end/skip'], { matchToEnd: true }, router),
    (req: Request, res: Response) => res.send('skipped')
  )

  app.use('/multiple',
    not(['/skip'], noOpMiddleware, [ noOpMiddleware, router ]),
    (req: Request, res: Response) => res.send('skipped')
  )

  app.use('/anonymous',
    not(['/skip'], middleware),
    (req: Request, res: Response) => res.send('skipped')
  )

  app.use('/error',
    not(['/skip'], asyncErrorMiddleware),
    (req: Request, res: Response) => res.send('skipped'),
    (err: Error, req: Request, res: Response, _next: NextFunction) => res.send('errored')
  )

  app.listen(3030)
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
