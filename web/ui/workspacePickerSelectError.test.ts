import test from'node:test'
import assert from'node:assert/strict'
import{runSelection}from'./workspacePickerTestUtil'

test('failure keeps the current selection and exposes the connection error',async()=>{
 const log:string[]=[]
 assert.equal(await runSelection(async()=>{throw new Error('offline')},log),null)
 assert.deepEqual(log,['loading:true','error:null','error:connection_unavailable','loading:false'])
})
