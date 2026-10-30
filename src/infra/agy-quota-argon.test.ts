import test from 'node:test'
import assert from 'node:assert/strict'
import { modelBucketsToGroups } from './agy-quota-models.js'

test('chat_* and tab_* never fabricate a Gemini 4 Argon group', () => {
  const g = modelBucketsToGroups([
    { modelId: 'chat_20706', remainingFraction: 1 },
    { modelId: 'chat_23310', remainingFraction: 1 },
    { modelId: 'tab_flash_lite_preview', remainingFraction: 1 }
  ])
  assert.deepEqual(g, [])
})

test('explicit gemini-argon ids stay out of generic Gemini Models', () => {
  const g = modelBucketsToGroups([
    { modelId: 'gemini-2.5-pro', remainingFraction: 0.4 },
    { modelId: 'gemini-argon-wtu-weekly', remainingFraction: 0.75 }
  ])
  assert.deepEqual(g.map((x) => x.displayName).sort(), ['Gemini 4 Argon', 'Gemini Models'])
  assert.equal(g.find((x) => x.displayName === 'Gemini 4 Argon')?.buckets[0].remainingFraction, 0.75)
})
