import test from 'node:test'
import assert from 'node:assert/strict'
import { historyRatio } from './usage-history-ratio.js'
import { historyPoint } from './usage-history-fixture.js'

test('ratio uses sums of matching increases, not average ratios', () => {
  const result = historyRatio([historyPoint(1, 10, 1), historyPoint(2, 20, 3), historyPoint(3, 50, 6)], 2)
  assert.deepEqual(result, { ratio: 0.125, samples: 2, from: 1, to: 3 })
})
test('insufficient and idle samples do not invent a ratio', () => {
  assert.equal(historyRatio([], 2).ratio, null)
  assert.equal(historyRatio([historyPoint(1, 10, 1), historyPoint(2, 20, 2)], 2).ratio, null)
  assert.equal(historyRatio([historyPoint(1, 10, 1), historyPoint(2, 10, 1)], 1).samples, 0)
})
