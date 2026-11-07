import './test-util/claude-snapshot-env.test-util.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { claudeFloorMs as floor } from './claude-oauth-floor.js'
import { resetClaudeBackoff as gate } from './claude-oauth-backoff.js'
import { resetClaudeRefresh as clear } from './claude-usage-refresh.js'
import { UsageCollector } from './usage-collector.js'
import { claudeFail } from './test-util/claude-poll-case.test-util.js'
test('collector keeps rate_limited after 429', async () => {
  const t0 = new Date('2020-01-01T00:00:00Z')
  await claudeFail(429, t0)
  const after = new Date(+t0 + floor() + 1)
  const orig = fetch
  fetch = async () => new Response('', { status: 503 })
  try {
    const hit = (await new UsageCollector().getReport(after)).providers.find(p => p.provider === 'claude')
    assert.equal(hit?.reason, 'rate_limited')
    assert.equal(hit?.windows.length, 0)
  } finally { fetch = orig; gate(); clear() }
})
