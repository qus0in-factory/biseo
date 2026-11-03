import test from 'node:test'
import assert from 'node:assert/strict'
import { parseAgyUsage } from './agy-usage-parse.js'

test('parseAgyUsage multi-family Claude 3p buckets', () => {
  const fixture = {
    groups: [{
      displayName: 'Claude and GPT models',
      families: ['claude', 'gpt'],
      buckets: [
        { bucketId: '3p-weekly', window: 'weekly', remainingFraction: 0 },
        { bucketId: '3p-5h', window: '5h', remainingFraction: 1 }
      ]
    }]
  }
  const res = parseAgyUsage(fixture, new Date('2026-10-30T10:00:00Z'))
  assert.equal(res.provider, 'agy')
  assert.equal(res.state, 'limited')
  assert.equal(res.metrics.length, 2)
  assert.equal(res.metrics[0].id, 'claude-gpt:Claude and GPT models:3p-weekly')
  assert.equal(res.metrics[0].used, 100)
  assert.equal(res.metrics[0].remaining, 0)
  assert.equal(res.metrics[1].id, 'claude-gpt:Claude and GPT models:3p-5h')
  assert.equal(res.metrics[1].used, 0)
})

test('parseAgyUsage multi-family metrics Gemini bucket', () => {
  const fixture = {
    groups: [{
      displayName: 'Gemini models',
      families: ['gemini'],
      buckets: [
        { bucketId: 'gemini-daily', displayName: 'Daily', resetTime: '2026-10-31T00:00:00Z', remainingFraction: 0.95 }
      ]
    }]
  }
  const res = parseAgyUsage(fixture, new Date('2026-10-30T10:00:00Z'))
  assert.equal(res.metrics.length, 1)
  assert.equal(res.metrics[0].id, 'gemini:Gemini models:gemini-daily')
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
