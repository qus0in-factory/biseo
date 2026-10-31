import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{recoverQueue}from'../infra/d1-queue-recover.js'
test('expired working and timeout fail without blocking followers',async()=>{
 const{db,put}=await queueFixture()
 await put('a');await put('b')
 await db.prepare("UPDATE timeline_turns SET status='working',lease_until=10 WHERE request_id='a'").run()
 await recoverQueue(db,11)
 a.deepEqual(await db.prepare("SELECT status,error_code FROM timeline_turns WHERE request_id='a'").first(),{status:'failed',error_code:'delivery_uncertain'})
 await db.prepare("UPDATE timeline_turns SET status='timeout' WHERE request_id='b'").run()
 await recoverQueue(db,12)
 a.equal((await db.prepare("SELECT status FROM timeline_turns WHERE request_id='b'").first())?.status,'failed')
})
