import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateFreeUsage } from './opencode-free-eval.js'
import { setFreeLock, recordFreeTurn } from './opencode-free-lock.js'

test('no lock info never displays as available', () => {
  setFreeLock(null)
  assert.equal(evaluateFreeUsage().state, 'unknown')
})

test('recorded lock displays as limited with reset', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  recordFreeTurn(null, 429, 1800, now)
  const r = evaluateFreeUsage(now)
  assert.equal(r.state, 'limited')
  assert.equal(r.windows[0].limitReached, true)
  assert.equal(r.windows[0].resetsAt, '2026-10-30T10:30:00.000Z')
})
