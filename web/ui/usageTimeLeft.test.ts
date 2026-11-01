import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageMetricRow } from './UsageMetricRow.js'
import { expectTimeIcon } from './usageTimeLeftExpect.js'
import r from '../resources.json'

const DAY = 86_400_000
const fromNow = (days: number) => new Date(Date.now() + days * DAY).toISOString()
const label = (r as Record<string, string>).usageTimeLeft

test('w and m metric rows put remaining usage and remaining time side by side', () => {
  const metric = { id: 'seven_day', label: 'seven_day', unit: 'percent', used: 50, limit: 100, remaining: 50, resetsAt: fromNow(3.5) }
  const html = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'claude', metric }))
  expectTimeIcon(html, label, 50)
})
