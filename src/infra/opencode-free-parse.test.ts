import test from 'node:test'
import assert from 'node:assert/strict'
import { setFreeLock, recordFreeTurn } from './opencode-free-lock.js'
import { evaluateFreeUsage } from './opencode-free-eval.js'

test('evaluateFreeUsage unknown when no turn recorded', () => {
  setFreeLock(null)
  const res = evaluateFreeUsage()
  assert.equal(res.state, 'unknown')
  assert.equal(res.windows.length, 0)
})

test('recordFreeTurn 429 sets limited with resetsAt', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  recordFreeTurn(null, 429, 1800, now)
  const res = evaluateFreeUsage(now)
  assert.equal(res.state, 'limited')
  assert.equal(res.windows[0].limitReached, true)
  assert.equal(res.windows[0].resetsAt, '2026-10-30T10:30:00.000Z')
})

test('evaluateFreeUsage switches to expected-unlocked after reset time passed', () => {
  const past = new Date('2026-10-30T10:35:00Z')
  const res = evaluateFreeUsage(past)
  assert.equal(res.state, 'available')
  assert.equal(res.windows[0].limitReached, false)
  assert.equal(res.windows[0].source, 'expected-unlocked')
})

test('recordFreeTurn 200 confirms unlock', () => {
  const now = new Date('2026-10-30T10:36:00Z')
  recordFreeTurn(null, 200, null, now)
  const res = evaluateFreeUsage(now)
  assert.equal(res.state, 'available')
  assert.equal(res.windows[0].source, 'unlocked')
})
