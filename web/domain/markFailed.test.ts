import test from 'node:test'
import assert from 'node:assert/strict'
import { markFailed } from './markFailed.js'
import type { TimelineItem } from './timeline.js'

test('markFailed flags matching request as delivery_uncertain', () => {
  const list: TimelineItem[] = [
    {
      requestId: 'r1',
      workspaceId: 'w1',
      paneId: 'p1',
      targetName: 'T1',
      promptText: 'q',
      status: 'queued',
      createdAt: '2026-10-28T00:00:00Z',
    },
  ]
  const r = markFailed(list, 'r1')
  assert.equal(r[0].status, 'failed')
  assert.equal(r[0].errorCode, 'delivery_uncertain')
})

test('late POST failure preserves an already completed SSE response', () => {
  const done: TimelineItem = { requestId: 'r2', workspaceId: 'w1', paneId: 'p1', targetName: 'a', promptText: 'q', status: 'completed', responseText: 'ok', createdAt: '2026-10-28' }
  assert.equal(markFailed([done], 'r2')[0], done)
})
