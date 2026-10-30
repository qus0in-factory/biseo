import test from 'node:test'
import assert from 'node:assert/strict'
import { modelBucketsToGroups } from './agy-quota-models.js'

test('chat_* and tab_* become a chat sessions group, not Gemini 4 Argon', () => {
  const g = modelBucketsToGroups([
    { modelId: 'chat_20706', remainingFraction: 1 },
    { modelId: 'tab_flash_lite_preview', remainingFraction: 1 }
  ])
  assert.deepEqual(g.map(x => x.displayName), ['Chat sessions'])
  assert.deepEqual(g[0].families, ['unknown'])
})

test('explicit gemini-argon ids stay out of generic Gemini Models', () => {
  const g = modelBucketsToGroups([
    { modelId: 'gemini-2.5-pro', remainingFraction: 0.4 },
    { modelId: 'gemini-argon-wtu-weekly', remainingFraction: 0.75 }
  ])
  assert.deepEqual(g.map(x => x.displayName).sort(), ['Gemini 4 Argon', 'Gemini Models'])
  assert.deepEqual(g.find(x => x.displayName === 'Gemini 4 Argon')?.families, ['argon'])
  assert.deepEqual(g.find(x => x.displayName === 'Gemini Models')?.families, ['gemini'])
})
