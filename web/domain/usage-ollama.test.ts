import test from 'node:test'
import assert from 'node:assert/strict'
import { selectCardMetrics } from './usage-ollama.js'
import type { UsageMetric } from './usage.js'

const m = (id: string): UsageMetric => ({
  id, label: id, unit: 'tokens', used: 1, limit: null, remaining: null, resetsAt: null,
})

test('ollama keeps only the two balances', () => {
  const ids = ['cached_input_tokens', 'included_balance', 'input_tokens', 'purchased_balance', 'requests']
  const kept = selectCardMetrics('ollama', ids.map(m)).map((x) => x.id)
  assert.deepEqual(kept, ['included_balance', 'purchased_balance'])
})

test('other providers keep every metric', () => {
  const ids = ['five_hour', 'session']
  assert.deepEqual(selectCardMetrics('claude', ids.map(m)).map((x) => x.id), ids)
})
