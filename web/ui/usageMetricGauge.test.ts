import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageMetricGauge } from './UsageMetricGauge'
import { percentMetric } from './usageRowAssert.test-util'

test('metric gauge normalizes bounded units and does not invent an unknown limit', () => {
  const base = percentMetric('2099-01-01T00:00:00Z')
  const metric = { ...base, unit: 'currency', used: 25, limit: 50, remaining: 25 }
  const html = render(h(UsageMetricGauge, { metric }))
  assert.match(html, /aria-valuenow="50"/)
  assert.doesNotMatch(render(h(UsageMetricGauge, { metric: { ...metric, limit: null } })), /aria-valuenow/)
  assert.match(render(h(UsageMetricGauge, { metric, limited: true })), /bg-danger/)
})
