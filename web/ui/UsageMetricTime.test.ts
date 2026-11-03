import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricTime } from './UsageMetricTime'
import { percentMetric } from '../test-util/usageRowAssert'
import assert from 'node:assert/strict'

test('metric timestamps expose full period start and reset titles', () => {
  const metric = { ...percentMetric('2026-11-02T00:00:00Z'), startsAt: '2026-11-01T00:00:00Z' }
  const out = renderToStaticMarkup(createElement(UsageMetricTime, { provider: 'claude', metric }))
  assert.match(out, /title="2026-11-01 09:00:00"/)
  assert.match(out, /title="2026-11-02 09:00:00"/)
  assert.ok(out.includes(r.usagePeriodStart))
})
