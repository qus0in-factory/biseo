import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveClaude, setLastClaudeSnapshot } from './claude-snapshot-store.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { chk, good } from './claude-cache-fixture.test-util.js'

test('a zero, negative, or NaN ttl never serves the cache', () => {
  setLastClaudeSnapshot(good, Date.parse(chk))
  try {
    for (const ttl of ['0', '-1', 'abc', '']) {
      process.env.BISEO_CLAUDE_CACHE_TTL_MS = ttl
      const r = resolveClaude(new Date('2026-10-30T12:00:00.000Z'), unknownUsage('claude'))
      assert.equal(r.state, 'unknown', `ttl=${ttl}`)
      assert.deepEqual(r.metrics, [])
    }
  } finally {
    delete process.env.BISEO_CLAUDE_CACHE_TTL_MS
    setLastClaudeSnapshot(null)
  }
})
