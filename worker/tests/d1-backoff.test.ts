import assert from 'node:assert/strict'
import test from 'node:test'
import { createFakeD1 } from './fake-d1.js'
import { nextReadyAt, recordResult } from '../infra/d1-backoff.js'

test('cron backoff grows on failure and resets on success', async () => {
  const db = createFakeD1()
  await recordResult(db, 'cron:test', true)
  const first = await nextReadyAt(db, 'cron:test')
  assert.ok(first > Date.now())
  await recordResult(db, 'cron:test', false)
  const second = await nextReadyAt(db, 'cron:test')
  assert.ok(second > Date.now())
  assert.ok(second < first)
})
