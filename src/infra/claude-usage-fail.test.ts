import './test-util/claude-snapshot-env.test-util.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { resetClaudeBackoff as gate } from './claude-oauth-backoff.js'
import { resetClaudeRefresh as clear } from './claude-usage-refresh.js'
import { readClaudeUsage as read } from './claude-usage-read.js'
import { claudeFail } from './test-util/claude-poll-case.test-util.js'
test('read keeps 401, 503, and empty 200', async () => {
  for (const [status, reason] of [[401, 'auth_required'], [503, 'upstream_error'], [200, null]] as const) {
    const at = await claudeFail(status)
    const r = await read(new Date(+at + 1))
    assert.equal(r.state, 'unknown')
    assert.equal(r.reason ?? null, reason)
    assert.equal(r.windows.length, 0)
  }
  gate(); clear()
})
