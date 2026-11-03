import assert from 'node:assert/strict'
import test from 'node:test'
import { executeCancel } from './cancelAction.js'
import type { TimelineItem } from '../domain/timeline'

test('does not append a late cancel response to a reset timeline', async () => {
  let list: TimelineItem[] = []
  const item: TimelineItem = {
    requestId: 'r1', workspaceId: 'w1', paneId: 'p1', targetName: 'T',
    promptText: 'x', status: 'working', createdAt: '',
  }
  const api: any = {
    cancelTurn: async () => { throw { response: { status: 409 } } },
    getTurn: async () => item,
  }
  await executeCancel(api, 'r1', ((f: any) => { list = f(list) }) as any)
  assert.deepEqual(list, [])
})
