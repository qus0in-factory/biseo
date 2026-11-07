import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricRow } from './UsageMetricRow'
import assert from 'node:assert/strict'
const res = r as Record<string, string>
const metric = (id: string) => ({ id, label: 'Pool - 5h', unit: 'percent' as const, used: 12, limit: 100, remaining: 88, resetsAt: null })
test('the agy row shows the model family next to the window', () => {
  const out = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'agy', metric: metric('gemini:Gemini Models:gemini-5h') }))
  assert.match(out, new RegExp(res.usageModelFamily_gemini))
  assert.match(out, /5h/)
})
test('a pool without a detected family shows unknown', () => {
  const out = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'agy', metric: metric('mystery:Pool:weekly') }))
  assert.match(out, new RegExp(res.usageModelFamily_unknown))
})
