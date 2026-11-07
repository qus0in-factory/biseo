import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricRow } from './UsageMetricRow'
import { expectTimeIcon } from '../test-util/usageTimeLeftExpect'
test('w and m metric rows put remaining usage and remaining time side by side', () => {
  const metric = { id: 'seven_day', label: 'seven_day', unit: 'percent' as const, used: 50, limit: 100, remaining: 50, resetsAt: new Date(Date.now() + 3.5 * 86_400_000).toISOString() }
  const html = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'claude', metric }))
  expectTimeIcon(html, (r as Record<string, string>).usageTimeLeft, 50)
})
