import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageMetricTime } from './UsageMetricTime'
import { percentMetric } from '../test-util/usageRowAssert'
import r from '../resources.json'

test('metric period start and reset align right with full titles', () => {
  const metric = { ...percentMetric('2026-11-02T00:00:00Z'), startsAt: '2026-11-01T00:00:00Z' }
  const html = renderToStaticMarkup(createElement(UsageMetricTime, { provider: 'claude', metric }))
  assert.match(html, /flex flex-col items-end gap-0\.5 text-xs leading-4 tabular-nums/)
  assert.match(html, /title="2026-11-01 09:00:00"/)
  assert.match(html, /title="2026-11-02 09:00:00"/)
  assert.ok(html.includes(r.usagePeriodStart))
})
