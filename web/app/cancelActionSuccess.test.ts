import test from 'node:test'
import assert from 'node:assert/strict'
import { executeCancel } from './cancelAction'
import type { TimelineItem } from '../domain/timeline'

const item: TimelineItem = {
  requestId: 'r1',
  workspaceId: 'w1',
  paneId: 'p1',
  targetName: 'T',
  promptText: 'm',
  status: 'queued',
  createdAt: '',
}

test('executeCancel cancels queued turn on success', async () => {
  let list = [item]
  const api: any = { cancelTurn: async () => {} }
  await executeCancel(api, 'r1', ((f: any) => { list = f(list) }) as any)
  assert.equal(list[0].status, 'cancelled')
})
