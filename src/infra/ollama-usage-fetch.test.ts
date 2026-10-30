import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchOllamaUsage } from './ollama-usage-fetch.js'

test('fetchOllamaUsage returns available when daemon is up', async () => {
  const res = await fetchOllamaUsage()
  assert.equal(res.provider, 'ollama')
  // Ollama daemon is currently running on localhost:11434
  assert.equal(res.state, 'available')
  assert.equal(res.windows.length, 1)
  assert.equal(res.windows[0].window, 'primary')
})
