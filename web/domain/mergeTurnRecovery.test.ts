import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeTurn } from './mergeTurn'
import type { TimelineItem } from './timeline'

function itm(s: TimelineItem['status'], err: string | null = null): TimelineItem {
  return {
    requestId: 'r1',
    workspaceId: 'w1',
    paneId: 'p1',
    targetName: 'T1',
    promptText: 'hi',
    status: s,
    errorCode: err,
    createdAt: '2026-10-28T00:00:00Z',
  }
}

test('recovers delivery_uncertain to working or completed', () => {
  const cur = [itm('failed', 'delivery_uncertain')]
  assert.equal(mergeTurn(cur, itm('working'))[0].status, 'working')
  assert.equal(mergeTurn(cur, itm('completed'))[0].status, 'completed')

  const other = [itm('failed', 'network_error')]
  assert.equal(mergeTurn(other, itm('working'))[0].status, 'failed')
  assert.equal(mergeTurn(other, itm('completed'))[0].status, 'failed')
})
