import test from 'node:test'
import assert from 'node:assert/strict'
import { syncPending } from './syncPending.js'
import { makeMockApi } from './syncPending.fixture.js'
import { dummyItems } from './syncPending.data.js'
import type { TimelineItem } from './timeline.js'

test('syncPending calls getTurn only for queued/working items', async () => {
  const fetched: string[] = []
  const api = makeMockApi(fetched)
  const updated: TimelineItem[] = []
  await syncPending(api, dummyItems, (i) => updated.push(i))

  assert.deepEqual(fetched, ['r1', 'r3'])
  assert.equal(updated.length, 2)
  assert.equal(updated[0].status, 'completed')
  assert.equal(updated[1].status, 'completed')
})
