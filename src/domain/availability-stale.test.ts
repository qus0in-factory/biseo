import test from 'node:test'
import assert from 'node:assert/strict'
import { ageMs, demoteStale, freshness, isStale } from './availability-stale.js'
import { unknownAvailability } from './availability.js'

const now = new Date('2026-10-29T10:00:00.000Z')
const ttl = 15 * 60 * 1000
const fresh = '2026-10-29T09:58:00.000Z'
const old = '2026-10-29T09:00:00.000Z'

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

test('a stale available claim is demoted to unknown', () => {
  const a = demoteStale(
    { ...unknownAvailability(now), state: 'available', source: 'codex', checkedAt: old },
    now,
    ttl,
  )
  assert.equal(a.state, 'unknown')
  assert.equal(a.reason, 'stale_availability')
  assert.equal(a.checkedAt, old)
  assert.equal(a.source, 'codex')
})

test('a fresh available claim survives the ttl', () => {
  const a = demoteStale(
    { ...unknownAvailability(now), state: 'available', source: 'codex', checkedAt: fresh },
    now,
    ttl,
  )
  assert.equal(a.state, 'available')
})

test('an available claim without a data time is demoted to unknown', () => {
  const a = demoteStale(
    { ...unknownAvailability(now), state: 'available', source: 'codex', checkedAt: null },
    now,
    ttl,
  )
  assert.equal(a.state, 'unknown')
})

test('limited and unknown states are never demoted by age', () => {
  const limited = {
    ...unknownAvailability(now),
    state: 'limited' as const,
    source: 'codex',
    checkedAt: old,
    resetsAt: '2026-10-29T11:00:00.000Z',
  }
  assert.equal(demoteStale(limited, now, ttl).state, 'limited')
  const unknown = { ...unknownAvailability(now), checkedAt: old }
  assert.equal(demoteStale(unknown, now, ttl).state, 'unknown')
})
