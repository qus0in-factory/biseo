import test from 'node:test'
import assert from 'node:assert/strict'
import { ownSendAdded, scrollAction } from './scrollIntent.js'
import type { TimelineItem } from './timeline.js'

const item = (requestId: string, ownSend = false): TimelineItem => ({
  requestId,
  workspaceId: 'w1',
  paneId: 'p1',
  targetName: 'T1',
  promptText: 'hi',
  status: 'queued',
  createdAt: '2026-10-30T00:00:00Z',
  ownSend,
})

test('detects a newly added own send', () => {
  assert.equal(ownSendAdded([], [item('r1', true)]), true)
  assert.equal(ownSendAdded([item('r1', true)], [item('r1', true)]), false)
  assert.equal(ownSendAdded([], [item('r1', false)]), false)
})

test('own send scrolls to bottom even while the user reads history', () => {
  assert.equal(scrollAction(true, false, true), 'bottom')
  assert.equal(scrollAction(true, false, false), 'bottom')
})

test('incoming messages follow only while the user is at the bottom', () => {
  assert.equal(scrollAction(false, true, true), 'bottom')
  assert.equal(scrollAction(false, false, true), 'jump')
  assert.equal(scrollAction(false, false, false), 'none')
})
