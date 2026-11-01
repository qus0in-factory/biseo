import test from 'node:test'
import assert from 'node:assert/strict'
import { renamePaneAction } from './renamePaneAction'
import { renameActionFixture } from './renameActionFixture'
import r from '../resources.json'
test('rename stays busy through refreshed list, then confirms and clears editing', async () => {
 let finish!: () => void
 const {s, events} = renameActionFixture(() => new Promise(resolve => {finish = () => resolve([{paneId:'p1',name:'opus2'}])}))
 const old = globalThis.window
 globalThis.window = new EventTarget() as Window & typeof globalThis
 try {
  const task = renamePaneAction(s, async () => {}, 'p1')
  await Promise.resolve()
  assert.deepEqual(events, [true, null])
  finish(); await task
  assert.deepEqual(events, [true, null, ['id', null], ['name', ''], r.paneRenameSuccess, false])
 } finally { globalThis.window = old }
})
