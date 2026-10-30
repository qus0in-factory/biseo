import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseUsageBookmarks, serializeUsageBookmarks, toggleUsageBookmark } from './usageBookmarks.js'

describe('usageBookmarks', () => {
  it('parse/serialize', () => {
    assert.deepEqual(parseUsageBookmarks('["a","b"]'), ['a', 'b'])
    assert.deepEqual(parseUsageBookmarks('bad'), [])
    assert.equal(serializeUsageBookmarks(['a']), '["a"]')
  })
  it('toggle', () => {
    assert.deepEqual(toggleUsageBookmark(['a'], 'b'), ['a', 'b'])
    assert.deepEqual(toggleUsageBookmark(['a', 'b'], 'a'), ['b'])
  })
})