import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { drive } from './upstream-retry-drive.js'

test('usage timeout returns stale 200 after one upstream attempt', async t => {
 const { env, cookie } = await createTimelineTestEnv()
 let calls = 0
 t.mock.method(globalThis, 'fetch', () => { calls++; return new Promise(() => {}) })
 t.mock.timers.enable({ apis: ['setTimeout'] })
 try {
  const response = await drive(t, Promise.resolve(app.fetch(new Request('https://local/api/usage', {
   headers: { Cookie: cookie },
  }), env)), 10000, 8)
  assert.equal(response.status, 200)
  assert.equal((await response.json() as { stale: boolean }).stale, true)
  assert.equal(calls, 1)
 } finally { t.mock.timers.reset() }
})
