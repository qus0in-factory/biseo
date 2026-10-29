import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateBackoff } from './backoff.js'

test('calculateBackoff scales exponentially and caps at max', () => {
  const d0 = calculateBackoff(0, 1000, 30000, 0)
  assert.equal(d0, 1000)

  const d1 = calculateBackoff(1, 1000, 30000, 0)
  assert.equal(d1, 2000)

  const d2 = calculateBackoff(2, 1000, 30000, 0)
  assert.equal(d2, 4000)

  const d10 = calculateBackoff(10, 1000, 30000, 0)
  assert.equal(d10, 30000)
})

test('calculateBackoff respects jitter within bounds', () => {
  for (let i = 0; i < 5; i++) {
    const val = calculateBackoff(1, 1000, 30000, 0.2)
    assert.ok(val >= 2000 && val <= 2400)
  }
})
