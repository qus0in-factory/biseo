import test from 'node:test'
import assert from 'node:assert/strict'
import { formatMetricValue } from './usage-metric-format.js'
import type { UsageMetric } from './usage.js'

const inc: UsageMetric = { id: 'included_balance', label: 'Included Balance', unit: 'currency', used: 45, limit: 60, remaining: 15, resetsAt: null }
const pur: UsageMetric = { id: 'purchased_balance', label: 'Purchased Balance', unit: 'currency', used: null, limit: null, remaining: 8.8, resetsAt: null }

test('ollama included balance shows remaining usd and usage percent', () => {
  assert.equal(formatMetricValue(inc), '$15 (75%)')
  assert.equal(formatMetricValue(inc, '알 수 없음', false), '$45 (75%)')
  assert.equal(formatMetricValue(pur), '$8.8')
})
