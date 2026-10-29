import test from 'node:test'
import assert from 'node:assert/strict'
import { codexAvailability } from './codex-availability.js'

const now = new Date('2026-10-29T10:00:00.000Z')
const ttl = 15 * 60 * 1000
const fresh = '2026-10-29T09:58:00.000Z'
const old = '2026-10-29T09:00:00.000Z'
const future = '2026-10-29T11:00:00.000Z'

const limits = (reached: string | null, snapshotAt: string | null, resets: string | null = future) => ({
  reached,
  primary: resets,
  secondary: resets,
  snapshotAt,
})

test('a reached limit with a live reset window is limited', () => {
  const a = codexAvailability(limits('primary', fresh), now, ttl)
  assert.equal(a.state, 'limited')
  assert.equal(a.window, 'primary')
  assert.equal(a.resetsAt, future)
  assert.equal(a.checkedAt, fresh)
  assert.equal(a.observedAt, now.toISOString())
})

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

test('a limited state is bounded by its reset time, not by snapshot age', () => {
  const a = codexAvailability(limits('primary', old), now, ttl)
  assert.equal(a.state, 'limited')
  assert.equal(a.resetsAt, future)
})
