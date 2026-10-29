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

test('mergeTurn handles late completed update', () => {
  const late = mergeTurn([itm('timeout')], itm('completed', 'ok'))
  assert.equal(late[0].status, 'completed')

  const noReg = mergeTurn([itm('completed', 'ok')], itm('timeout'))
  assert.equal(noReg[0].status, 'completed')
})

test('mergeTurn handles cancel from queued', () => {
  const cancel = mergeTurn([itm('queued')], itm('cancelled'))
  assert.equal(cancel[0].status, 'cancelled')
})
