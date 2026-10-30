import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseUsageOrder, serializeUsageOrder } from './usageOrder.js'

describe('usageOrder', () => {
  it('parses saved order and drops legacy hidden data', () => {
    assert.deepEqual(parseUsageOrder(null), { order: [] })
    assert.deepEqual(parseUsageOrder('nope'), { order: [] })
    assert.deepEqual(parseUsageOrder('{"order":["b","a"],"hidden":["c"]}'), { order: ['b', 'a'] })
    assert.equal(serializeUsageOrder({ order: ['b'] }), '{"order":["b"]}')
  })
})
