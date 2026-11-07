import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricRow } from './UsageMetricRow'
import { percentMetric } from '../test-util/usageRowAssert'
import assert from 'node:assert/strict'
test('metric time label appears only when a clock is available', () => {
  const withTime = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'claude', metric: percentMetric(fromNow(3.5)) }))
  const withoutTime = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'claude', metric: percentMetric(null) }))
  assert.ok(withTime.includes(`aria-label="${r.usageTimeLeft}"`))
  assert.ok(!withoutTime.includes(`aria-label="${r.usageTimeLeft}"`))
})
function fromNow(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString()
}
