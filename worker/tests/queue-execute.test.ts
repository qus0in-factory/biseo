import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{dispatchQueue}from'../app/dispatch-queue.js'
test('concurrent dispatch starts in D1 before input and never resends uncertain input',async()=>{
 const{db,put}=await queueFixture();await put('a')
 let sent=0
 const q={target:async()=>({terminalId:'generation-1',ready:true}),execute:async()=>{
  sent++
  a.equal((await db.prepare("SELECT status FROM timeline_turns WHERE request_id='a'").first())?.status,'working')
  return false
 }}
 await Promise.all([dispatchQueue(db,q,'w','p'),dispatchQueue(db,q,'w','p')])
 a.equal(sent,1)
 a.equal((await db.prepare("SELECT error_code FROM timeline_turns WHERE request_id='a'").first())?.error_code,'delivery_uncertain')
})
