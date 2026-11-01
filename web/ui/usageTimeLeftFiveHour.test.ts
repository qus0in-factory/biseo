import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageMetricRow } from './UsageMetricRow.js'
import r from '../resources.json'

const DAY = 86_400_000
const fromNow = (days: number) => new Date(Date.now() + days * DAY).toISOString()
const label = (r as Record<string, string>).usageTimeLeft

test('5h metric rows do not show a remaining time', () => {
  const metric = { id: 'five_hour', label: 'five_hour', unit: 'percent', used: 50, limit: 100, remaining: 50, resetsAt: fromNow(1) }
  const html = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'claude', metric }))
  assert.doesNotMatch(html, new RegExp(label))
})
