import test from 'node:test'
import assert from 'node:assert/strict'
import { usageProviderFamily } from './usage-provider-family.js'

test('provider icons reuse the existing model families with a Bot fallback', () => {
  assert.equal(usageProviderFamily('agy'), 'antigravity')
  assert.equal(usageProviderFamily('claude'), 'claude')
  assert.equal(usageProviderFamily('codex'), 'gpt')
  assert.equal(usageProviderFamily('ollama'), 'ollama')
})
