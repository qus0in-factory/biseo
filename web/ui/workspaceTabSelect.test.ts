import test from 'node:test'
import assert from 'node:assert/strict'
import { isWorkspaceSelectionPending } from './workspaceSelectionGuard'
import { chooseWorkspaceTab } from './workspaceTabSelect'
import r from '../resources.json'
const store = () => ({ setLd() {}, setCur() {}, setNote() {}, load() {} })
const api = {} as never

test('one tab click switches through the controller selector and blocks a second', async () => {
 let calls: string[] = []
 let release!: () => void
 const hold = new Promise<void>((resolve) => { release = resolve })
 const select = async (id: string) => { calls.push(id); await hold; return { workspaceId: id } }
 const first = chooseWorkspaceTab(api, select, 'w2', 'w1', store(), () => {})
 assert.equal(await chooseWorkspaceTab(api, select, 'w3', 'w1', store(), () => {}), null)
 assert.deepEqual(calls, ['w2'])
 assert.equal(isWorkspaceSelectionPending(), true)
 release()
 assert.deepEqual(await first, { workspaceId: 'w2' })
 assert.equal(isWorkspaceSelectionPending(), false)
})
{
const store = () => ({ setLd() {}, setCur() {}, setNote() {}, load() {} })
const api = {} as never

test('the current tab is a no-op and failure releases for retry', async () => {
 let calls = 0
 const errors: (string | null)[] = []
 const select = async (id: string) => {
  calls++
  if (calls === 1) throw new Error('offline')
  return { workspaceId: id }
 }
 const choose = () => chooseWorkspaceTab(api, select, 'w2', 'w1', store(), (e) => errors.push(e))
 assert.equal(await chooseWorkspaceTab(api, select, 'w1', 'w1', store(), (e) => errors.push(e)), null)
 assert.equal(calls, 0)
 assert.equal(await choose(), null)
 assert.deepEqual(await choose(), { workspaceId: 'w2' })
 assert.equal(calls, 2)
 assert.deepEqual(errors, [null, r.connection_unavailable, null])
})
}
