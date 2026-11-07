import test from 'node:test'
import assert from 'node:assert/strict'
import { safeFetch } from './usage-safe-fetch.js'
import { fetchGrokUsage } from './grok-billing-fetch.js'
import { setLastGrokSnapshot } from './grok-snapshot-store.js'
import { withGrokMock, staleGrokUsage } from './test-util/grok-mock-server.test-util.js'

test('safeFetch preserves Grok unknown stale after 401', async () => {
  await withGrokMock((_req, res) => { res.writeHead(401); res.end() }, async () => {
    setLastGrokSnapshot(staleGrokUsage)
    const result = await safeFetch('grok', now => fetchGrokUsage(now, () => 'test'), new Date())
    assert.equal(result.state, 'unknown')
    assert.equal(result.reason, 'auth_required')
    assert.equal(result.metrics[0].used, 45)
    assert.equal(result.windows[0].source, 'grok-stale')
  })
})
