import { it } from 'node:test'
import assert from 'node:assert/strict'
import { itemsKey } from './scrollHelper.js'
import type { TimelineItem } from '../domain/timeline.js'

const item = (requestId: string, status: TimelineItem['status']): TimelineItem => ({
  requestId,
  workspaceId: 'w1',
  paneId: 'p1',
  targetName: 'sol',
  promptText: 'hi',
  status,
  createdAt: '2026-10-29',
})

it('tracks intermediate status changes', () => {
  const a = item('r1', 'working')
  const b = item('r2', 'completed')
  const k = itemsKey([a, b])
  a.status = 'failed'
  assert.notEqual(itemsKey([a, b]), k)
})
