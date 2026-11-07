import test from 'node:test'
import assert from 'node:assert/strict'
import { parseUsage } from './usage-sync.js'
import { mergeUsageStale } from './usage-merge-stale.js'

test('D1 restores only unexpired Claude values and retains success time', () => {
  const at = '2026-11-07T00:00:00Z'
  const old = parseUsage({ providers: [{ provider: 'claude', state: 'available',
    checkedAt: at, windows: [{ window: 'primary', usedPercent: 42,
      resetsAt: '2026-11-08T00:00:00Z' }] }] })
  const rows = parseUsage({ providers: [{ provider: 'claude', state: 'unknown', reason: 'rate_limited' }] })
  rows[0].updatedAt = at
  const r = mergeUsageStale(rows, old)[0]
  assert.equal(r.usedPercent, 42)
  assert.equal(r.state, 'unknown')
  assert.equal(r.checkedAt, at)
  rows[0].updatedAt = '2026-11-08T00:00:00Z'
  assert.equal(mergeUsageStale(rows, old)[0].usedPercent, null)
})
