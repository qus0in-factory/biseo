import test from 'node:test'
import assert from 'node:assert/strict'
import { formatMetricValue } from './usage-metric-format.js'
import type { UsageMetric } from './usage.js'
test('formatMetricValue formats percent, credits and currency', () => {
  const p: UsageMetric = { id: 'p', label: 'P', unit: 'percent', used: 42, limit: 100, remaining: 58, resetsAt: null }
  assert.equal(formatMetricValue(p), '42%')
  const c: UsageMetric = { id: 'c', label: 'C', unit: 'credits', used: null, limit: null, remaining: 150, resetsAt: null }
  assert.equal(formatMetricValue(c), '150 credits')
  const cur: UsageMetric = { id: 'm', label: 'M', unit: 'currency', used: null, limit: null, remaining: 25, resetsAt: null }
  assert.equal(formatMetricValue(cur), '$25.00')
})
