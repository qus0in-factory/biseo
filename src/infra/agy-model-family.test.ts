import test from 'node:test'
import assert from 'node:assert/strict'
import { modelFamily, familyKey } from './agy-model-family.js'

const ids: [string, string][] = [
  ['gemini-argon-wtu-weekly', 'argon'], ['gemini-3.8-flash-high', 'gemini'],
  ['claude-opus-5-5-high', 'claude'], ['gpt-oss-120b-medium', 'gpt'],
  ['chat_20706', 'unknown'], ['tab_flash_lite_preview', 'unknown'],
  ['', 'unknown'], ['agy', 'unknown'], ['antigravity', 'unknown'],
  ['gemini', 'unknown'], ['Gemini-3.8', 'unknown'],
]

test('family is read from the quota model id only', () => {
  for (const [id, f] of ids) assert.equal(modelFamily(id), f)
})

test('one pool may cover several families', () => {
  assert.equal(familyKey([]), 'unknown')
  assert.equal(familyKey(['unknown']), 'unknown')
  assert.equal(familyKey(['claude', 'unknown']), 'claude')
  assert.equal(familyKey(['claude', 'gpt']), 'claude-gpt')
})
