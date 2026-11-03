import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { orderedRemarkPlugins } from './markdown.js'

describe('orderedRemarkPlugins', () => {
  it('places GFM before the CJK emphasis and strikethrough plugins', () => {
    const gfm = {}
    const cjkFriendly = {}
    const gfmStrikethrough = {}

    assert.deepEqual(
      orderedRemarkPlugins({ gfm, cjkFriendly, gfmStrikethrough }),
      [gfm, cjkFriendly, gfmStrikethrough],
    )
  })
})
