import test from 'node:test'
import assert from 'node:assert/strict'
import { demoteStale } from './availability-stale.js'
import { unknownAvailability } from './availability.js'
import { future, now, old, ttl } from './availability-fixture.test.js'

test('an available claim without a data time is demoted to unknown', () => {
  const a = demoteStale({ ...unknownAvailability(now), state: 'available' as const, source: 'codex', checkedAt: null }, now, ttl)
  assert.equal(a.state, 'unknown')
})

test('limited and unknown states are never demoted by age', () => {
  const limited = { ...unknownAvailability(now), state: 'limited' as const, source: 'codex', checkedAt: old, resetsAt: future }
  assert.equal(demoteStale(limited, now, ttl).state, 'limited')
  const unknown = { ...unknownAvailability(now), checkedAt: old }
  assert.equal(demoteStale(unknown, now, ttl).state, 'unknown')
})
