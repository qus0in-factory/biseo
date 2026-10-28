import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeTurn } from './mergeTurn.js'
import type { TimelineItem } from './timeline.js'

test('mergeTurn updates existing turn or appends new', () => {
  const init: TimelineItem[] = [
    {
      requestId: 'r1',
      workspaceId: 'w1',
      paneId: 'p1',
      targetName: 'T1',
      promptText: 'hi',
      status: 'queued',
      createdAt: '2026-10-28T00:00:00Z',
    },
  ]
  const updated: TimelineItem = {
    ...init[0],
    status: 'completed',
    responseText: 'done text',
  }
  const r1 = mergeTurn(init, updated)
  assert.equal(r1.length, 1)
  assert.equal(r1[0].status, 'completed')
  assert.equal(r1[0].responseText, 'done text')
})
