import assert from'node:assert/strict'
import test from'node:test'
import{createTimelineTestEnv}from'./timeline-helpers.js'
import{insertRow}from'./d1-row.js'
import{reconcileTurn}from'../app/reconcile-turn.js'
test('repeated 404 fails the turn',async()=>{
 const{env}=await createTimelineTestEnv(),db=env.BISEO_DB!
 await insertRow(db,'r1','owner','w1T','working')
 const rec={requestId:'r1',status:'working',errorCode:null}as any
 const up={getTurn:async()=>({ok:false,status:404,body:{}})}as any
 const first=await reconcileTurn(db,up,rec)
 const second=await reconcileTurn(db,up,first)
 assert.equal(second.status,'failed')
 assert.equal(second.errorCode,'recovery_lost')
 const row:any=await db.prepare('SELECT status,error_code,completed_at,next_check_at FROM timeline_turns WHERE request_id=?').bind('r1').first()
 assert.deepEqual([row.status,row.error_code,row.next_check_at],['failed','recovery_lost',null])
 assert.ok(row.completed_at)
})
