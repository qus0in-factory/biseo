import test from 'node:test'
import assert from 'node:assert/strict'
import { UsageCollector } from './usage-collector.js'

test('UsageCollector aggregates 7 providers', async () => {
  const c = new UsageCollector()
  const rep = await c.getReport()
  assert.equal(rep.providers.length, 7)
  const names = rep.providers.map(p => p.provider)
  assert.deepEqual(names, ['codex', 'claude', 'opencode-go', 'opencode-free', 'grok', 'ollama', 'agy'])
})

test('UsageCollector returns unknown on failure without disguise', async () => {
  const c = new UsageCollector()
  const prev = process.env.BISEO_CODEX_USAGE_URL
  process.env.BISEO_CODEX_USAGE_URL = 'http://127.0.0.1:1/invalid'
  try {
    const rep = await c.getReport()
    const codex = rep.providers.find(p => p.provider === 'codex')
    assert.equal(codex?.state, 'unknown')
    assert.equal(codex?.windows.length, 0)
  } finally {
    if (prev === undefined) delete process.env.BISEO_CODEX_USAGE_URL
    else process.env.BISEO_CODEX_USAGE_URL = prev
  }
})
