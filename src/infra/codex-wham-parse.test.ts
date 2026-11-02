import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCodexWham } from './codex-wham-parse.js'

test('parseCodexWham active windows', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const raw = {
    rate_limit: {
      limit_reached: false,
      primary_window: { used_percent: 20, reset_at: 1793361600, limit_window_seconds: 18000 },
      secondary_window: { used_percent: 90, reset_at: 1793880000, limit_window_seconds: 604800 }
    }
  }
  const res = parseCodexWham(raw, now)
  assert.equal(res.state, 'available')
  assert.equal(res.windows[0].usedPercent, 20)
  assert.equal(res.windows[1].usedPercent, 90)
  assert.deepEqual(res.windows.map(w => w.window), ['5h', 'w'])
})

test('parseCodexWham malformed data', () => {
  assert.equal(parseCodexWham(null).state, 'unknown')
})
