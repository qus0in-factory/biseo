import assert from 'node:assert/strict'
import test from 'node:test'
import { parseUsage } from '../app/usage-sync.js'
import { groupUsage } from '../app/usage-group.js'

test('an empty unknown provider keeps reason without default', () => {
  const rows = parseUsage({ providers: [{ provider: 'agy', state: 'unknown', metrics: [], windows: [], reason: 'agy_auth_expired' }] })
  assert.equal(rows.length, 1)
  assert.notEqual(rows[0].metricId, 'default')
  assert.equal(rows[0].reason, 'agy_auth_expired')
  const grouped = groupUsage(rows)
  assert.equal(grouped[0].metrics.length, 0)
  assert.equal(grouped[0].windows.length, 1)
  assert.equal(grouped[0].windows[0].window,'status')
  assert.equal(grouped[0].reason, 'agy_auth_expired')
})

test('an empty provider without a reason still avoids default', () => {
  const rows = parseUsage({ providers: [{ provider: 'codex', state: 'unknown' }] })
  assert.equal(rows.length, 1)
  assert.notEqual(rows[0].metricId, 'default')
  assert.equal(rows[0].reason, null)
})
