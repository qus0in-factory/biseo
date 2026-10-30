import test from 'node:test'
import assert from 'node:assert/strict'
import { modelBucketsToGroups } from './agy-quota-models.js'

test('model buckets group by official family, skip internal ids', () => {
  const g = modelBucketsToGroups([
    { modelId: 'gemini-2.5-pro', remainingFraction: 0.4 },
    { modelId: 'claude-opus-5-5-high', remainingFraction: 0 },
    { modelId: 'gpt-oss-120b-medium', remainingFraction: 0.2 },
    { modelId: 'chat_20706', remainingFraction: 1 }
  ])
  assert.deepEqual(g.map((x) => x.displayName), ['Gemini Models', 'Claude and GPT models'])
  assert.equal(g[0].buckets[0].remainingFraction, 0.4)
  assert.equal(g[1].buckets[0].remainingFraction, 0)
  assert.deepEqual(modelBucketsToGroups([]), [])
  assert.deepEqual(modelBucketsToGroups([{ modelId: 'gemini-2.5-pro' }]), [])
})

test('bucketId-only buckets produce no families', () => {
  const g = modelBucketsToGroups([{ bucketId: 'gemini-argon-wtu-weekly', remainingFraction: 0.5 }])
  assert.deepEqual(g, [])
})
