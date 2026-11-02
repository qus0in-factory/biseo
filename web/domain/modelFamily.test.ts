import test from 'node:test'
import assert from 'node:assert/strict'
import { modelFamily } from './modelFamily.js'

test('model family detection covers known and unknown families', () => {
  assert.equal(modelFamily('claude-opus-4-1', 'anthropic'), 'claude')
  assert.equal(modelFamily('gpt-5.2', 'openai'), 'gpt')
  assert.equal(modelFamily('codex', 'codex'), 'gpt')
  assert.equal(modelFamily('gemini-3-pro', 'agy'), 'gemini')
  assert.equal(modelFamily('deepseek-v4.1-flash', 'ollama'), 'deepseek')
  assert.equal(modelFamily('beam', 'opencode'), 'other')
  assert.equal(modelFamily('gemini-4-argon', 'agy'), 'gemini')
  assert.equal(modelFamily(null, null), 'other')
})
