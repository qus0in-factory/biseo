import assert from 'node:assert/strict'
import{strict as a}from'node:assert'
import test from 'node:test'
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js'
import { insertRow } from '../test-util/d1-row.js'
import { reconcileTurn } from '../app/reconcile-turn.js'
import { queueFixture } from '../test-util/queue-fixture.js'
import { claimTurn } from '../infra/d1-queue-claim.js'
import { startTurn } from '../infra/d1-queue-start.js'

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

test('timeline completion observed before callback still dispatches follower immediately',async()=>{
 const{db,put}=await queueFixture();await put('a');await put('b')
 const now=Date.now(),r=(await claimTurn(db,'w','p','token',now,120000))!
 await startTurn(db,{id:'a',token:'token',now})
 const sent:string[]=[],q={target:async()=>({terminalId:'generation-1',ready:true}),execute:async(r:any)=>{sent.push(r.requestId);return true}}
 const up={getTurn:async()=>({ok:true,data:{...r,status:'completed'}})} as any
 await reconcileTurn(db,up,{...r,status:'working'},q)
 a.deepEqual(sent,['b'])
})
