import test from 'node:test'
import assert from 'node:assert/strict'
import { formatMetricValue, metricValueUnknown } from './usage-metric-format.js'
import type { UsageMetric } from './usage.js'
test('unknown percent stays unknown and a known percent does not', () => {
  const p: UsageMetric = { id: 'p', label: 'P', unit: 'percent', used: 42, limit: 100, remaining: 58, resetsAt: null }
  const unk: UsageMetric = { id: 'u', label: 'U', unit: 'percent', used: null, limit: 100, remaining: null, resetsAt: null }
  assert.equal(formatMetricValue(unk, '미확인'), '미확인')
  assert.equal(metricValueUnknown(unk), true)
  assert.equal(metricValueUnknown(p), false)
})
