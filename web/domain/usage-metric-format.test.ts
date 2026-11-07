import test from 'node:test'
import assert from 'node:assert/strict'
import { formatMetricValue } from './usage-metric-format.js'
import type { UsageMetric } from './usage.js'
import { metricValueUnknown } from './usage-metric-format.js'
import { describe } from 'node:test'
import { it } from 'node:test'
import r from '../resources.json'

const inc: UsageMetric = { id: 'included_balance', label: 'Included Balance', unit: 'currency', used: 0.51225, limit: 60, remaining: 59.48775, resetsAt: null }
const pur: UsageMetric = { id: 'purchased_balance', label: 'Purchased Balance', unit: 'currency', used: null, limit: null, remaining: 8.8, resetsAt: null }
const usd: UsageMetric = { id: 'usage_usd', label: 'Usage', unit: 'currency', used: 30, limit: 120, remaining: 90, resetsAt: null }

test('remaining mode reports the remaining share of the limit', () => {
  assert.equal(formatMetricValue(inc), '$59.49 (99%)')
})

test('used mode shows balance metrics with a balance label', () => {
  assert.equal(formatMetricValue(inc, '알 수 없음', false), `${r.usageBalance} $59.49 (99%)`)
  assert.equal(formatMetricValue(pur, '알 수 없음', false), `${r.usageBalance} $8.80`)
})

test('every currency row follows the mode', () => {
  assert.equal(formatMetricValue(usd), '$90.00 (75%)')
  assert.equal(formatMetricValue(usd, '알 수 없음', false), '$30.00 (25%)')
})
{
const inc: UsageMetric = { id: 'included_balance', label: 'Included Balance', unit: 'currency', used: 45, limit: 60, remaining: 15, resetsAt: null }
const pur: UsageMetric = { id: 'purchased_balance', label: 'Purchased Balance', unit: 'currency', used: null, limit: null, remaining: 8.8, resetsAt: null }

test('ollama included balance shows remaining usd and remaining percent', () => {
  assert.equal(formatMetricValue(inc), '$15.00 (25%)')
  assert.equal(formatMetricValue(inc, '알 수 없음', false), `${r.usageBalance} $15.00 (25%)`)
  assert.equal(formatMetricValue(pur), '$8.80')
})
}
test('formatMetricValue formats percent, credits, currency and fallback', () => {
  const p: UsageMetric = { id: 'p', label: 'P', unit: 'percent', used: 42, limit: 100, remaining: 58, resetsAt: null }
  assert.equal(formatMetricValue(p), '42%')

  const c: UsageMetric = { id: 'c', label: 'C', unit: 'credits', used: null, limit: null, remaining: 150, resetsAt: null }
  assert.equal(formatMetricValue(c), '150 credits')

  const cur: UsageMetric = { id: 'm', label: 'M', unit: 'currency', used: null, limit: null, remaining: 25, resetsAt: null }
  assert.equal(formatMetricValue(cur), '$25.00')

  const unk: UsageMetric = { id: 'u', label: 'U', unit: 'percent', used: null, limit: 100, remaining: null, resetsAt: null }
  assert.equal(formatMetricValue(unk, '미확인'), '미확인')
  assert.equal(metricValueUnknown(unk), true)
  assert.equal(metricValueUnknown(p), false)
})
describe('percent remaining', () => {
  it('uses metricRemaining when show', () => {
    const m: UsageMetric = { id: 'p', label: 'P', unit: 'percent', used: 42, limit: 100, remaining: 58, resetsAt: null }
    assert.equal(formatMetricValue(m, '알 수 없음', true), '58%')
  })
})
