import test from 'node:test'
import assert from 'node:assert/strict'
import { parseAgyUsage } from './agy-usage-parse.js'

test('parseAgyUsage handles quota buckets with 5h and weekly', () => {
  const fixture = {
    groups: [
      {
        buckets: [
          {
            bucketId: '3p-weekly',
            window: 'weekly',
            resetTime: '2026-11-02T08:21:52Z',
            remainingFraction: 0
          },
          {
            bucketId: '3p-5h',
            window: '5h',
            resetTime: '2026-10-30T07:22:57Z',
            disabled: true,
            remainingFraction: 1
          }
        ]
      }
    ]
  }
  const now = new Date('2026-10-30T10:00:00Z')
  const res = parseAgyUsage(fixture, now)
  assert.equal(res.provider, 'agy')
  assert.equal(res.state, 'limited')
  assert.equal(res.windows.length, 2)

  const primary = res.windows.find(w => w.window === 'primary')
  assert.equal(primary?.usedPercent, 0)
  assert.equal(primary?.limitReached, true)

  const secondary = res.windows.find(w => w.window === 'secondary')
  assert.equal(secondary?.usedPercent, 100)
  assert.equal(secondary?.limitReached, true)
})

test('parseAgyUsage returns unknown on invalid payload', () => {
  const res = parseAgyUsage({}, new Date())
  assert.equal(res.provider, 'agy')
  assert.equal(res.state, 'unknown')
  assert.equal(res.windows.length, 0)
})
