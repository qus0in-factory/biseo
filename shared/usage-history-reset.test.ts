import test from 'node:test'
import assert from 'node:assert/strict'
import { historyInterval } from './usage-history-interval.js'
import { historyPoint } from './usage-history-fixture.js'

test('reset changes, decreases and crossing reset time are excluded', () => {
  const a = historyPoint(1, 50, 20), b = historyPoint(2, 60, 25)
  assert.equal(historyInterval(a, { ...b, fiveReset: '2031-01-01' }), null)
  assert.equal(historyInterval(a, { ...b, weekReset: '2031-01-01' }), null)
  assert.equal(historyInterval(a, { ...b, five: 5 }), null)
  assert.equal(historyInterval(a, { ...b, week: 5 }), null)
  assert.equal(historyInterval(a, { ...b, observed: Date.parse(a.fiveReset) }), null)
  assert.equal(historyInterval(a, a), null)
})
