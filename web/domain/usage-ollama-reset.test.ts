import test from 'node:test'
import assert from 'node:assert/strict'
import { showMetricReset, visibleOllamaMetric } from './usage-ollama.js'
import type { UsageMetric } from './usage.js'

const m = (id: string): UsageMetric => ({
  id, label: id, unit: 'currency', used: 1, limit: null, remaining: 1, resetsAt: null,
})

test('only the ollama purchased balance hides its reset line', () => {
  assert.equal(showMetricReset('ollama', m('purchased_balance')), false)
  assert.equal(showMetricReset('ollama', m('included_balance')), true)
  assert.equal(showMetricReset('claude', m('purchased_balance')), true)
})

test('the allowlist covers exactly the two balances', () => {
  assert.equal(visibleOllamaMetric(m('included_balance')), true)
  assert.equal(visibleOllamaMetric(m('purchased_balance')), true)
  assert.equal(visibleOllamaMetric(m('requests')), false)
})
