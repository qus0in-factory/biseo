import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{recoverQueue}from'../infra/d1-queue-recover.js'
test('age limit terminates stale queued and continuously working heads',async()=>{
 const{db,put}=await queueFixture();await put('a');await put('b')
 await db.prepare("UPDATE timeline_turns SET status='working',lease_until=?,updated_at='2026-01-01' WHERE request_id='a'").bind(Date.now()+60000).run()
 await recoverQueue(db)
 const rows=await db.prepare('SELECT error_code FROM timeline_turns ORDER BY seq').all()
 a.deepEqual(rows.results,[{error_code:'delivery_uncertain'},{error_code:'retry_exhausted'}])
})
