import test from 'node:test'
import assert from 'node:assert/strict'
import { selectCardMetrics } from './usage-ollama.js'
import type { UsageMetric } from './usage.js'
test('unknown metrics are preserved for non-ollama providers', () => {
  const metrics: UsageMetric[] = [
    { id: 'w', label: 'w', unit: 'percent', used: 20, limit: 100, remaining: 80, resetsAt: null },
    { id: 'unknown', label: 'unknown', unit: 'percent', used: null, limit: 100, remaining: null, resetsAt: null },
  ]
  for (const provider of ['claude', 'agy', 'grok', 'codex']) {
    assert.deepEqual(selectCardMetrics(provider, metrics).map((x) => x.id), ['w', 'unknown'])
  }
})
