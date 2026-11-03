import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageMetricGauge } from './UsageMetricGauge'
import { percentMetric } from './usageRowAssert.test-util'
import r from '../resources.json'

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
