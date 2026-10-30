import assert from 'node:assert/strict'
import test from 'node:test'
import { executeCancel } from './cancelAction'
import type { TimelineItem } from '../domain/timeline'

const item: TimelineItem = { requestId: 'r1', workspaceId: 'w1', paneId: 'p1', targetName: 'T', promptText: 'x', status: 'queued', createdAt: '' }

test('409 refreshes a started turn and points to interrupt', async () => {
  let list = [item]
  const api: any = { cancelTurn: async () => { throw { response: { status: 409 } } }, getTurn: async () => ({ ...item, status: 'working' }) }
  await executeCancel(api, 'r1', ((f: any) => { list = f(list) }) as any)
  assert.equal(list[0].status, 'working')
  assert.ok(list[0].cancelError?.includes('Esc'))
})
