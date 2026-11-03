import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCodexWham } from './codex-wham-parse.js'

test('corrupted window is preserved as unknown', () => {
  const e = parseCodexWham({ rate_limit: { primary_window: {} } })
  assert.equal(e.windows.length, 1)
  assert.equal(e.windows[0].window, 'unknown')
  assert.equal(e.windows[0].usedPercent, null)
  assert.equal(e.state, 'unknown')
  assert.equal(e.metrics[0].id, 'unknown')

  const b = parseCodexWham({ rate_limit: { primary_window: { used_percent: 'bad' } } })
  assert.equal(b.windows[0].window, 'unknown')
  assert.equal(b.state, 'unknown')
})

test('corrupted window mixed with valid window preserves both', () => {
  const m = parseCodexWham({ rate_limit: {
    primary_window: { used_percent: 'bad' },
    secondary_window: { used_percent: 40, limit_window_seconds: 604800 }
  } })
  assert.equal(m.windows.length, 2)
  assert.equal(m.windows[0].window, 'unknown')
  assert.equal(m.windows[1].window, 'w')
  assert.equal(m.metrics[0].id, 'unknown')
  assert.equal(m.metrics[1].id, 'w')
  assert.equal(m.state, 'available')
})
