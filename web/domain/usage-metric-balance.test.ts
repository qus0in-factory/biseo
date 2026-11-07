import test from 'node:test'
import assert from 'node:assert/strict'
import { formatMetricValue } from './usage-metric-format.js'
import type { UsageMetric } from './usage.js'
import r from '../resources.json'
const inc: UsageMetric = { id: 'included_balance', label: 'Included Balance', unit: 'currency', used: 0.51225, limit: 60, remaining: 59.48775, resetsAt: null }
const pur: UsageMetric = { id: 'purchased_balance', label: 'Purchased Balance', unit: 'currency', used: null, limit: null, remaining: 8.8, resetsAt: null }
test('used mode shows balance metrics with a balance label', () => {
  assert.equal(formatMetricValue(inc, '알 수 없음', false), `${r.usageBalance} $59.49 (99%)`)
  assert.equal(formatMetricValue(pur, '알 수 없음', false), `${r.usageBalance} $8.80`)
})
