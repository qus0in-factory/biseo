import test from 'node:test'
import assert from 'node:assert/strict'
import { ageMs, freshness, isStale } from './availability-stale.js'
import { fresh, now, old, ttl } from './test-util/availability-fixture.js'
import { demoteStale } from './availability-stale.js'
import { availableClaim, fresh, now, old, ttl } from './test-util/availability-fixture.js'
import { unknownAvailability } from './availability.js'
import { future, now, old, ttl } from './test-util/availability-fixture.js'

{

test('age and staleness follow the data reference time', () => {
  assert.equal(ageMs(fresh, now), 120000)
  assert.equal(ageMs(null, now), null)
  assert.equal(ageMs('not-a-date', now), null)
  assert.equal(isStale(fresh, now, ttl), false)
  assert.equal(isStale(old, now, ttl), true)
  assert.equal(isStale(null, now, ttl), true)
  assert.equal(isStale(old, now, 0), false)
})

test('freshness names the reason a snapshot cannot be trusted', () => {
  assert.equal(freshness(fresh, now, ttl), 'fresh')
  assert.equal(freshness(old, now, ttl), 'stale_snapshot')
  assert.equal(freshness(old, now, 24 * 60 * 60 * 1000), 'fresh')
  assert.equal(freshness(null, now, ttl), 'no_snapshot_time')
})
}
{

test('a stale available claim is demoted to unknown', () => {
  const a = demoteStale(availableClaim(old), now, ttl)
  assert.equal(a.state, 'unknown')
  assert.equal(a.reason, 'stale_availability')
  assert.equal(a.checkedAt, old)
  assert.equal(a.source, 'codex')
})

test('a fresh available claim survives the ttl', () => {
  const a = demoteStale(availableClaim(fresh), now, ttl)
  assert.equal(a.state, 'available')
})
}
{

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
}
