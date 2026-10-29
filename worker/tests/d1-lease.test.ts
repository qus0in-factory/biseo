import assert from 'node:assert/strict'
import test from 'node:test'
import { createFakeD1 } from './fake-d1.js'
import { acquireLease, releaseLease } from '../infra/d1-lease.js'

test('cron lease prevents overlapping runs', async () => {
  const db = createFakeD1()
  assert.equal(await acquireLease(db, 'cron:test', 'a', 55000), true)
  assert.equal(await acquireLease(db, 'cron:test', 'b', 55000), false)
  await releaseLease(db, 'cron:test', 'a')
  assert.equal(await acquireLease(db, 'cron:test', 'b', 55000), true)
})
