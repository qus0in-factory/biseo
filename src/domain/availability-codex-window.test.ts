import test from 'node:test'
import assert from 'node:assert/strict'
import { codexAt, future, now } from './availability-fixture.test.js'

test('the reached window is matched exactly', () => {
  const other = '2026-10-29T12:00:00.000Z'
  const a = codexAt({ reached: 'xsecondary', primary: future, secondary: other, snapshotAt: now.toISOString() })
  assert.equal(a.state, 'limited')
  assert.equal(a.window, 'primary')
  assert.equal(a.resetsAt, future)
})
