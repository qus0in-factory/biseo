import test from 'node:test'
import assert from 'node:assert/strict'
import { noteClaudeFail, resetClaudeBackoff } from './claude-oauth-backoff.js'

const cfg = { initialMs: 60_000, maxMs: 900_000, factor: 2 }

test('claude backoff extends an open window to a longer retry-after', () => {
  resetClaudeBackoff()
  assert.equal(noteClaudeFail(0, cfg, 60_000), 60_000)
  assert.equal(noteClaudeFail(10_000, cfg, 900_000), 910_000)
  assert.equal(noteClaudeFail(20_000, cfg, 60_000), 910_000)
  assert.equal(noteClaudeFail(910_000, cfg) - 910_000, 120_000)
  resetClaudeBackoff()
})
