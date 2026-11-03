import test from 'node:test'
import assert from 'node:assert/strict'
import { selectCardMetrics } from './usage-ollama.js'
import type { UsageMetric } from './usage.js'

test('absent unknown metrics with null used are omitted for all providers', () => {
  const metrics: UsageMetric[] = [
    { id: 'w', label: 'w', unit: 'percent', used: 20, limit: 100, remaining: 80, resetsAt: null },
    { id: 'unknown', label: 'unknown', unit: 'percent', used: null, limit: 100, remaining: null, resetsAt: null },
  ]
  const kept = selectCardMetrics('codex', metrics).map((x) => x.id)
  assert.deepEqual(kept, ['w'])
})
