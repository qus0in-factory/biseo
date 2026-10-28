import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeTurn } from './mergeTurn.js'
import type { TimelineItem } from './timeline.js'

test('mergeTurn prevents regressions to lower status rank', () => {
  const completed: TimelineItem = {
    requestId: 'r1',
    workspaceId: 'w1',
    paneId: 'p1',
    targetName: 'T1',
    promptText: 'hi',
    status: 'completed',
    responseText: 'done text',
    createdAt: '2026-10-28T00:00:00Z',
  }
  const queued: TimelineItem = {
    ...completed,
    status: 'queued',
    responseText: null,
  }
  const res = mergeTurn([completed], queued)
  assert.equal(res[0].status, 'completed')
  assert.equal(res[0].responseText, 'done text')
})
