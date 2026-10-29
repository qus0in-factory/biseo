import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parsePinnedPanes, serializePinnedPanes, MAX_PINNED_PANES } from './pinnedPanes.js'

describe('pinnedPanes parse', () => {
  it('dedups caps', () => {
    assert.deepEqual(parsePinnedPanes('["a","a","b","c"]'), ['a', 'b'])
    assert.equal(serializePinnedPanes(['a']), '["a"]')
    assert.deepEqual(parsePinnedPanes('bad'), [])
  })
  it('max 2', () => assert.equal(MAX_PINNED_PANES, 2))
})
