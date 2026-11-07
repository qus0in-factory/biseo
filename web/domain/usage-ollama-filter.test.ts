import test from 'node:test'
import assert from 'node:assert/strict'
import { selectCardMetrics } from './usage-ollama.js'
import type { UsageMetric } from './usage.js'
test('ollama provider filters out non-balance metrics including unknown', () => {
  const metrics: UsageMetric[] = [
    { id: 'included_balance', label: 'inc', unit: 'currency', used: 5, limit: 10, remaining: 5, resetsAt: null },
    { id: 'unknown', label: 'unknown', unit: 'percent', used: null, limit: 100, remaining: null, resetsAt: null },
  ]
  assert.deepEqual(selectCardMetrics('ollama', metrics).map((x) => x.id), ['included_balance'])
})
