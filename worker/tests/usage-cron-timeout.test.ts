import assert from 'node:assert/strict'
import test from 'node:test'
import { syncUsage } from '../scheduled-usage.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { drive } from './upstream-retry-drive.js'

test('scheduled usage timeout skips upsert and does not retry', async t => {
 const { env } = await createTimelineTestEnv()
 let calls = 0
 t.mock.method(globalThis, 'fetch', () => { calls++; return new Promise(() => {}) })
 t.mock.timers.enable({ apis: ['setTimeout'] })
 try {
  assert.equal(await drive(t, syncUsage(env.BISEO_DB, env), 10000, 8), false)
  assert.equal(calls, 1)
 } finally { t.mock.timers.reset() }
})
