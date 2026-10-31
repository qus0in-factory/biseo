import test from 'node:test'
import assert from 'node:assert/strict'
import { addArgonWeekly, hasArgonWeekly } from './agy-argon-weekly.js'

test('existing API weekly value wins without a CLI lookup', () => {
  const groups = [{ displayName: 'Gemini 4 Argon', buckets: [
    { window: 'weekly', remainingFraction: 0.4 }
  ] }]
  assert.equal(hasArgonWeekly(groups), true)
  assert.equal(addArgonWeekly(groups, null), groups)
})

test('missing weekly value remains unknown without dropping other windows', () => {
  const groups = [{ displayName: 'Gemini 4 Argon', buckets: [
    { window: '5h', remainingFraction: 0.4 }, { window: 'weekly' }
  ] }]
  const result = addArgonWeekly(groups, null)
  assert.equal(result.length, 1)
  assert.equal(result[0].buckets.length, 2)
  assert.equal(result[0].buckets[1].remainingFraction, undefined)
  assert.equal(hasArgonWeekly(result), false)
})
