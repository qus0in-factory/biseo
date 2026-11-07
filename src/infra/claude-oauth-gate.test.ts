import test from 'node:test'
import assert from 'node:assert/strict'
import { claudeAfter429, claudeBackoffHit } from './claude-oauth-gate.js'
import { resetClaudeBackoff } from './claude-oauth-backoff.js'
import { setClaude429Log } from './claude-oauth-log.js'

test('429 log stores status and retry-after, then skips until the wait ends', () => {
  resetClaudeBackoff()
  const seen: Array<{ status: number; retryAfter: string | null }> = []
  setClaude429Log((row) => { seen.push(row) })
  try {
    const now = new Date('2026-11-07T00:00:00.000Z')
    const r = claudeAfter429(now, 429, '0')
    assert.equal(r.reason, 'rate_limited')
    assert.equal(r.retryAt, '2026-11-07T00:01:00.000Z')
    assert.deepEqual(seen, [{ status: 429, retryAfter: '0' }])
    assert.equal(claudeBackoffHit(new Date(now.getTime() + 30_000))?.retryAt, r.retryAt)
    assert.equal(claudeBackoffHit(new Date(now.getTime() + 60_000)), null)
  } finally {
    setClaude429Log(null)
    resetClaudeBackoff()
  }
})
