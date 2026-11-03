import test from'node:test'
import assert from'node:assert/strict'
import{isWorkspaceSelectionPending}from'./workspaceSelectionGuard'
import{runSelection}from'./workspacePickerTestUtil'

test('resolve and rejection release the guard so retry is allowed',async()=>{
 const log:string[]=[]
 assert.deepEqual(await runSelection(async()=>({workspaceId:'w2'}),log),{workspaceId:'w2'})
 assert.equal(isWorkspaceSelectionPending(),false)
 assert.equal(await runSelection(async()=>{throw new Error('offline')},log),null)
 assert.equal(isWorkspaceSelectionPending(),false)
 assert.deepEqual(await runSelection(async()=>({workspaceId:'w3'}),log),{workspaceId:'w3'})
})
