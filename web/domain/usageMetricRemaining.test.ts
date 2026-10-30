import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { metricRemaining } from './metricRemaining.js'
import type { UsageMetric } from './usage.js'

describe('metricRemaining', () => {
  it('uses remaining', () => {
    const m: UsageMetric = { id: 'x', label: 'X', unit: 'credits', used: 10, limit: 100, remaining: 90, resetsAt: null }
    assert.equal(metricRemaining(m), 90)
  })
  it('falls back to limit-used', () => {
    const m: UsageMetric = { id: 'x', label: 'X', unit: 'credits', used: 10, limit: 100, remaining: null, resetsAt: null }
    assert.equal(metricRemaining(m), 90)
  })
  it('null when missing', () => {
    const m: UsageMetric = { id: 'x', label: 'X', unit: 'credits', used: null, limit: null, remaining: null, resetsAt: null }
    assert.equal(metricRemaining(m), null)
  })
})