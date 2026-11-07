import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricRow } from './UsageMetricRow'
import { UsageWindowRow } from './UsageWindowRow'
import { percentMetric, percentValue } from '../test-util/usageRowAssert'
import assert from 'node:assert/strict'
test('both usage row types preserve the remaining value and label near a limit', () => {
  const metric = { ...percentMetric(null), used: 98, remaining: 2 }
  const value = { ...percentValue(null), usedPercent: 98 }
  for (const node of [createElement(UsageMetricRow, { provider: 'claude', metric }), createElement(UsageWindowRow, { provider: 'codex', value })]) {
    const out = renderToStaticMarkup(node)
    assert.match(out, /title="2%"/)
    assert.ok(out.includes(`>${r.usageWindow_secondary}<`))
  }
})
