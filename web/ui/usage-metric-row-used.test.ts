import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricRow } from './UsageMetricRow'
import { fromNow } from '../test-util/usageRowAssert'
import { expectTimeIcon } from '../test-util/usageTimeLeftExpect'
import { metric } from '../test-util/usageOllamaFixture'
import assert from 'node:assert/strict'
test('the used view shows the balance and remaining time for the included balance', () => {
  const res = r as Record<string, string>
  const m = metric('included_balance', 'currency', { used: 0.5, limit: 60, remaining: 59.5, startsAt: fromNow(-18), resetsAt: fromNow(12) })
  const out = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'ollama', metric: m, remaining: false }))
  assert.match(out, new RegExp(`${res.usageBalance} \\$59\\.50 \\(99%\\)`))
  expectTimeIcon(out, res.usageTimeLeft, 40)
})
