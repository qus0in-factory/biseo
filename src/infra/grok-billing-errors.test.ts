import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchGrokUsage } from './grok-billing-fetch.js'
import { setLastGrokSnapshot } from './grok-snapshot-store.js'
import { withGrokMock, staleGrokUsage } from './test-util/grok-mock-server.test-util.js'

for (const [status, body, reason] of [
  [401, '', 'auth_required'], [403, '', 'auth_required'],
  [429, '', 'temporarily_unavailable'], [503, '', 'temporarily_unavailable'],
  [200, '{', 'schema_error'], [200, '{}', 'schema_error']
] as const) test(`billing failure ${status} ${reason}`, async () => {
  let calls = 0
  await withGrokMock((_req, res) => { calls++; res.writeHead(status); res.end(body) }, async () => {
    setLastGrokSnapshot(staleGrokUsage)
    const result = await fetchGrokUsage(new Date(), () => 'test')
    assert.equal(result.reason, reason)
    assert.equal(result.state, 'unknown')
    assert.equal(result.metrics[0].used, 45)
    assert.equal(calls, 1)
  })
})
