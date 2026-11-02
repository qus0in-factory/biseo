import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeOrder, moveItem, parseOrder, sameOrder, serializeOrder } from './order.js'

test('order parse keeps unique strings and survives bad storage', () => {
  assert.deepEqual(parseOrder('["a","a",2,"b"]'), ['a', 'b'])
  assert.deepEqual(parseOrder('bad'), [])
  assert.equal(serializeOrder(['a']), '["a"]')
})
test('merge keeps saved order and appends new ids', () => {
  assert.deepEqual(mergeOrder(['c', 'a', 'gone'], ['a', 'b', 'c', 'd']), ['c', 'a', 'b', 'd'])
  assert.equal(sameOrder(['a'], ['a']), true)
  assert.equal(sameOrder(['a'], ['b']), false)
})
test('move reorders without mutating and ignores bad indexes', () => {
  const ids = ['a', 'b', 'c']
  assert.deepEqual(moveItem(ids, 0, 2), ['b', 'c', 'a'])
  assert.deepEqual(moveItem(ids, 2, 0), ['c', 'a', 'b'])
  assert.equal(moveItem(ids, 1, 1), ids)
  assert.equal(moveItem(ids, -1, 2), ids)
})
