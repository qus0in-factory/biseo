import test from 'node:test'
import assert from 'node:assert/strict'
import type { UsageState } from '../infra/d1-usage-types.js'
import { rowLimitReached } from './usage-row-limit.js'
import { windowSnapshot } from './usage-window.js'

const percent = (used: number, remaining: number) =>
  rowLimitReached(undefined, 'percent', used, 100, remaining)

const rowSnap = (used: number, remaining: number) =>
  windowSnapshot('agy', 'limited', {}, { metricId: 'm', unit: 'percent', used, remaining }, '2026-10-30T00:00:00Z')

const snap = (w: Record<string, unknown>, state: UsageState = 'limited') =>
  windowSnapshot('agy', state, {}, { metricId: 'm', unit: 'percent', ...w }, '2026-10-30T00:00:00Z')

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
    [rowSnap(100, 10), rowSnap(90, 0), rowSnap(99, 1)].map((r) => r.limitReached),
    [true, true, false],
  )
})

test('a row that is fully used is limited', () => {
  assert.equal(snap({ used: 100, remaining: 0 }).limitReached, true)
})

test('a healthy row of a limited provider is not limited', () => {
  assert.equal(snap({ used: 0, remaining: 100 }).limitReached, false)
})

test('an explicit upstream row flag is kept', () => {
  assert.equal(snap({ used: 0, remaining: 100, limitReached: true }).limitReached, true)
})

test('unknown values are not limited', () => {
  assert.equal(snap({ used: null, remaining: null }).limitReached, false)
})
