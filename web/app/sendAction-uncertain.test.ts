import test from 'node:test'
import assert from 'node:assert/strict'
import { executeSend } from './sendAction.js'

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
