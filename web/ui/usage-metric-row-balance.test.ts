import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricRow } from './UsageMetricRow'
import { fromNow } from '../test-util/usageRowAssert'
import { expectTimeIcon } from '../test-util/usageTimeLeftExpect'
import { metric } from '../test-util/usageOllamaFixture'
test('included balance is a monthly window', () => {
  const label = (r as Record<string, string>).usageTimeLeft
  const m = metric('included_balance', 'currency', { used: 0.5, limit: 60, remaining: 59.5, startsAt: fromNow(-15), resetsAt: fromNow(15) })
  expectTimeIcon(renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'ollama', metric: m })), label, 50)
})
