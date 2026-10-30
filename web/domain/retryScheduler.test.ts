import test from 'node:test'
import assert from 'node:assert/strict'
import { createRetryScheduler } from './retryScheduler.js'

test('createRetryScheduler schedules, resets, and cancels', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  try {
    let fired = 0
    const sched = createRetryScheduler(() => {
      fired++
      sched.cancel()
    })
    sched.schedule()
    assert.equal(fired, 0)
    t.mock.timers.tick(1100)
    assert.equal(fired, 1)
  } finally {
    t.mock.timers.reset()
  }
})
