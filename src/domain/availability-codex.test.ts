import test from 'node:test'
import assert from 'node:assert/strict'
import { codexAt, future, now } from './availability-fixture.test.js'

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
