import './test-util/claude-snapshot-env.test-util.js'
import test, { beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { UsageCollector } from './usage-collector.js'
import { isolatedAgy } from './test-util/agy-isolate.test-util.js'

beforeEach(t => {
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 503 }))
})

test('UsageCollector aggregates 6 providers', async () => {
  const rep = await isolatedAgy(() => new UsageCollector().getReport())
  assert.equal(rep.providers.length, 6)
  const names = rep.providers.map(p => p.provider)
  assert.deepEqual(names, ['codex', 'claude', 'opencode-go', 'grok', 'ollama', 'agy'])
})

test('UsageCollector keeps failures unknown', async () => {
  const rep = await isolatedAgy(() => new UsageCollector().getReport(), { BISEO_CODEX_USAGE_URL: 'http://127.0.0.1:1/' })
  const codex = rep.providers.find(p => p.provider === 'codex')
  assert.equal(codex?.state, 'unknown')
  assert.equal(codex?.windows.length, 0)
})
