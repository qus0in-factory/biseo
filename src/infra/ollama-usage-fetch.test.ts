import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchOllamaUsage } from './ollama-usage-fetch.js'

test('fetchOllamaUsage returns only balances from the balance endpoint', async () => {
  const origFetch = globalThis.fetch
  globalThis.fetch = (async () => Response.json({
    included: { balance_usd: 45, allowance_usd: 60 },
    purchased: { balance_usd: 8.8 },
    session: { remaining_percent: 25 }
  })) as typeof fetch
  try {
    const res = await fetchOllamaUsage(new Date('2026-10-30T00:00:00Z'))
    assert.equal(res.provider, 'ollama')
    assert.equal(res.state, 'available')
    assert.deepEqual(res.metrics?.map((m) => m.id), ['included_balance', 'purchased_balance'])
    assert.equal(res.windows[0].usedPercent, 25)
  } finally {
    globalThis.fetch = origFetch
  }
})
