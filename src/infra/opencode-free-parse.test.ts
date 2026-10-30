import test from 'node:test'
import assert from 'node:assert/strict'
import { setFreeLock, recordFreeTurn } from './opencode-free-lock.js'
import { evaluateFreeUsage } from './opencode-free-eval.js'

test('evaluateFreeUsage shows pending status when no turn recorded', () => {
  setFreeLock(null)
  const res = evaluateFreeUsage()
  assert.equal(res.state, 'available')
  assert.equal(res.source, 'pending')
  assert.equal(res.metrics[0].id, 'status')
  assert.equal(res.metrics[0].unit, 'status')
})

test('recordFreeTurn 429 sets limited with resetsAt', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  recordFreeTurn(null, 429, 1800, now)
  const res = evaluateFreeUsage(now)
  assert.equal(res.state, 'limited')
  assert.equal(res.source, 'locked')
  assert.equal(res.windows[0].limitReached, true)
  assert.equal(res.windows[0].resetsAt, '2026-10-30T10:30:00.000Z')
})
