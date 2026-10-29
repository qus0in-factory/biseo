import test from 'node:test'
import assert from 'node:assert/strict'
import { codexAvailability } from './codex-availability.js'
import { limits, now, old, ttl } from './availability-fixture.test.js'

test('an expired snapshot is unknown, never available', () => {
  const a = codexAvailability(limits(null, old), now, ttl)
  assert.equal(a.state, 'unknown')
  assert.equal(a.reason, 'stale_snapshot')
  assert.equal(a.checkedAt, old)
})

test('the ttl decides whether a snapshot is expired', () => {
  const wide = codexAvailability(limits(null, old), now, 24 * 60 * 60 * 1000)
  assert.equal(wide.state, 'unknown')
  assert.equal(wide.reason, 'no_limit_signal')
})
