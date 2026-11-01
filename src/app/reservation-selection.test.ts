import test from'node:test'
import assert from'node:assert/strict'
import{makeDeps}from'./turn-fixture.js'
import{input}from'./turn-data-fixture.js'
import{executeReservation}from'./execute-reservation.js'
test('original workspace reservation executes after selection changes',async()=>{
 const d=makeDeps({read:async()=>'ok'}),sent:string[]=[]
 d.allowedWorkspaceId='other'
 d.herdr.prompt=async(_,text)=>{sent.push(text)}
 await executeReservation(d,input,'term')
 await new Promise(r=>setImmediate(r))
 assert.deepEqual(sent,[input.text])
 assert.equal(d.store.get(input.requestId)?.workspaceId,input.workspaceId)
})
