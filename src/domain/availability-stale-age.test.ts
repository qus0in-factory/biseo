import test from 'node:test'
import assert from 'node:assert/strict'
import { ageMs, freshness, isStale } from './availability-stale.js'
import { fresh, now, old, ttl } from './availability-fixture.test.js'

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
