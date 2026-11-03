import assert from 'node:assert/strict'
import test from 'node:test'
import { executeCancel } from './cancelAction'
import type { TimelineItem } from '../domain/timeline'
import r from '../resources.json'
const item: TimelineItem = { requestId: 'r1', workspaceId: 'w1', paneId: 'p1', targetName: 'T', promptText: 'x', status: 'queued', createdAt: '' }

test('409 refreshes a started turn and points to interrupt', async () => {
  let list = [item]
  const api: any = { cancelTurn: async () => { throw { response: { status: 409 } } }, getTurn: async () => ({ ...item, status: 'working' }) }
  await executeCancel(api, 'r1', ((f: any) => { list = f(list) }) as any)
  assert.equal(list[0].status, 'working')
  assert.ok(list[0].cancelError?.includes('Esc'))
})
{
const res = r as Record<string, string>
const item: TimelineItem = {
  requestId: 'r1',
  workspaceId: 'w1',
  paneId: 'p1',
  targetName: 'T',
  promptText: 'm',
  status: 'queued',
  createdAt: '',
}

test('sets cancelConflict on 409 and cancelFailed on error', async () => {
  let list = [item]
  const err409: any = { cancelTurn: async () => { throw { response: { status: 409 } } } }
  await executeCancel(err409, 'r1', ((f: any) => { list = f(list) }) as any)
  assert.equal(list[0].cancelError, res.cancelConflict)
  assert.ok(res.cancelConflict.includes('Esc'))

  const errNet: any = { cancelTurn: async () => { throw new Error('network') } }
  await executeCancel(errNet, 'r1', ((f: any) => { list = f(list) }) as any)
  assert.equal(list[0].cancelError, res.cancelFailed)
})
}
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
{
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
}
