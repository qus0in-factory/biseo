import test from 'node:test'
import assert from 'node:assert/strict'
import { quotaGroup } from './agy-quota-group.js'

test('quotaGroup keeps weekly and 5h buckets of one pool apart', () => {
  const g = quotaGroup('Gemini Models', [
    { modelId: 'gemini-2.5-pro', remainingFraction: 0.4, resetTime: '2026-11-07T09:46:03Z' },
    { bucketId: 'gemini-argon-wtu-weekly', remainingFraction: 0.9, resetTime: '2026-11-10T00:00:00Z' }
  ])
  assert.deepEqual(g.buckets.map((b) => [b.window, b.remainingFraction, b.resetTime]), [
    ['5h', 0.4, '2026-11-07T09:46:03Z'],
    ['weekly', 0.9, '2026-11-10T00:00:00Z']
  ])
  const only = quotaGroup('Gemini Models', [{ bucketId: 'gemini-argon-wtu-weekly', remainingFraction: 0.9 }])
  assert.deepEqual(only.buckets.map((b) => b.window), ['weekly'])
})
