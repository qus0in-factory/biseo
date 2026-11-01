import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageMetricRow } from './UsageMetricRow.js'
import { expectTimeIcon } from './usageTimeLeftExpect.js'
import r from '../resources.json'

const DAY = 86_400_000
const fromNow = (days: number) => new Date(Date.now() + days * DAY).toISOString()
const left = (r as Record<string, string>).usageTimeLeft
const elapsed = (r as Record<string, string>).usageTimeElapsed

test('the used view shows elapsed time next to the used share', () => {
  const metric = { id: 'seven_day', label: 'seven_day', unit: 'percent', used: 70, limit: 100, remaining: 30, resetsAt: fromNow(5.25) }
  const html = renderToStaticMarkup(
    createElement(UsageMetricRow, { provider: 'claude', metric, remaining: false }),
  )
  assert.match(html, /70%/)
  expectTimeIcon(html, elapsed, 25)
  assert.doesNotMatch(html, new RegExp(`"${left}"`))
})
