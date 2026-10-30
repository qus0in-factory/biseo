import test from 'node:test'
import assert from 'node:assert/strict'
import { parseAgyUsage } from './agy-usage-parse.js'

test('parseAgyUsage preserves multi-group buckets in metrics with model family label', () => {
  const fixture = {
    groups: [
      {
        displayName: 'Claude and GPT models',
        description: 'Models: Claude Opus, Claude Sonnet',
        buckets: [
          {
            bucketId: '3p-weekly',
            displayName: 'Weekly Limit Remaining',
            window: 'weekly',
            resetTime: '2026-11-02T08:21:52Z',
            remainingFraction: 0
          },
          {
            bucketId: '3p-5h',
            displayName: 'Five Hour Limit Remaining',
            window: '5h',
            resetTime: '2026-10-30T07:22:57Z',
            remainingFraction: 1
          }
        ]
      },
      {
        displayName: 'Gemini models',
        description: 'Gemini 2.5 Flash, Gemini Pro',
        buckets: [
          {
            bucketId: 'gemini-daily',
            displayName: 'Daily Limit Remaining',
            resetTime: '2026-10-31T00:00:00Z',
            remainingFraction: 0.95
          }
        ]
      }
    ]
  }

  const now = new Date('2026-10-30T10:00:00Z')
  const res = parseAgyUsage(fixture, now)
  assert.equal(res.provider, 'agy')
  assert.equal(res.state, 'limited')
  assert.equal(res.metrics.length, 3)

  const m0 = res.metrics[0]
  assert.equal(m0.id, 'Claude and GPT models:3p-weekly')
  assert.equal(m0.label, 'Claude and GPT models - Weekly Limit Remaining')
  assert.equal(m0.used, 100)
  assert.equal(m0.remaining, 0)
  assert.equal(m0.unit, 'percent')

  const m1 = res.metrics[1]
  assert.equal(m1.id, 'Claude and GPT models:3p-5h')
  assert.equal(m1.used, 0)
  assert.equal(m1.remaining, 100)

  const m2 = res.metrics[2]
  assert.equal(m2.id, 'Gemini models:gemini-daily')
  assert.equal(m2.label, 'Gemini models - Daily Limit Remaining')
  assert.equal(m2.used, 5)
  assert.equal(m2.remaining, 95)
})

test('parseAgyUsage returns unknown on invalid payload', () => {
  const res = parseAgyUsage({}, new Date())
  assert.equal(res.provider, 'agy')
  assert.equal(res.state, 'unknown')
  assert.deepEqual(res.metrics, [])
})
