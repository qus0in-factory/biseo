import assert from'node:assert/strict'
import test from'node:test'
import app from'../index.js'
import{createTimelineTestEnv}from'./timeline-helpers.js'
import{insertRow}from'./d1-row.js'
test('worker close rejects non-terminal D1 row',async()=>{
 const{env,cookie}=await createTimelineTestEnv()
 await insertRow(env.BISEO_DB!,'r1','owner','w1T','working')
 const res=await app.fetch(new Request('http://localhost/api/panes/w1T:p1',{method:'DELETE',headers:{Cookie:cookie}}),env)
 assert.equal(res.status,409)
 assert.deepEqual(await res.json(),{error:'pending_reservations'})
})
