import test from 'node:test'
import assert from 'node:assert/strict'
import { executeSend } from './sendAction.js'

test('keeps uncertainty when lookup fails without resending', async () => {
  let sends = 0, items: any[] = []
  const api: any = {
    sendMessage: async () => { sends++; throw Error('lost response') },
    getTurn: async () => { throw Error('not found') },
  }
  const pane = { paneId: 'p', name: 'O', status: 'idle', sendable: true, disabledReason: null }
  const set = (f: any) => { items = f(items) }
  await executeSend(api, 'w', pane as any, 'x', set as any, () => {})
  assert.equal(sends, 1)
  assert.equal(items[0].status, 'failed')
  assert.equal(items[0].errorCode, 'delivery_uncertain')
})
test('recovers a lost POST response', async () => {
  let id = '', reads = 0, sends = 0, items: any[] = []
  const api: any = {
    sendMessage: async ({ requestId }: { requestId: string }) => { sends++; id = requestId; throw Error('lost response') },
    getTurn: async (requestId: string) => {
      reads++
      return { requestId, workspaceId: 'w', paneId: 'p', targetName: 'O', promptText: 'x', status: 'completed', createdAt: '' }
    },
  }
  const pane = { paneId: 'p', name: 'O', status: 'idle', sendable: true, disabledReason: null }
  const set = (f: any) => { items = f(items) }
  await executeSend(api, 'w', pane as any, 'x', set as any, () => {})
  assert.equal(sends, 1)
  assert.equal(reads, 1)
  assert.equal(items[0].requestId, id)
  assert.equal(items[0].status, 'completed')
  assert.equal(items[0].errorCode, null)
})
test('drops a late send result after the workspace changes', async () => {
  let active = true
  let items: any[] = []
  const busy: boolean[] = []
  let fail!: (e: Error) => void
  const sent = new Promise<never>((_, reject) => { fail = reject })
  const api: any = {
    sendMessage: () => sent,
    getTurn: async () => { throw Error('stale') },
  }
  const pane = { paneId: 'p', name: 'O', status: 'idle', sendable: true, disabledReason: null }
  const set = (f: any) => { items = f(items) }
  const run = executeSend(api, 'w1', pane as any, 'x', set as any, (b) => busy.push(b), () => active)
  assert.equal(items.length, 1)
  active = false
  items = []
  fail(Error('lost'))
  await run
  assert.deepEqual(items, [])
  assert.deepEqual(busy, [true])
})
