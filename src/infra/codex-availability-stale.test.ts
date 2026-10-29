import test from 'node:test'
import assert from 'node:assert/strict'
import { old, readAvailability } from './codex-availability-fixture.test.js'
import { freeRate, token } from './codex-rate-fixture.test.js'

test('an expired snapshot is unknown and never available', async () => {
  const a = await readAvailability([token(freeRate(), old)])
  assert.equal(a.state, 'unknown')
  assert.notEqual(a.state, 'available')
  assert.equal(a.reason, 'stale_snapshot')
  assert.equal(a.checkedAt, old)
})

test('a snapshot without a reached limit is unknown, never available', async () => {
  const a = await readAvailability([token(freeRate())])
  assert.equal(a.state, 'unknown')
  assert.notEqual(a.state, 'available')
  assert.equal(a.reason, 'no_limit_signal')
})
