import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchClaudeUsage } from './claude-oauth-fetch.js'
import { setLastClaudeSnapshot } from './claude-snapshot-store.js'
import { chk, good } from './claude-cache-fixture.test-util.js'
import { withCacheEnv } from './claude-cache-env.test-util.js'

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
