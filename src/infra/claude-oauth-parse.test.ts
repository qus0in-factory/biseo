import test from 'node:test'
import assert from 'node:assert/strict'
import { parseClaudeUsage } from './claude-oauth-parse.js'

test('parseClaudeUsage parses all windows as metrics', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const raw = {
    five_hour: { utilization: 15, resets_at: '2026-10-30T15:00:00Z' },
    seven_day: { utilization: 40, resets_at: '2026-11-06T00:00:00Z' },
    seven_day_opus: { utilization: 60, resets_at: '2026-11-06T00:00:00Z' },
    seven_day_sonnet: { utilization: 25, resets_at: '2026-11-06T00:00:00Z' }
  }
  const res = parseClaudeUsage(raw, now)
  assert.equal(res.state, 'available')
  assert.equal(res.windows.length, 2)
  assert.equal(res.metrics.length, 4)
  assert.equal(res.metrics[0].id, 'five_hour')
  assert.equal(res.metrics[2].id, 'seven_day_opus')
  assert.equal(res.metrics[2].label, '7-Day Opus Limit')
  assert.equal(res.metrics[2].used, 60)
  assert.equal(res.metrics[2].remaining, 40)
})
