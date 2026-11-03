import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { isNearBottom } from './scrollHelper.js'
import { itemsKey } from './scrollHelper.js'
import type { TimelineItem } from '../domain/timeline.js'
describe('scrollHelper', () => {
  it('detects near bottom correctly', () => {
    const atBottom = { scrollHeight: 1000, scrollTop: 600, clientHeight: 400 } as HTMLElement
    assert.equal(isNearBottom(atBottom, 64), true)
    const scrolledUp = { scrollHeight: 1000, scrollTop: 400, clientHeight: 400 } as HTMLElement
    assert.equal(isNearBottom(scrolledUp, 64), false)
  })

  it('generates itemsKey tracking status', () => {
    const item: TimelineItem = {
      requestId: 'r1',
      workspaceId: 'w1',
      paneId: 'p1',
      targetName: 'sol',
      promptText: 'hi',
      status: 'working',
      createdAt: '2026-10-29',
    }
    const k1 = itemsKey([item])
    item.status = 'completed'
    const k2 = itemsKey([item])
    assert.equal(k1, '1:r1:working')
    assert.equal(k2, '1:r1:completed')
  })
})
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
