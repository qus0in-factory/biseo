import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricRow } from './UsageMetricRow'
import { expectNoTimeIcon } from '../test-util/usageTimeLeftExpect'
import { metric } from '../test-util/usageOllamaFixture'
test('the used view hides time for a purchased balance', () => {
  const m = metric('purchased_balance', 'currency', { used: null, remaining: 7 })
  const out = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'ollama', metric: m, remaining: false }))
  expectNoTimeIcon(out, (r as Record<string, string>).usageTimeLeft)
})
