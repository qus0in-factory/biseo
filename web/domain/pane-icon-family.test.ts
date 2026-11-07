import assert from 'node:assert/strict'
import test from 'node:test'
import { paneIconFamily } from './pane-icon-family.js'
test('known model families stay ahead of provider and substring rules', () => {
  assert.equal(paneIconFamily('grok-4.7', 'grok'), 'xai')
  assert.equal(paneIconFamily('muse-spark-1.3-contributor', 'opencode-go'), 'meta')
  assert.equal(paneIconFamily('deepseek-v4.1-flash', 'ollama'), 'deepseek')
  assert.equal(paneIconFamily('claude-sonnet-5.5', 'agy'), 'claude')
  assert.equal(paneIconFamily('gpt-6.1-sol', 'opencode-go'), 'gpt')
})
