import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageMetricRow } from './UsageMetricRow'
import { UsageWindowRow } from './UsageWindowRow'
import { percentMetric, percentValue } from './usageRowAssert.test-util'

test('both row types warn below 100 and keep labels and times muted', () => {
  const metric = { ...percentMetric(null), used: 98, remaining: 2 }
  const value = { ...percentValue(null), usedPercent: 98 }
  for (const node of [createElement(UsageMetricRow, { provider: 'claude', metric }),
    createElement(UsageWindowRow, { provider: 'codex', value })]) {
    const html = renderToStaticMarkup(node)
    assert.match(html, /text-warning/)
    assert.match(html, /title="2%"/)
    assert.match(html, /truncate text-sm text-muted-foreground/)
    assert.doesNotMatch(html, /text-danger|text-error|border-t/)
  }
})
