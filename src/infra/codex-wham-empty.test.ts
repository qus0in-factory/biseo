import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCodexWham } from './codex-wham-parse.js'

test('empty windows are unknown without errors', () => {
  const result = parseCodexWham({ rate_limit: {} })
  assert.equal(result.state, 'unknown')
  assert.ok(result.windows.every(w => w.window === 'unknown' && w.usedPercent === null))
})

test('a reset timestamp alone never implies a quota duration', () => {
  const result = parseCodexWham({ rate_limit: { primary_window: {
    used_percent: 99, reset_at: 1793858316
  } } })
  assert.equal(result.windows[0].window, 'unknown')
})
