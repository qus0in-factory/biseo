import { test } from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricRow } from './UsageMetricRow'
import { UsageModalDisplay } from './UsageModalDisplay'
import assert from 'node:assert/strict'
test('unknown metric values label the schedule as expected', () => {
  const original = Date.now
  Date.now = () => Date.parse('2026-11-03T00:00:00Z')
  try {
    const metric = { id: '5h', label: '5h', unit: 'percent' as const, used: null, limit: 100, remaining: null, resetsAt: '2026-11-03T02:00:00Z' }
    const html = render(h(UsageModalDisplay, { value: true }, h(UsageMetricRow, { provider: 'codex', metric })))
    assert.match(html, new RegExp(r.usageResetExpected))
    assert.match(html, /2시간 후/)
  } finally { Date.now = original }
})
