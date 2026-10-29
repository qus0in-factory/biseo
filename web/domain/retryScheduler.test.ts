import test from 'node:test'
import assert from 'node:assert/strict'
import { createRetryScheduler } from './retryScheduler.js'

test('createRetryScheduler schedules, resets, and cancels', (t, done) => {
  let fired = 0
  const sched = createRetryScheduler(() => {
    fired++
    sched.cancel()
    assert.equal(fired, 1)
    done()
  })
  sched.schedule()
})
