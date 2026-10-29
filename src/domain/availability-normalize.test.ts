import test from 'node:test'
import assert from 'node:assert/strict'
import { isLimited, normalizeAvailability, unknownAvailability } from './availability.js'
import { future, now } from './availability-fixture.test.js'

test('normalization releases an expired or resetless limited state', () => {
  const active = { ...unknownAvailability(now), state: 'limited' as const, source: 'codex', resetsAt: future }
  assert.equal(isLimited(active), true)
  assert.equal(normalizeAvailability(active, now).state, 'limited')
  const expired = normalizeAvailability(active, new Date('2026-10-29T12:00:00.000Z'))
  assert.equal(expired.state, 'unknown')
  assert.equal(expired.resetsAt, null)
  assert.equal(expired.source, 'codex')
  const resetless = normalizeAvailability({ ...active, resetsAt: null }, now)
  assert.equal(resetless.state, 'unknown')
  assert.equal(isLimited(resetless), false)
})
