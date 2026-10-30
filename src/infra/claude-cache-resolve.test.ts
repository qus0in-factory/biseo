import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveClaude, setLastClaudeSnapshot } from './claude-snapshot-store.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { chk, good } from './claude-cache-fixture.test-util.js'

test('a success is stored and served on the next failure', () => {
  process.env.BISEO_CLAUDE_CACHE_TTL_MS = '3600000'
  setLastClaudeSnapshot(null)
  try {
    const now = new Date(chk)
    assert.equal(resolveClaude(now, good), good)
    const r = resolveClaude(new Date('2026-10-30T10:30:00.000Z'), unknownUsage('claude'))
    assert.equal(r.state, 'available')
    assert.equal(r.source, 'claude-cache')
  } finally {
    delete process.env.BISEO_CLAUDE_CACHE_TTL_MS
    setLastClaudeSnapshot(null)
  }
})
