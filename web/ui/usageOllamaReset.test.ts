import test from 'node:test'
import assert from 'node:assert/strict'
import { html } from './usageOllamaHtml.test-util.js'
import { metric } from './usageOllamaFixture.test-util.js'

const inc = metric('included_balance', 'currency', { used: 60, limit: 60, remaining: 0, resetsAt: '2026-11-01T05:40:03.000Z' })
const pur = metric('purchased_balance', 'currency', { used: null, remaining: 7.01 })

test('the ollama card keeps the included reset', () => {
  assert.match(html('ollama', [inc, pur]), /2026-11-01 14:40:03/)
})

test('the ollama purchased balance drops its reset line', () => {
  assert.doesNotMatch(html('ollama', [inc, pur]), /재개 시각 미확인/)
})

test('other providers keep reset lines', () => {
  assert.match(html('claude', [inc, pur]), /재개 시각 미확인/)
})
