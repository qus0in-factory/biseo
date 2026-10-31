import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchOllamaUsage } from './ollama-usage-fetch.js'

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
