import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageMetricGauge } from './UsageMetricGauge'
import { percentMetric } from '../test-util/usageRowAssert'
import r from '../resources.json'

test('metric gauge normalizes bounded units and does not invent an unknown limit', () => {
  const base = percentMetric('2099-01-01T00:00:00Z')
  const metric = { ...base, unit: 'currency', used: 30, limit: 100, remaining: 70 }
  const html = render(h(UsageMetricGauge, { metric }))
  assert.match(html, /aria-valuenow="70"/)
  assert.match(html, new RegExp(`aria-label="${r.usageRemaining}"`))
  assert.doesNotMatch(render(h(UsageMetricGauge, { metric: { ...metric, limit: null } })), /aria-valuenow/)
  assert.match(render(h(UsageMetricGauge, { metric, limited: true })), /bg-danger/)
})
test('metric gauge follows used mode while keeping the used-based warning tone', () => {
  const metric = { ...percentMetric('2099-01-01T00:00:00Z'), used: 98, limit: 100, remaining: 2 }
  const used = render(h(UsageMetricGauge, { metric, remaining: false }))
  assert.match(used, /aria-valuenow="98"/)
  assert.match(used, new RegExp(`aria-label="${r.usageUsed}"`))
  assert.match(used, /bg-warning/)
  const remaining = render(h(UsageMetricGauge, { metric }))
  assert.match(remaining, /aria-valuenow="2"/)
  assert.match(remaining, /bg-warning/)
})
