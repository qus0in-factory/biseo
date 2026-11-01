import test from 'node:test'
import assert from 'node:assert/strict'
import { html } from './usageOllamaHtml.test-util.js'
import { metric } from './usageOllamaFixture.test-util.js'

const inc = metric('included_balance', 'currency', { used: 0.5, limit: 60, remaining: 59.5 })

test('the ollama card shows the remaining percent in remaining mode', () => {
  assert.match(html('ollama', [inc]), /\$59\.5 \(99%\)/)
})

test('the ollama card shows the used percent in used mode', () => {
  assert.match(html('ollama', [inc], false), /\$0\.5 \(1%\)/)
})
