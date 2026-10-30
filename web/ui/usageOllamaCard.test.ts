import test from 'node:test'
import assert from 'node:assert/strict'
import { html } from './usageOllamaHtml.test-util.js'
import { shot } from './usageOllamaFixture.test-util.js'

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
