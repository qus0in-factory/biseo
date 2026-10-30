import assert from 'node:assert/strict'
import test from 'node:test'
import { toPinnedNotification } from './pinnedNotification.js'
import type { TimelineItem } from './timeline.js'

const item: TimelineItem = {
  requestId: 'r1',
  workspaceId: 'w',
  paneId: 'p1',
  targetName: 'pane',
  promptText: 'hi',
  status: 'completed',
  responseText: 'done',
  createdAt: '2026-01-01T00:00:00Z',
  seq: 1,
}

test('a result seen in the selected visible chat is not notified', () => {
  const n = toPinnedNotification(item, 'pane', ['p1'], { selectedPaneId: 'p1', visibility: 'visible' })
  assert.equal(n, null)
})

test('another pane or a hidden tab still notifies', () => {
  const other = toPinnedNotification(item, 'pane', ['p1'], { selectedPaneId: 'p2', visibility: 'visible' })
  const hidden = toPinnedNotification(item, 'pane', ['p1'], { selectedPaneId: 'p1', visibility: 'hidden' })
  assert.ok(other)
  assert.ok(hidden)
})
