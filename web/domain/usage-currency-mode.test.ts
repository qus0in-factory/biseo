import test from 'node:test'
import assert from 'node:assert/strict'
import { formatMetricValue } from './usage-metric-format.js'
import type { UsageMetric } from './usage.js'

const inc: UsageMetric = { id: 'included_balance', label: 'Included Balance', unit: 'currency', used: 0.51225, limit: 60, remaining: 59.48775, resetsAt: null }
const usd: UsageMetric = { id: 'usage_usd', label: 'Usage', unit: 'currency', used: 30, limit: 120, remaining: 90, resetsAt: null }

test('remaining mode reports the remaining share of the limit', () => {
  assert.equal(formatMetricValue(inc), '$59.49 (99%)')
})

test('used mode reports the used share of the limit', () => {
  assert.equal(formatMetricValue(inc, '알 수 없음', false), '$0.51 (1%)')
})

test('every currency row follows the mode', () => {
  assert.equal(formatMetricValue(usd), '$90.00 (75%)')
  assert.equal(formatMetricValue(usd, '알 수 없음', false), '$30.00 (25%)')
})
