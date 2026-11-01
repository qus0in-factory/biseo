import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageMetricRow } from './UsageMetricRow'
import { expectNoTimeIcon, expectTimeIcon } from './usageTimeLeftExpect'
import { metric } from './usageOllamaFixture.test-util'
import { fromNow } from './usageRowAssert.test-util'
import r from '../resources.json'

const res = r as Record<string, string>
const html = (m: ReturnType<typeof metric>) =>
  renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'ollama', metric: m, remaining: false }))

test('the used view shows monthly elapsed time for the included balance only', () => {
  const m = metric('included_balance', 'currency', { used: 0.5, limit: 60, remaining: 59.5, startsAt: fromNow(-18), resetsAt: fromNow(12) })
  expectTimeIcon(html(m), res.usageTimeElapsed, 60)
  const p = metric('purchased_balance', 'currency', { used: null, remaining: 7 })
  expectNoTimeIcon(html(p), res.usageTimeElapsed)
})
