import test from 'node:test'
import assert from 'node:assert/strict'
import { codexAvailability } from './codex-availability.js'
import { fresh, limits, now, ttl } from './availability-fixture.test.js'

test('a snapshot without a reached limit is unknown, never available', () => {
  const a = codexAvailability(limits(null, fresh), now, ttl)
  assert.equal(a.state, 'unknown')
  assert.equal(a.reason, 'no_limit_signal')
  assert.notEqual(a.state, 'available')
})

test('a snapshot without a data time is unknown', () => {
  const a = codexAvailability(limits(null, null), now, ttl)
  assert.equal(a.state, 'unknown')
  assert.equal(a.reason, 'no_snapshot_time')
})

test('a missing snapshot is unknown', () => {
  const a = codexAvailability(null, now, ttl)
  assert.equal(a.state, 'unknown')
  assert.equal(a.reason, 'no_snapshot')
  assert.equal(a.checkedAt, null)
})
