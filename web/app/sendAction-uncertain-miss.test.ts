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
