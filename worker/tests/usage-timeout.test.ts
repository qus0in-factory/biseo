import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('usage timeout returns stale 200 after one upstream attempt', async t => {
 const { env, cookie } = await createTimelineTestEnv()
 let calls = 0
 let start!: () => void
 const started = new Promise<void>(resolve => { start = resolve })
 t.mock.method(globalThis, 'fetch', () => {
  calls++
  start()
  return new Promise(() => {})
 })
 t.mock.timers.enable({ apis: ['setTimeout'] })
 try {
  const responsePromise = Promise.resolve(app.fetch(new Request('https://local/api/usage', {
   headers: { Cookie: cookie },
  }), env))
  // Wait for authentication/signing before advancing ky's clock.
  await started
  t.mock.timers.tick(30000)
  const response = await responsePromise
  assert.equal(response.status, 200)
  assert.equal((await response.json() as { stale: boolean }).stale, true)
  assert.equal(calls, 1)
 } finally { t.mock.timers.reset() }
})
