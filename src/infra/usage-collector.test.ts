import test from 'node:test'
import assert from 'node:assert/strict'
import { UsageCollector } from './usage-collector.js'
import { isolatedAgy } from './agy-isolate.test-util.js'

test('UsageCollector aggregates 7 providers', async () => {
  const rep = await isolatedAgy(() => new UsageCollector().getReport())
  assert.equal(rep.providers.length, 7)
  const names = rep.providers.map(p => p.provider)
  assert.deepEqual(names, ['codex', 'claude', 'opencode-go', 'opencode-free', 'grok', 'ollama', 'agy'])
})

test('UsageCollector returns unknown on failure without disguise', async () => {
  const rep = await isolatedAgy(() => new UsageCollector().getReport(), { BISEO_CODEX_USAGE_URL: 'http://127.0.0.1:1/' })
  const codex = rep.providers.find(p => p.provider === 'codex')
  assert.equal(codex?.state, 'unknown')
  assert.equal(codex?.windows.length, 0)
})
