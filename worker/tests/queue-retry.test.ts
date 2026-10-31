import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{dispatchQueue}from'../app/dispatch-queue.js'
import{recoverQueue}from'../infra/d1-queue-recover.js'
import{QUEUE_MAX_ATTEMPTS}from'../domain/queue-policy.js'
test('busy head parks, reaches retry limit and releases FIFO',async()=>{
 const{db,put}=await queueFixture();await put('a');await put('b')
 const q={target:async()=>({terminalId:'generation-1',ready:false}),execute:async()=>{throw Error('must not send')}}
 await dispatchQueue(db,q,'w','p')
 a.equal((await db.prepare("SELECT queue_attempts FROM timeline_turns WHERE request_id='a'").first())?.queue_attempts,1)
 await db.prepare("UPDATE timeline_turns SET queue_attempts=?,lease_until=0 WHERE request_id='a'").bind(QUEUE_MAX_ATTEMPTS).run()
 await recoverQueue(db)
 a.equal((await db.prepare("SELECT error_code FROM timeline_turns WHERE request_id='a'").first())?.error_code,'retry_exhausted')
})
