import test from 'node:test'
import assert from 'node:assert/strict'
import { modelBucketsToGroups } from './agy-quota-models.js'

test('bucketId-only buckets produce no families', () => {
  const g = modelBucketsToGroups([{ bucketId: 'gemini-argon-wtu-weekly', remainingFraction: 0.5 }])
  assert.deepEqual(g, [])
})
