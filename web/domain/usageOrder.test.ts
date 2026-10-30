import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseUsageOrder, resolveUsageIds, serializeUsageOrder } from './usageOrder.js'

describe('usageOrder', () => {
  it('parses saved order and ignores junk', () => {
    assert.deepEqual(parseUsageOrder(null), { order: [], hidden: [] })
    assert.deepEqual(parseUsageOrder('nope'), { order: [], hidden: [] })
    assert.deepEqual(parseUsageOrder('{"order":["b","a"],"hidden":["c"]}'), { order: ['b', 'a'], hidden: ['c'] })
    assert.equal(serializeUsageOrder({ order: ['b'], hidden: [] }), '{"order":["b"],"hidden":[]}')
  })
  it('resolves new ids after stored order', () => {
    assert.deepEqual(resolveUsageIds(['b'], ['a', 'b', 'c']), ['b', 'a', 'c'])
  })
})
