import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { togglePinnedPane } from './pinnedPanes.js'

describe('pinnedPanes toggle', () => {
  it('max 2', () => {
    let ids: string[] = []
    ids = togglePinnedPane(ids, 'a')
    ids = togglePinnedPane(ids, 'b')
    assert.deepEqual(ids, ['a', 'b'])
    ids = togglePinnedPane(ids, 'c')
    assert.deepEqual(ids, ['a', 'b'])
    ids = togglePinnedPane(ids, 'a')
    assert.deepEqual(ids, ['b'])
  })
})
