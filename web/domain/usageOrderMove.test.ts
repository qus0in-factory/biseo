import test from 'node:test'
import assert from 'node:assert/strict'
import { moveUsageId } from './usageOrder.js'

test('moveUsageId moves ids and clamps at ends', () => {
  assert.deepEqual(moveUsageId(['a', 'b', 'c'], 'b', -1), ['b', 'a', 'c'])
  assert.deepEqual(moveUsageId(['a', 'b', 'c'], 'c', 1), ['a', 'b', 'c'])
  assert.deepEqual(moveUsageId(['a', 'b', 'c'], 'a', -1), ['a', 'b', 'c'])
  assert.deepEqual(moveUsageId(['a', 'b'], 'z', 1), ['a', 'b'])
})
