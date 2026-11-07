import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricRow } from './UsageMetricRow'
import { expectNoTimeIcon } from '../test-util/usageTimeLeftExpect'
test('5h metric rows do not show a remaining time', () => {
  const metric = { id: 'five_hour', label: 'five_hour', unit: 'percent' as const, used: 50, limit: 100, remaining: 50, resetsAt: new Date(Date.now() + 86_400_000).toISOString() }
  const html = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'claude', metric }))
  expectNoTimeIcon(html, (r as Record<string, string>).usageTimeLeft)
})
