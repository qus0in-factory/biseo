import test from 'node:test'
import assert from 'node:assert/strict'
import { DATE_LIMIT_MS as limit } from './claude-date-range.js'
import { noteClaudeFail, resetClaudeBackoff, claudeBackoffAt } from './claude-oauth-backoff.js'
import { claudeAfter429 } from './claude-oauth-gate.js'

test('backoff and gate keep extreme deadlines inside Date range', () => {
  try {
    resetClaudeBackoff()
    assert.equal(noteClaudeFail(limit, { initialMs: 1e17, maxMs: 1e17, factor: 2 }), limit)
    assert.doesNotThrow(() => claudeBackoffAt())
    resetClaudeBackoff()
    assert.doesNotThrow(() => claudeAfter429(new Date(limit), 429, '1e17'))
    resetClaudeBackoff()
    assert.doesNotThrow(() => claudeAfter429(new Date(NaN), 429, null))
  } finally {
    resetClaudeBackoff()
  }
})
