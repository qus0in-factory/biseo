import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchClaudeUsage } from './claude-oauth-fetch.js'
import { setLastClaudeSnapshot } from './claude-snapshot-store.js'
import { good } from './test-util/claude-cache-fixture.test-util.js'
import { withCacheEnv } from './test-util/claude-cache-env.test-util.js'
import { chk, good } from './test-util/claude-cache-fixture.test-util.js'
import { resolveClaude, setLastClaudeSnapshot } from './claude-snapshot-store.js'
import { unknownUsage } from '../domain/usage-unknown.js'

{

test('an expired cache stays unknown', async () => {
  await withCacheEnv(async () => {
    setLastClaudeSnapshot(good, Date.parse('2026-10-30T08:00:00.000Z'))
    const r = await fetchClaudeUsage(new Date('2026-10-30T10:30:00.000Z'))
    assert.equal(r.provider, 'claude')
    assert.equal(r.state, 'unknown')
    assert.deepEqual(r.metrics, [])
  })
})
}
{

test('claude failure serves the last success with a cache mark', async () => {
  await withCacheEnv(async () => {
    setLastClaudeSnapshot(good, Date.parse(chk))
    const r = await fetchClaudeUsage(new Date('2026-10-30T10:30:00.000Z'))
    assert.equal(r.provider, 'claude')
    assert.equal(r.state, 'available')
    assert.equal(r.source, 'claude-cache')
    assert.equal(r.checkedAt, chk)
    assert.equal(r.metrics[0].used, 12)
    assert.equal(r.windows[0].source, 'claude-cache')
  })
})
}
{

test('no cache stays an honest unknown', async () => {
  await withCacheEnv(async () => {
    const r = await fetchClaudeUsage(new Date('2026-10-30T10:30:00.000Z'))
    assert.equal(r.provider, 'claude')
    assert.equal(r.state, 'unknown')
    assert.deepEqual(r.metrics, [])
    assert.deepEqual(r.windows, [])
  })
})
}
{

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
}
{

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
}
