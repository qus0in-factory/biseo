import test from 'node:test'
import assert from 'node:assert/strict'
import { recordFreeTurn } from './opencode-free-lock.js'
import { evaluateFreeUsage } from './opencode-free-eval.js'

test('evaluateFreeUsage switches to unlock_expected after reset time passed', () => {
  const past = new Date('2026-10-30T10:35:00Z')
  recordFreeTurn(null, 429, 1800, new Date('2026-10-30T10:00:00Z'))
  const res = evaluateFreeUsage(past)
  assert.equal(res.state, 'available')
  assert.equal(res.windows[0].limitReached, false)
  assert.equal(res.windows[0].source, 'unlock_expected')
})

test('recordFreeTurn 200 confirms unlock', () => {
  const now = new Date('2026-10-30T10:36:00Z')
  recordFreeTurn(null, 200, null, now)
  const res = evaluateFreeUsage(now)
  assert.equal(res.state, 'available')
  assert.equal(res.windows[0].source, 'unlocked')
})
