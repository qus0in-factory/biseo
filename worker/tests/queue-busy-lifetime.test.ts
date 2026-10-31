import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{dispatchQueue}from'../app/dispatch-queue.js'
import{recoverQueue}from'../infra/d1-queue-recover.js'
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
