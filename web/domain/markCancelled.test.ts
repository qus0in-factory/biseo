import test from 'node:test'
import assert from 'node:assert/strict'
import { markCancelled } from './markCancelled.js'
import type { TimelineItem } from './timeline.js'

test('markCancelled transitions queued item to cancelled', () => {
  const item: TimelineItem = {
    requestId: 'r1',
    workspaceId: 'w1',
    paneId: 'p1',
    targetName: 'T1',
    promptText: 'hi',
    status: 'queued',
    createdAt: '2026-10-28T00:00:00Z',
  }
  const res = markCancelled([item], 'r1')
  assert.equal(res[0].status, 'cancelled')
})
