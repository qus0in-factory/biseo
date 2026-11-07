import './test-util/claude-snapshot-env.test-util.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchClaudeUsage } from './claude-oauth-fetch.js'
import { noteClaudeFail, resetClaudeBackoff } from './claude-oauth-backoff.js'

test('an open backoff does not call fetch', async () => {
  resetClaudeBackoff()
  noteClaudeFail(Date.parse('2026-11-07T00:00:00.000Z'), { initialMs: 60_000, maxMs: 900_000, factor: 2 })
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = async () => { calls += 1; return new Response('{}', { status: 200 }) }
  try {
    const r = await fetchClaudeUsage(new Date('2026-11-07T00:00:30.000Z'))
    assert.equal(calls, 0)
    assert.equal(r.reason, 'rate_limited')
  } finally {
    globalThis.fetch = orig
    resetClaudeBackoff()
  }
})
