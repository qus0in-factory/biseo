import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricRow } from './UsageMetricRow'
import assert from 'node:assert/strict'
test('other providers keep the plain window label', () => {
  const metric = { id: 'five_hour', label: 'Pool - 5h', unit: 'percent' as const, used: 12, limit: 100, remaining: 88, resetsAt: null }
  const out = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'claude', metric }))
  assert.doesNotMatch(out, new RegExp((r as Record<string, string>).usageModelFamily_gemini))
})
