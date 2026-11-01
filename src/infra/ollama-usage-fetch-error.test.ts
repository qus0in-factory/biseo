import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchOllamaUsage } from './ollama-usage-fetch.js'

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
