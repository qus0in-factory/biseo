import assert from 'node:assert/strict'
import test from 'node:test'
import { usageRemainingTimePercent } from './usage-remaining-time.js'
import { usageWindowKind } from './usage-remaining-time.js'

const DAY = 86_400_000
const NOW = Date.parse('2026-11-01T00:00:00.000Z')
const at = (days: number) => new Date(NOW + days * DAY).toISOString()
const left = (label: string, startsAt: string | null, resetsAt: string | null) =>
  usageRemainingTimePercent(label, startsAt, resetsAt, NOW)

test('a reported start takes priority over the known length', () => {
  assert.equal(left('w', at(-1), at(1)), 50)
  assert.equal(left('m', at(-10), at(10)), 50)
})

test('missing or unusable reset times do not invent a share', () => {
  assert.equal(left('w', null, null), null)
  assert.equal(left('w', null, 'nope'), null)
  assert.equal(left('w', 'nope', at(3.5)), 50)
  assert.equal(left('w', null, at(-1)), 0)
})
{
const DAY = 86_400_000
const NOW = Date.parse('2026-11-01T00:00:00.000Z')
const at = (days: number) => new Date(NOW + days * DAY).toISOString()
const left = (label: string, startsAt: string | null, resetsAt: string | null) =>
  usageRemainingTimePercent(label, startsAt, resetsAt, NOW)

test('only w and m windows show a remaining time', () => {
  assert.equal(usageWindowKind('w'), 'w')
  assert.equal(usageWindowKind('M'), 'm')
  assert.equal(usageWindowKind('5h'), null)
  assert.equal(usageWindowKind('primary'), null)
  assert.equal(left('5h', null, at(1)), null)
})

test('known w and m lengths give a remaining share', () => {
  assert.equal(left('w', null, at(3.5)), 50)
  assert.equal(left('m', null, at(15)), 50)
  assert.equal(left('w', null, at(7)), 100)
  assert.equal(left('w', null, at(0)), 0)
})
}
