import{test}from'node:test'
import{strict as a}from'node:assert'
import{makeDeps}from'./turn-fixture.js'
import{input}from'./turn-data-fixture.js'
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
