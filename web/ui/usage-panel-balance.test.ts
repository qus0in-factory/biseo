import test from 'node:test'
import assert from 'node:assert/strict'
import { html } from '../test-util/usageOllamaHtml'
import { metric } from '../test-util/usageOllamaFixture'
import r from '../resources.json'
const inc = metric('included_balance', 'currency', { used: 0.5, limit: 60, remaining: 59.5 })
test('the ollama card shows the remaining percent in remaining mode', () => {
  assert.match(html('ollama', [inc]), /\$59\.50 \(99%\)/)
})
test('the ollama card shows balances in used mode', () => {
  const pur = metric('purchased_balance', 'currency', { used: null, remaining: 7.01 })
  const out = html('ollama', [inc, pur], false)
  assert.match(out, new RegExp(`${r.usageBalance} \\$59\\.50 \\(99%\\)`))
  assert.match(out, new RegExp(`${r.usageBalance} \\$7\\.01`))
})
