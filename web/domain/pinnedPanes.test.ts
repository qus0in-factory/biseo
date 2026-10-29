import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  parsePinnedPanes,
  serializePinnedPanes,
  prunePinnedPanes,
  togglePinnedPane,
  partitionPanes,
  MAX_PINNED_PANES,
} from './pinnedPanes.js'

describe('pinnedPanes', () => {
  it('parses and serializes', () => {
    assert.deepEqual(parsePinnedPanes('["a","b"]'), ['a', 'b'])
    assert.equal(serializePinnedPanes(['a']), '["a"]')
    assert.deepEqual(parsePinnedPanes('bad'), [])
  })
  it('toggles with max 2', () => {
    let ids: string[] = []
    ids = togglePinnedPane(ids, 'a')
    ids = togglePinnedPane(ids, 'b')
    assert.deepEqual(ids, ['a', 'b'])
    ids = togglePinnedPane(ids, 'c')
    assert.deepEqual(ids, ['a', 'b'])
    ids = togglePinnedPane(ids, 'a')
    assert.deepEqual(ids, ['b'])
  })
  it('prunes missing panes', () => {
    assert.deepEqual(prunePinnedPanes(['a', 'b'], ['b']), ['b'])
  })
  it('partitions without duplicates', () => {
    const panes = [{ paneId: 'a' }, { paneId: 'b' }, { paneId: 'c' }]
    const result = partitionPanes(panes, ['b'])
    assert.deepEqual(result.pinned.map((p) => p.paneId), ['b'])
    assert.deepEqual(result.rest.map((p) => p.paneId), ['a', 'c'])
  })
  it('max pinned is 2', () => {
    assert.equal(MAX_PINNED_PANES, 2)
  })
})
