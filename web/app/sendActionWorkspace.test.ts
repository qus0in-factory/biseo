import assert from 'node:assert/strict'
import test from 'node:test'
import { executeSend } from './sendAction.js'

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
