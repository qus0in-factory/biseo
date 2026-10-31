import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{dispatchQueue}from'../app/dispatch-queue.js'
test('replaced target is never submitted',async()=>{
 const{db,put}=await queueFixture();await put('a')
 let sent=0
 await dispatchQueue(db,{target:async()=>({terminalId:'replacement',ready:true}),execute:async()=>{sent++;return false}},'w','p')
 a.equal(sent,0)
 a.equal((await db.prepare("SELECT error_code FROM timeline_turns WHERE request_id='a'").first())?.error_code,'target_unclear')
})
