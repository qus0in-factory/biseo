import test from 'node:test'
import assert from 'node:assert/strict'
import { renamePaneAction } from './renamePaneAction'
import { renameActionFixture } from './renameActionFixture'
import r from '../resources.json'
test('rename and refresh failures are explicit and preserve editing for retry', async () => {
 const fail = async () => {throw Error('failed')}
 for (const refreshFails of [true, false]) {
  const {s, events} = renameActionFixture(refreshFails ? fail : undefined)
  await renamePaneAction(s, refreshFails ? async () => {} : fail, 'p1')
  assert.deepEqual(events, [true, null, r.paneRenameFailed, false])
 }
})
test('stale refreshed name is not reported as completed', async () => {
 const {s, events} = renameActionFixture(async () => [{paneId:'p1',name:'old'}])
 await renamePaneAction(s, async () => {}, 'p1')
 assert.deepEqual(events, [true, null, r.paneRenameFailed, false])
})
