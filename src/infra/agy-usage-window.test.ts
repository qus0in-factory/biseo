import test from 'node:test'
import assert from 'node:assert/strict'
import { makeAgyWindow } from './agy-usage-window.js'

test('a disabled five-hour bucket keeps its remaining quota', () => {
  const w = makeAgyWindow('secondary', { remainingFraction: 0.5, disabled: true }, '2026-10-30T10:00:00Z')
  assert.equal(w.usedPercent, 50)
  assert.equal(w.limitReached, false)
})

test('a zero bucket is limited', () => {
  const w = makeAgyWindow('primary', { remainingFraction: 0 }, '2026-10-30T10:00:00Z')
  assert.equal(w.limitReached, true)
})
