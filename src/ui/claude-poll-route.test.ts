import '../infra/test-util/claude-snapshot-env.test-util.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { resetClaudeBackoff as gate } from '../infra/claude-oauth-backoff.js'
import { resetClaudeRefresh as clear } from '../infra/claude-usage-refresh.js'
import { claudeFail } from '../infra/test-util/claude-poll-case.test-util.js'
import { UsageCollector } from '../infra/usage-collector.js'
import { usageRoute } from './usage-route.js'
test('route keeps latest claude failure', async () => {
  await claudeFail(401)
  const orig = fetch
  fetch = async () => new Response('', { status: 503 })
  try {
    const body: any = await usageRoute(new UsageCollector())({ json: (v: unknown) => v } as never)
    const hit = body.providers.find((p: any) => p.provider === 'claude')
    assert.equal(hit.reason, 'auth_required')
    assert.equal(hit.windows.length, 0)
  } finally { fetch = orig; gate(); clear() }
})
