import test from 'ava'
import express, { Router } from 'express'
import got from 'got'
import not from '..'

test.before(async () => {
  const app = express()

  const router = new Router()
  router.use((req, res) => res.send('stopped'))

  app.use('/use',
    not(['/skip'], router),
    (req, res) => res.send('skipped')
  )

  app.use('/use-end',
    not(['/skip'], router, { end: true }),
    (req, res) => res.send('skipped')
  )

  app.all('/all/*',
    not(['/all/skip'], router),
    (req, res) => res.send('skipped')
  )

  app.all('/all-end/*',
    not(['/all-end/skip'], router, { end: true }),
    (req, res) => res.send('skipped')
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
