import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from '../test-util/queue-fixture.js'
import{dispatchQueue}from'../app/dispatch-queue.js'
import{recoverQueue}from'../infra/d1-queue-recover.js'
import{QUEUE_MAX_ATTEMPTS}from'../domain/queue-policy.js'

test('busy or blocked head survives more than thirty readiness checks',async()=>{
 const{db,put}=await queueFixture();await put('a')
 await db.prepare('UPDATE timeline_turns SET created_at=?').bind(new Date().toISOString()).run()
 const q={target:async()=>({terminalId:'generation-1',ready:false}),execute:async()=>false}
 for(let n=0;n<35;n++){
  await db.prepare('UPDATE timeline_turns SET lease_until=0').run()
  await dispatchQueue(db,q,'w','p');await recoverQueue(db)
 }
 a.deepEqual(await db.prepare('SELECT status,queue_attempts FROM timeline_turns').first(),{status:'queued',queue_attempts:0})
})

test('replaced target is never submitted',async()=>{
 const{db,put}=await queueFixture();await put('a')
 let sent=0
 await dispatchQueue(db,{target:async()=>({terminalId:'replacement',ready:true}),execute:async()=>{sent++;return false}},'w','p')
 a.equal(sent,0)
 a.equal((await db.prepare("SELECT error_code FROM timeline_turns WHERE request_id='a'").first())?.error_code,'target_unclear')
})

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

test('uncertain predecessor terminates and immediately dispatches follower, without resend',async()=>{
 const{db,put}=await queueFixture();await put('a');await put('b')
 const sent:string[]=[]
 const q={target:async()=>({terminalId:'generation-1',ready:true}),execute:async(r:any)=>{sent.push(r.requestId);return r.requestId==='b'}}
 await dispatchQueue(db,q,'w','p')
 a.deepEqual(sent,['a','b'])
 a.equal((await db.prepare("SELECT error_code FROM timeline_turns WHERE request_id='a'").first())?.error_code,'delivery_uncertain')
})

test('lookup outages count toward retry limit and release FIFO',async()=>{
 const{db,put}=await queueFixture();await put('a');await put('b')
 const q={target:async()=>{throw Error('offline')},execute:async()=>{throw Error('must not send')}}
 await dispatchQueue(db,q,'w','p')
 a.equal((await db.prepare("SELECT queue_attempts FROM timeline_turns WHERE request_id='a'").first())?.queue_attempts,1)
 await db.prepare("UPDATE timeline_turns SET queue_attempts=?,lease_until=0 WHERE request_id='a'").bind(QUEUE_MAX_ATTEMPTS).run()
 await recoverQueue(db)
 a.equal((await db.prepare("SELECT error_code FROM timeline_turns WHERE request_id='a'").first())?.error_code,'retry_exhausted')
})
