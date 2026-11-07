import './test-util/claude-snapshot-env.test-util.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { applyClaudeHttp as apply } from './claude-oauth-apply.js'
import { resetClaudeBackoff as gate } from './claude-oauth-backoff.js'
import { resetClaudeRefresh as clear } from './claude-usage-refresh.js'
import { readClaudeUsage as read } from './claude-usage-read.js'

test('read drops an expired success window', async () => {
  gate(); clear()
  apply(new Date('2026-11-07T00:00:00Z'), 200, {
    five_hour: { utilization: 15, resets_at: '2026-11-07T00:01:00Z' },
  })
  const r = await read(new Date('2026-11-07T00:02:00Z'))
  assert.equal(r.state, 'unknown')
  assert.equal(r.windows.length, 0)
  gate(); clear()
})
