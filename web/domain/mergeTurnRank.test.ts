import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeTurn } from './mergeTurn.js'
import type { TimelineItem } from './timeline.js'

function itm(status: TimelineItem['status'], resp: string | null = null): TimelineItem {
  return {
    requestId: 'r1',
    workspaceId: 'w1',
    paneId: 'p1',
    targetName: 'T1',
    promptText: 'hi',
    status,
    responseText: resp,
    createdAt: '2026-10-28T00:00:00Z',
  }
}

test('mergeTurn prevents regressions', () => {
  const res = mergeTurn([itm('completed', 'done')], itm('queued'))
  assert.equal(res[0].status, 'completed')
  assert.equal(res[0].responseText, 'done')
})
