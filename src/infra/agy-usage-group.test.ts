import test from 'node:test'
import assert from 'node:assert/strict'
import { parseAgyUsage } from './agy-usage-parse.js'

test('parseAgyUsage multi-family metrics Gemini bucket', () => {
  const fixture = {
    groups: [{
      displayName: 'Gemini models',
      buckets: [
        { bucketId: 'gemini-daily', displayName: 'Daily', resetTime: '2026-10-31T00:00:00Z', remainingFraction: 0.95 }
      ]
    }]
  }
  const res = parseAgyUsage(fixture, new Date('2026-10-30T10:00:00Z'))
  assert.equal(res.metrics.length, 1)
  assert.equal(res.metrics[0].id, 'Gemini models:gemini-daily')
  assert.equal(res.metrics[0].label, 'Gemini models - Daily')
  assert.equal(res.metrics[0].used, 5)
  assert.equal(res.metrics[0].remaining, 95)
})

test('parseAgyUsage returns unknown on invalid payload', () => {
  const res = parseAgyUsage({}, new Date())
  assert.equal(res.provider, 'agy')
  assert.equal(res.state, 'unknown')
  assert.deepEqual(res.metrics, [])
})
