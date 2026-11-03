import test from 'node:test'
import assert from 'node:assert/strict'
import { parseUsageHidden } from './usageHidden.js'
import { serializeUsageHidden } from './usageHidden.js'
import { toggleUsageHidden } from './usageHidden.js'

test('usage hidden ids parse, deduplicate, serialize and toggle', () => {
  assert.deepEqual(parseUsageHidden('["a","b","a"]'), ['a', 'b'])
  assert.deepEqual(parseUsageHidden('bad'), [])
  assert.deepEqual(parseUsageHidden(null), [])
  assert.equal(serializeUsageHidden(['b']), '["b"]')
  assert.deepEqual(toggleUsageHidden(['a'], 'b'), ['a', 'b'])
  assert.deepEqual(toggleUsageHidden(['a', 'b'], 'a'), ['b'])
})
