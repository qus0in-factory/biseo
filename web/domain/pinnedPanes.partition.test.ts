import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { prunePinnedPanes, partitionPanes } from './pinnedPanes.js'

describe('pinnedPanes partition', () => {
  it('prunes', () => assert.deepEqual(prunePinnedPanes(['a', 'b'], ['b']), ['b']))
  it('partitions', () => {
    const panes = [{ paneId: 'a' }, { paneId: 'b' }, { paneId: 'c' }]
    const r = partitionPanes(panes, ['b'])
    assert.deepEqual(r.pinned.map((p) => p.paneId), ['b'])
    assert.deepEqual(r.rest.map((p) => p.paneId), ['a', 'c'])
  })
})
