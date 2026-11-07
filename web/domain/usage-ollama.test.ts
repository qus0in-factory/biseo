import test from 'node:test'
import assert from 'node:assert/strict'
import { selectCardMetrics } from './usage-ollama.js'
import type { UsageMetric } from './usage.js'
const m = (id: string): UsageMetric => ({ id, label: id, unit: 'tokens', used: 1, limit: null, remaining: null, resetsAt: null })
test('ollama keeps only the two balances', () => {
  const ids = ['cached_input_tokens', 'included_balance', 'input_tokens', 'purchased_balance', 'requests']
  assert.deepEqual(selectCardMetrics('ollama', ids.map(m)).map((x) => x.id), ['included_balance', 'purchased_balance'])
})
test('other providers keep every metric', () => {
  const ids = ['five_hour', 'session']
  assert.deepEqual(selectCardMetrics('claude', ids.map(m)).map((x) => x.id), ids)
})
test('opencode-go keeps only its three usage windows', () => {
  const ids = ['primary', 'secondary', 'monthly', 'unknown']
  assert.deepEqual(selectCardMetrics('opencode-go', ids.map(m)).map((x) => x.id), ['primary', 'secondary', 'monthly'])
})
