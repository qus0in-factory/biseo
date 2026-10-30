import test from 'node:test'
import assert from 'node:assert/strict'
import { planScroll } from './autoScrollPlan.js'
import type { TimelineItem } from '../domain/timeline.js'

const item = (requestId: string, status: TimelineItem['status'] = 'queued', ownSend = false): TimelineItem => ({
  requestId,
  workspaceId: 'w1',
  paneId: 'p1',
  targetName: 'T1',
  promptText: 'hi',
  status,
  createdAt: '2026-10-30T00:00:00Z',
  ownSend,
})

test('an own send scrolls to bottom even while the user reads history', () => {
  const prev = [item('r1')]
  const next = [...prev, item('r2', 'queued', true)]
  assert.equal(planScroll(prev, next, false), 'bottom')
})

test('an incoming message only follows the bottom while the user stays there', () => {
  const prev = [item('r1')]
  const next = [...prev, item('r2')]
  assert.equal(planScroll(prev, next, true), 'bottom')
  assert.equal(planScroll(prev, next, false), 'jump')
})

test('an unchanged list does not move the view', () => {
  const prev = [item('r1')]
  assert.equal(planScroll(prev, prev, false), 'none')
})
