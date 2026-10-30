import test from 'node:test'
import assert from 'node:assert/strict'
import { rowLimitReached } from './usage-row-limit.js'
import { windowSnapshot } from './usage-window.js'

const percent = (used: number, remaining: number) =>
  rowLimitReached(undefined, 'percent', used, 100, remaining)

const snap = (used: number, remaining: number) =>
  windowSnapshot('agy', 'limited', {}, { metricId: 'm', unit: 'percent', used, remaining }, '2026-10-30T00:00:00Z')

test('a fully used row is limited even when remaining is left', () => {
  assert.equal(percent(100, 10), true)
})

test('a row without remaining budget is limited even when used is below the cap', () => {
  assert.equal(percent(90, 0), true)
})

test('a row below both limits is not limited', () => {
  assert.equal(percent(99, 1), false)
})

test('the row snapshot keeps the same boundary decision', () => {
  assert.deepEqual(
    [snap(100, 10), snap(90, 0), snap(99, 1)].map((r) => r.limitReached),
    [true, true, false],
  )
})
