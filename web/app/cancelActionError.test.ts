import test from 'node:test'
import assert from 'node:assert/strict'
import { executeCancel } from './cancelAction'
import type { TimelineItem } from '../domain/timeline'
import r from '../resources.json'

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
