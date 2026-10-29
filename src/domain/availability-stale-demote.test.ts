import test from 'node:test'
import assert from 'node:assert/strict'
import { demoteStale } from './availability-stale.js'
import { availableClaim, fresh, now, old, ttl } from './availability-fixture.test.js'

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
