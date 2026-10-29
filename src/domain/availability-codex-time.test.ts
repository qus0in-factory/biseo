import test from 'node:test'
import assert from 'node:assert/strict'
import { codexAt, now, old } from './availability-fixture.test.js'

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
