import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeAgyGroups } from './agy-usage-merge.js'

const g = (displayName: string, remainingFraction: number) => ({
  displayName,
  buckets: [{ bucketId: 'weekly', remainingFraction }]
})

test('summary groups win and derived groups only fill missing families', () => {
  const summary = [g('Gemini Models', 0)]
  const merged = mergeAgyGroups(summary, [g('Gemini Models', 0.3), g('Gemini 4 Argon', 1)])
  assert.equal(merged.length, 2)
  assert.equal(merged[0], summary[0])
  assert.equal(merged[1].displayName, 'Gemini 4 Argon')
})

test('derived groups do not duplicate', () => {
  const merged = mergeAgyGroups([], [g('Gemini Models', 0.3), g('Gemini Models', 0.1)])
  assert.equal(merged.length, 1)
  assert.equal(merged[0].buckets[0].remainingFraction, 0.3)
})
