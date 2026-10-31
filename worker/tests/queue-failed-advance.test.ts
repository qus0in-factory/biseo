import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{dispatchQueue}from'../app/dispatch-queue.js'
test('uncertain predecessor terminates and immediately dispatches follower, without resend',async()=>{
 const{db,put}=await queueFixture();await put('a');await put('b')
 const sent:string[]=[]
 const q={target:async()=>({terminalId:'generation-1',ready:true}),execute:async(r:any)=>{sent.push(r.requestId);return r.requestId==='b'}}
 await dispatchQueue(db,q,'w','p')
 a.deepEqual(sent,['a','b'])
 a.equal((await db.prepare("SELECT error_code FROM timeline_turns WHERE request_id='a'").first())?.error_code,'delivery_uncertain')
})
