import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCodexWham } from './codex-wham-parse.js'

test('secondary-only weekly plan also omits absent five-hour window', () => {
  const result = parseCodexWham({ rate_limit: { secondary_window: {
    used_percent: 42, limit_window_seconds: 604800, reset_after_seconds: 60
  } } }, new Date('2026-11-01T00:00:00Z'))
  assert.equal(result.state, 'available')
  assert.equal(result.windows[0].window, 'w')
  assert.equal(result.windows.length, 1)
  assert.equal(result.metrics.length, 1)
  assert.equal(result.windows[0].usedPercent, 42)
  assert.equal(result.windows.some(w => w.window === 'unknown'), false)
  assert.equal(result.metrics.some(m => m.id === 'unknown'), false)
})
