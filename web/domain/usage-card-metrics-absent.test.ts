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
    const kept = selectCardMetrics(provider, metrics).map((x) => x.id)
    assert.deepEqual(kept, ['w', 'unknown'])
  }
})

test('ollama provider filters out non-balance metrics including unknown', () => {
  const metrics: UsageMetric[] = [
    { id: 'included_balance', label: 'inc', unit: 'currency', used: 5, limit: 10, remaining: 5, resetsAt: null },
    { id: 'unknown', label: 'unknown', unit: 'percent', used: null, limit: 100, remaining: null, resetsAt: null },
  ]
  const kept = selectCardMetrics('ollama', metrics).map((x) => x.id)
  assert.deepEqual(kept, ['included_balance'])
})
