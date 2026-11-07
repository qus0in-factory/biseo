import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchGrokUsage } from './grok-billing-fetch.js'
import { withGrokMock } from './test-util/grok-mock-server.test-util.js'
import { mockGrokBilling } from './test-util/grok-mock-handler.test-util.js'

test('latest DB access recovers without memory or refresh', async () => {
  const billing = { count: 0 }, refresh = { count: 0 }
  await withGrokMock((req, res) => mockGrokBilling(req, res, billing, refresh), async () => {
    const now = new Date('2026-10-30T10:00:00Z')
    await fetchGrokUsage(now, () => 'expired')
    const result = await fetchGrokUsage(now, () => 'fresh')
    assert.equal(result.state, 'available')
    assert.equal(result.windows[0].usedPercent, 30)
    assert.equal(refresh.count, 0)
    assert.equal(billing.count, 2)
  })
})
