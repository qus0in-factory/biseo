import test from 'node:test'
import assert from 'node:assert/strict'
import { parseAgyUsage } from './agy-usage-parse.js'

test('parseAgyUsage multi-family metrics Claude 3p buckets', () => {
  const fixture = {
    groups: [{
      displayName: 'Claude and GPT models',
      buckets: [
        { bucketId: '3p-weekly', displayName: 'Weekly', window: 'weekly', resetTime: '2026-11-02T08:21:52Z', remainingFraction: 0 },
        { bucketId: '3p-5h', displayName: '5h', window: '5h', resetTime: '2026-10-30T07:22:57Z', remainingFraction: 1 }
      ]
    }]
  }
  const res = parseAgyUsage(fixture, new Date('2026-10-30T10:00:00Z'))
  assert.equal(res.provider, 'agy')
  assert.equal(res.state, 'limited')
  assert.equal(res.metrics.length, 2)
  assert.equal(res.metrics[0].id, 'Claude and GPT models:3p-weekly')
  assert.equal(res.metrics[0].used, 100)
  assert.equal(res.metrics[0].remaining, 0)
  assert.equal(res.metrics[1].id, 'Claude and GPT models:3p-5h')
  assert.equal(res.metrics[1].used, 0)
})
