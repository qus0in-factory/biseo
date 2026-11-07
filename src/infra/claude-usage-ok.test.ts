import './test-util/claude-snapshot-env.test-util.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { resetClaudeBackoff, claudeBackoffOpen } from './claude-oauth-backoff.js'
import { applyClaudeHttp } from './claude-oauth-apply.js'

const t0 = new Date('2026-11-07T00:00:00.000Z')

test('200 clears fails only after a snapshot is stored', () => {
  resetClaudeBackoff()
  applyClaudeHttp(t0, 429, null)
  applyClaudeHttp(t0, 200, null)
  assert.equal(claudeBackoffOpen(t0.getTime() + 1), true)
  const raw = { five_hour: { utilization: 15, resets_at: '2026-11-07T05:00:00.000Z' } }
  applyClaudeHttp(t0, 200, raw)
  assert.equal(claudeBackoffOpen(t0.getTime() + 1), false)
  resetClaudeBackoff()
})
