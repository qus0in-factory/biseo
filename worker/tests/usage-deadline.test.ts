import assert from 'node:assert/strict'
import test from 'node:test'
import { callUpstreamJson } from '../infra/herdr-upstream-http.js'
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js'

test('usage remains pending at 29999ms and expires at 30000ms', async t => {
 const { env } = await createTimelineTestEnv()
 let started!: () => void
 const ready = new Promise<void>(resolve => { started = resolve })
 t.mock.method(globalThis, 'fetch', () => { started(); return new Promise(() => {}) })
 t.mock.timers.enable({ apis: ['setTimeout'] })
 try {
  let done = false
  const result = callUpstreamJson(env, '/herdr/usage', 'GET', undefined, 'deadline').then(r => { done = true; return r })
  await ready
  t.mock.timers.tick(29999)
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(done, false)
  t.mock.timers.tick(1)
  assert.equal((await result).status, 504)
 } finally { t.mock.timers.reset() }
})
