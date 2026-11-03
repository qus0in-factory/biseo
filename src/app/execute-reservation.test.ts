import{test}from'node:test'
import{strict as a}from'node:assert'
import assert from 'node:assert/strict'
import{makeDeps}from'./turn-fixture.js'
import{pane,input}from'./turn-data-fixture.js'
import{executeReservation}from'./execute-reservation.js'
test('existing workspace reservation executes after configured workspace switches',async()=>{
 const d=makeDeps({read:async()=>'ok'})
 d.allowedWorkspaceId='new-workspace'
 let sent=0;d.herdr.prompt=async()=>{sent++}
 await executeReservation(d,input,'term')
 await new Promise(r=>setImmediate(r))
 a.equal(sent,1)
 a.equal(d.queue.has(input.paneId),false)
})
test('original workspace reservation executes after selection changes',async()=>{
 const d=makeDeps({read:async()=>'ok'}),sent:string[]=[]
 d.allowedWorkspaceId='other'
 d.herdr.prompt=async(_,text)=>{sent.push(text)}
 await executeReservation(d,input,'term')
 await new Promise(r=>setImmediate(r))
 assert.deepEqual(sent,[input.text])
 assert.equal(d.store.get(input.requestId)?.workspaceId,input.workspaceId)
})
test('workspace switch preserves old reservation, but pre-input replacement rejects',async()=>{
 let calls=0,sent=0
 const d=makeDeps({read:async()=>'ok'})
 d.allowedWorkspaceId='other'
 d.herdr.prompt=async()=>{sent++}
 d.herdr.getPane=async()=>++calls===1?pane:{...pane,terminal_id:'replacement'}
 await executeReservation(d,input,'term')
 await new Promise(r=>setImmediate(r))
 a.equal(sent,0)
 a.equal(d.store.get(input.requestId)?.errorCode,'agent_session_changed')
})
