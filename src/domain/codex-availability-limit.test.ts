import test from 'node:test'
import assert from 'node:assert/strict'
import { codexAvailability } from './codex-availability.js'
import { fresh, future, limits, now, old, ttl } from './availability-fixture.test.js'

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
