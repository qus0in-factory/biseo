import test from 'node:test'
import assert from 'node:assert/strict'
import { cacheNote } from './usage-cache'
import type { UsageProvider } from './usage'

test('D1 Claude stale windows expose the original success time', () => {
  const p: UsageProvider = { provider: 'claude', state: 'unknown', metrics: [],
    reason: 'rate_limited', windows: [{ window: 'five_hour', usedPercent: 12,
      source: 'claude-stale', checkedAt: '2026-11-07T00:00:00Z',
      resetsAt: '2026-11-07T05:00:00Z', limitReached: false }] }
  const note = cacheNote(p, { usageStale: '직전 값', usageLastSuccess: '최근 성공' })
  assert.match(note!, /직전 값/)
  assert.match(note!, /최근 성공/)
  assert.match(note!, /09:00/)
})
