import test from 'node:test'
import assert from 'node:assert/strict'
import { modelBucketsToGroups } from './agy-quota-models.js'

test('bucketId-only argon maps to Gemini 4 Argon', () => {
  const g = modelBucketsToGroups([{ bucketId: 'gemini-argon-wtu-weekly', remainingFraction: 0.5 }])
  assert.deepEqual(g.map((x) => x.displayName), ['Gemini 4 Argon'])
  assert.deepEqual(g[0].families, ['argon'])
})
