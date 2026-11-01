import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCodexWham } from './codex-wham-parse.js'

test('provider limit flag is preserved', () => {
  const result = parseCodexWham({ rate_limit: { limit_reached: true } })
  assert.equal(result.state, 'limited')
})

test('only an active exhausted window implies a limit', () => {
  for (const [reset, state] of [[120, 'limited'], [0, 'available']] as const) {
    const result = parseCodexWham({ rate_limit: { primary_window: {
      used_percent: 100, limit_window_seconds: 604800, reset_after_seconds: reset
    } } }, new Date('2026-11-01T00:00:00Z'))
    assert.equal(result.state, state)
  }
})
