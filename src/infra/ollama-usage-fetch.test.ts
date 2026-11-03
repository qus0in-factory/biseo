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

test('fetchOllamaUsage reports unknown when the balance endpoint fails', async () => {
  const origFetch = globalThis.fetch
  globalThis.fetch = (async () => new Response('', { status: 404 })) as typeof fetch
  try {
    const res = await fetchOllamaUsage()
    assert.equal(res.provider, 'ollama')
    assert.equal(res.state, 'unknown')
    assert.equal(res.reason, 'unsupported')
    assert.deepEqual(res.metrics, [])
  } finally {
    globalThis.fetch = origFetch
  }
})

test('auth, temporary failures and empty data have distinct reasons', async () => {
  const origFetch = globalThis.fetch
  const cases = [
    [new Response('', { status: 401 }), 'auth_required'],
    [new Response('', { status: 503 }), 'temporarily_unavailable'],
    [Response.json({}), 'balance_unavailable']
  ] as const
  try {
    for (const [response, reason] of cases) {
      globalThis.fetch = (async () => response) as typeof fetch
      assert.equal((await fetchOllamaUsage()).reason, reason)
    }
  } finally { globalThis.fetch = origFetch }
})
