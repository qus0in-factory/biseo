import test from 'node:test'
import assert from 'node:assert/strict'
import { isWorkspaceSelectionPending } from './workspaceSelectionGuard'
import { chooseWorkspaceTab } from './workspaceTabSelect'

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
