import test from 'node:test'
import assert from 'node:assert/strict'
import { html } from '../test-util/usageOllamaHtml'
import { shot } from '../test-util/usageOllamaFixture'
import { metric } from '../test-util/usageOllamaFixture'
import { test as import5_test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsagePanelBody } from './UsagePanelBody.js'
import type { UsageProvider } from '../domain/usage.js'
test('the ollama card keeps only the two balances', () => {
  const out = html('ollama', shot)
  assert.match(out, /Included Balance/)
  assert.match(out, /Purchased Balance/)
  for (const id of ['cached_input_tokens', 'input_tokens', 'requests', 'usage_usd']) {
    assert.doesNotMatch(out, new RegExp(id))
  }
})

test('other providers keep every row', () => {
  assert.match(html('claude', shot), /input_tokens/)
})
const inc = metric('included_balance', 'currency', { used: 0.5, limit: 60, remaining: 59.5 })

test('the ollama card shows the remaining percent in remaining mode', () => {
  assert.match(html('ollama', [inc]), /\$59\.50 \(99%\)/)
})

test('the ollama card shows the used percent in used mode', () => {
  assert.match(html('ollama', [inc], false), /\$0\.50 \(1%\)/)
})
{
const inc = metric('included_balance', 'currency', { used: 60, limit: 60, remaining: 0, resetsAt: '2026-11-01T05:40:03.000Z' })
const pur = metric('purchased_balance', 'currency', { used: null, remaining: 7.01 })

test('the ollama card keeps the included reset', () => {
  assert.match(html('ollama', [inc, pur]), /26-11-01 14:40:03/)
})

test('the ollama purchased balance drops its reset line', () => {
  assert.doesNotMatch(html('ollama', [inc, pur]), /재개 시각 미확인/)
})

test('other providers keep reset lines', () => {
  assert.match(html('claude', [inc, pur]), /재개 시각 미확인/)
})
}
{
const test = import5_test;
test('metric rows retain order and label only exhausted rows', () => {
  const metrics = [50, 0, 20].map((remaining, i) => ({
    id: `row${i}`, label: `row${i}`, unit: 'credits',
    used: null, limit: null, remaining, resetsAt: null,
  }))
  const provider: UsageProvider = { provider: 'test', state: 'limited', windows: [], metrics }
  const html = renderToStaticMarkup(createElement(UsagePanelBody, { provider }))
  assert.ok(html.indexOf('row0') < html.indexOf('row1'))
  assert.ok(html.indexOf('row1') < html.indexOf('row2'))
  assert.equal((html.match(/sr-only/g) ?? []).length, 1)
  assert.equal((html.match(/text-danger/g) ?? []).length, 1)
  assert.doesNotMatch(html, /text-error/)
  assert.equal((html.match(/truncate text-sm text-muted-foreground/g) ?? []).length, 3)
  assert.doesNotMatch(html, /border-t|border-border/)
  assert.match(html, /한도 도달/)
})
}
