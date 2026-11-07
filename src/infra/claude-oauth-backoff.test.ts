import test from 'node:test'
import assert from 'node:assert/strict'
import { noteClaudeFail, resetClaudeBackoff } from './claude-oauth-backoff.js'

const cfg = { initialMs: 60_000, maxMs: 900_000, factor: 2 }

test('claude backoff starts at 1m, doubles, and caps at 15m', () => {
  resetClaudeBackoff()
  const steps = [60_000, 120_000, 240_000, 480_000, 900_000, 900_000]
  let now = 0
  for (const wait of steps) {
    const until = noteClaudeFail(now, cfg)
    assert.equal(until - now, wait)
    now = until
  }
  resetClaudeBackoff()
})

test('claude backoff ignores a second failure while the window is already open', () => {
  resetClaudeBackoff()
  const first = noteClaudeFail(0, cfg)
  assert.equal(noteClaudeFail(10, cfg), first)
  assert.equal(noteClaudeFail(first, cfg) - first, 120_000)
  resetClaudeBackoff()
})
