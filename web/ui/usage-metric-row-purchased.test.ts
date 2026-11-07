import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricRow } from './UsageMetricRow'
import { fromNow } from '../test-util/usageRowAssert'
import { expectNoTimeIcon } from '../test-util/usageTimeLeftExpect'
import { metric } from '../test-util/usageOllamaFixture'
import assert from 'node:assert/strict'
test('purchased and currency rows keep no time column', () => {
  const label = (r as Record<string, string>).usageTimeLeft
  const m = metric('purchased_balance', 'currency', { used: null, remaining: 7, startsAt: fromNow(-15), resetsAt: fromNow(15) })
  expectNoTimeIcon(renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'ollama', metric: m })), label)
  expectNoTimeIcon(renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'claude', metric: m })), label)
})
