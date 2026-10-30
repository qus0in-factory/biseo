import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeServerTimeline } from './timelineHydrate.js'
import type { TimelineItem } from './timeline-item.js'

const item = (requestId: string, status: TimelineItem['status'], responseText: string | null = null): TimelineItem => ({
  requestId, workspaceId: 'w1', paneId: 'w1:p1', targetName: 'p1', promptText: 'hi',
  status, responseText, createdAt: '2026-10-29T00:00:00Z',
})

test('server hydration replaces an optimistic queued item with the completed result', () => {
  const merged = mergeServerTimeline([item('r1', 'queued')], [item('r1', 'completed', 'done')])
  assert.equal(merged[0].status, 'completed')
  assert.equal(merged[0].responseText, 'done')
})

test('server hydration does not regress a completed item to timeout', () => {
  const merged = mergeServerTimeline([item('r1', 'completed', 'done')], [item('r1', 'timeout')])
  assert.equal(merged[0].status, 'completed')
  assert.equal(merged[0].responseText, 'done')
})
