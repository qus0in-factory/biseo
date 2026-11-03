import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCodexWham } from './codex-wham-parse.js'

test('primary-only weekly plan is weekly, not five-hour', () => {
  const result = parseCodexWham({ rate_limit: { primary_window: {
    used_percent: 97, limit_window_seconds: 604800, reset_after_seconds: 120
  } } }, new Date('2026-11-01T00:00:00Z'))
  assert.equal(result.state, 'available')
  assert.equal(result.windows[0].window, 'w')
  assert.equal(result.windows[0].resetsAt, '2026-11-01T00:02:00.000Z')
  assert.equal(result.metrics[0].id, 'w')
  assert.equal(result.windows.some(w => w.window === '5h'), false)
  assert.equal(result.windows.length, 1)
  assert.equal(result.metrics.length, 1)
})
