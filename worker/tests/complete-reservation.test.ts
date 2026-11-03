import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from '../test-util/queue-fixture.js'
import{claimTurn}from'../infra/d1-queue-claim.js'
import{startTurn}from'../infra/d1-queue-start.js'
import{completeReservation}from'../app/complete-reservation.js'

test('completion dispatches follower without cron; wrong capability does nothing',async()=>{
 const{db,put}=await queueFixture();await put('a');await put('b')
 const now=Date.now(),r=(await claimTurn(db,'w','p','token',now,120000))!
 await startTurn(db,{id:'a',token:'token',now})
 const sent:string[]=[],q={target:async()=>({terminalId:'generation-1',ready:true}),execute:async(r:any)=>{sent.push(r.requestId);return true}}
 const up={getTurn:async()=>({ok:true,data:{...r,status:'completed'}})} as any
 a.equal(await completeReservation(db,up,q,'a','wrong'),false)
 await completeReservation(db,up,q,'a','token')
 a.deepEqual(sent,['b'])
})

test('timeout callback fails predecessor and wakes follower immediately',async()=>{
 const{db,put}=await queueFixture();await put('a');await put('b')
 const now=Date.now(),r=(await claimTurn(db,'w','p','token',now,120000))!
 await startTurn(db,{id:'a',token:'token',now})
 const up={getTurn:async()=>({ok:true,data:{...r,status:'timeout'}})} as any
 const q={target:async()=>({terminalId:'generation-1',ready:true}),execute:async()=>true}
 await completeReservation(db,up,q,'a','token')
 a.deepEqual((await db.prepare('SELECT status FROM timeline_turns ORDER BY seq').all()).results,[{status:'failed'},{status:'working'}])
})
