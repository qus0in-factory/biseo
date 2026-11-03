import test from 'node:test'
import assert from 'node:assert/strict'
import { codexAvailability } from './codex-availability.js'
import { codexAt, fresh, future, limits, now, old, ttl } from './test-util/availability-fixture.js'

{

test('checkedAt is the data reference time and observedAt the check time', () => {
  const at = '2026-10-29T09:58:00.000Z'
  const a = codexAt({ reached: null, primary: null, secondary: null, snapshotAt: at })
  assert.equal(a.checkedAt, at)
  assert.equal(a.observedAt, now.toISOString())
  assert.notEqual(a.checkedAt, a.observedAt)
})

test('a missing or elapsed reset becomes unknown', () => {
  const missing = codexAt({ reached: 'primary', primary: null, secondary: null, snapshotAt: now.toISOString() })
  assert.equal(missing.state, 'unknown')
  const elapsed = codexAt({ reached: 'primary', primary: old, secondary: null, snapshotAt: now.toISOString() })
  assert.equal(elapsed.state, 'unknown')
})
}
{

test('the reached window is matched exactly', () => {
  const other = '2026-10-29T12:00:00.000Z'
  const a = codexAt({ reached: 'xsecondary', primary: future, secondary: other, snapshotAt: now.toISOString() })
  assert.equal(a.state, 'limited')
  assert.equal(a.window, 'primary')
  assert.equal(a.resetsAt, future)
})
}
{

test('only a reached rate limit is limited', () => {
  const missing = codexAt(null)
  assert.equal(missing.state, 'unknown')
  assert.equal(missing.checkedAt, null)
  assert.equal(missing.observedAt, now.toISOString())
  const free = codexAt({ reached: null, primary: future, secondary: null, snapshotAt: now.toISOString() })
  assert.equal(free.state, 'unknown')
  assert.equal(free.reason, 'no_limit_signal')
  assert.equal(free.source, 'codex')
  const limited = codexAt({ reached: 'secondary', primary: future, secondary: future, snapshotAt: now.toISOString() })
  assert.equal(limited.state, 'limited')
  assert.equal(limited.window, 'secondary')
  assert.equal(limited.resetsAt, future)
  assert.equal(limited.reason, 'rate_limit_reached')
})
}
{

test('a reached limit with a live reset window is limited', () => {
  const a = codexAvailability(limits('primary', fresh), now, ttl)
  assert.equal(a.state, 'limited')
  assert.equal(a.window, 'primary')
  assert.equal(a.resetsAt, future)
  assert.equal(a.checkedAt, fresh)
  assert.equal(a.observedAt, now.toISOString())
})

test('a limited state is bounded by its reset time, not by snapshot age', () => {
  const a = codexAvailability(limits('primary', old), now, ttl)
  assert.equal(a.state, 'limited')
  assert.equal(a.resetsAt, future)
})
}
{

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
}
{
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
}
