import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeAgyGroups } from './agy-usage-merge.js'

const g=(n:string,r:number)=>({displayName:n,buckets:[{bucketId:'weekly',remainingFraction:r}]})

test('summary groups win, derived fill missing families', () => {
  const summary = [g('Gemini Models', 0)]
  const merged = mergeAgyGroups(summary, [g('Gemini Models', 0.3), g('Gemini 4 Argon', 1)])
  assert.equal(merged.length, 2)
  assert.equal(merged[0], summary[0])
  assert.equal(merged[1].displayName, 'Gemini 4 Argon')
})

test('summary Argon beats derived Argon', () => {
  const summary = [g('Gemini 4 Argon', 0.2)]
  const merged = mergeAgyGroups(summary, [g('Gemini 4 Argon', 1)])
  assert.equal(merged.length, 1)
  assert.equal(merged[0], summary[0])
})

test('derived duplicates collapse', () => {
  const merged = mergeAgyGroups([], [g('Gemini Models', 0.3), g('Gemini Models', 0.1)])
  assert.equal(merged.length, 1)
  assert.equal(merged[0].buckets[0].remainingFraction, 0.3)
})
