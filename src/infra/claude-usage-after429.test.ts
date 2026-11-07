import './test-util/claude-snapshot-env.test-util.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { applyClaudeHttp as apply } from './claude-oauth-apply.js'
import { claudeFloorMs as floor } from './claude-oauth-floor.js'
import { refreshClaudeUsage as poll, resetClaudeRefresh as clear } from './claude-usage-refresh.js'
import { resetClaudeBackoff as gate } from './claude-oauth-backoff.js'
import { readClaudeUsage as read } from './claude-usage-read.js'
test('read keeps rate_limited after 429', async () => {
  const t0 = new Date('2026-11-07T00:00:00Z')
  gate(); clear()
  apply(t0, 200, { five_hour: { utilization: 15, resets_at: '2026-11-07T00:01:00Z' } })
  await poll(t0, async () => apply(t0, 429, null))
  const r = await read(new Date(+t0 + floor() + 1))
  assert.equal(r.reason, 'rate_limited')
  assert.equal(r.state, 'unknown')
  assert.equal(r.windows.length, 0)
  gate(); clear()
})
