import test from 'node:test'
import assert from 'node:assert/strict'
import { claudeAfter429 } from './claude-oauth-gate.js'
import { resetClaudeBackoff } from './claude-oauth-backoff.js'

test('retry-after is combined with backoff and capped at maxMs', () => {
  const now = new Date('2026-11-07T00:00:00Z')
  for (const [header, seconds] of [[null, 60], ['0', 60], ['bad', 60],
    ['30', 60], ['120', 120], ['3600', 900],
    ['Sat, 07 Nov 2026 00:03:00 GMT', 180]] as const) {
    resetClaudeBackoff()
    const r = claudeAfter429(now, 429, header)
    assert.equal(Date.parse(r.retryAt!) - now.getTime(), seconds * 1000)
  }
  resetClaudeBackoff()
})
