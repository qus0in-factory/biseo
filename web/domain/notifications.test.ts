import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { toNotification, notifiable } from './notifications.js'
import type { TimelineItem } from './timeline.js'

const item = (status: TimelineItem['status'], paneId = 'p1'): TimelineItem => ({
  requestId: 'r1',
  workspaceId: 'w',
  paneId,
  targetName: 'pane',
  agentKind: 'claude',
  promptText: 'hi',
  status,
  responseText: 'result text',
  errorCode: null,
  createdAt: '2026-01-01T00:00:00Z',
  seq: 1,
  completedAt: '2026-01-01T00:01:00Z',
})

describe('notifications', () => {
  it('notifiable statuses', () => {
    assert.equal(notifiable('completed'), true)
    assert.equal(notifiable('working'), false)
    assert.equal(notifiable('queued'), false)
  })
  it('toNotification returns null for non-notifiable', () => {
    assert.equal(toNotification(item('working'), 'pane'), null)
  })
  it('toNotification builds item for completed', () => {
    const n = toNotification(item('completed'), 'pane')
    assert.ok(n)
    assert.equal(n?.id, 'r1')
    assert.equal(n?.paneName, 'pane')
    assert.equal(n?.status, 'completed')
    assert.equal(n?.read, false)
    assert.equal(n?.text, 'result text')
  })
  it('filters by pinned panes via caller', () => {
    const pinned = ['p2']
    const it1 = item('completed', 'p1')
    const n = toNotification(it1, 'pane')
    assert.ok(n)
    assert.equal(pinned.includes(it1.paneId), false)
  })
})