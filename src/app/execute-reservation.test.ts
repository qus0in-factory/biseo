import{test}from'node:test'
import{strict as a}from'node:assert'
import{makeDeps}from'./turn-fixture.js'
import{pane,input}from'./turn-data-fixture.js'
import{executeReservation}from'./execute-reservation.js'
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
