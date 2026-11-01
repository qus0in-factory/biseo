import assert from 'node:assert/strict'
import test from 'node:test'
import { usageTimePercent } from './usage-time-percent.js'

const DAY = 86_400_000
const NOW = Date.parse('2026-11-01T00:00:00.000Z')
const at = (days: number) => new Date(NOW + days * DAY).toISOString()
const pct = (label: string, remaining: boolean, days: number) =>
  usageTimePercent(label, null, at(days), remaining, NOW)

test('remaining and elapsed time add up to 100%', () => {
  assert.equal(pct('w', true, 5.25), 75)
  assert.equal(pct('w', false, 5.25), 25)
  assert.equal(pct('m', true, 3), 10)
  assert.equal(pct('m', false, 3), 90)
})

test('windows without a w or m share keep no percent in either mode', () => {
  assert.equal(pct('5h', true, 0.2), null)
  assert.equal(pct('5h', false, 0.2), null)
})
