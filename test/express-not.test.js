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

  app.listen(3030)
})

test('use: stopped', async (t) => {
  t.is((await got('http://localhost:3030/use/other')).body, 'stopped')
})

test('use: skipped', async (t) => {
  t.is((await got('http://localhost:3030/use/skip')).body, 'skipped')
})
