import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formatMetricValue } from './usage-metric-format.js'
import type { UsageMetric } from './usage.js'
describe('percent remaining', () => {
  it('uses metricRemaining when show', () => {
    const m: UsageMetric = { id: 'p', label: 'P', unit: 'percent', used: 42, limit: 100, remaining: 58, resetsAt: null }
    assert.equal(formatMetricValue(m, '알 수 없음', true), '58%')
  })
})