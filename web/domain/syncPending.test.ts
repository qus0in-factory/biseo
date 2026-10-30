import test from 'node:test'
import assert from 'node:assert/strict'
import { syncPending } from './syncPending.js'
import { makeMockApi } from './syncPending.fixture.js'
import { dummyItems } from './syncPending.data.js'
import type { TimelineItem } from './timeline.js'

test('syncPending fetches queued, working, timeout, and uncertain items', async () => {
  const fetched: string[] = []
  const api = makeMockApi(fetched)
  const updated: TimelineItem[] = []
  const items: TimelineItem[] = [
    ...dummyItems,
    { requestId: 'r4', workspaceId: 'w1', paneId: 'p1', targetName: 'T1', promptText: 'q4', status: 'timeout', createdAt: '2026-10-28T00:00:00Z' },
    { requestId: 'r5', workspaceId: 'w1', paneId: 'p1', targetName: 'T1', promptText: 'q5', status: 'failed', errorCode: 'delivery_uncertain', createdAt: '2026-10-28T00:00:00Z' },
  ]
  await syncPending(api, items, (i) => updated.push(i))

  assert.deepEqual(fetched, ['r1', 'r3', 'r4', 'r5'])
  assert.equal(updated.length, 4)
})
