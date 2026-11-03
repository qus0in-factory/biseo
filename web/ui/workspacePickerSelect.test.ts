import test from'node:test'
import assert from'node:assert/strict'
import{runSelection}from'./workspacePickerTestUtil'

test('success applies the response and refreshes the list',async()=>{
 const log:string[]=[]
 assert.deepEqual(await runSelection(async()=>({workspaceId:'w2'}),log),{workspaceId:'w2'})
 assert.deepEqual(log,['loading:true','error:null','current:w2','notice:null','selected:w2','reload','loading:false'])
})

test('stale null is ignored without an error or current change',async()=>{
 const log:string[]=[]
 assert.equal(await runSelection(async()=>null,log),null)
 assert.deepEqual(log,['loading:true','error:null','loading:false'])
})
