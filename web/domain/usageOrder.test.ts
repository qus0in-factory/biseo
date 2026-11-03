import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { parseUsageOrder } from './usageOrder.js'
import { serializeUsageOrder } from './usageOrder.js'

describe('usageOrder', () => {
  it('parses saved order and drops legacy hidden data', () => {
    assert.deepEqual(parseUsageOrder(null), { order: [] })
    assert.deepEqual(parseUsageOrder('nope'), { order: [] })
    assert.deepEqual(parseUsageOrder('{"order":["b","a"],"hidden":["c"]}'), { order: ['b', 'a'] })
    assert.equal(serializeUsageOrder({ order: ['b'] }), '{"order":["b"]}')
  })
})
