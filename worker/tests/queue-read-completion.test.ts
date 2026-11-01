import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{claimTurn}from'../infra/d1-queue-claim.js'
import{startTurn}from'../infra/d1-queue-start.js'
import{reconcileTurn}from'../app/reconcile-turn.js'
test('timeline completion observed before callback still dispatches follower immediately',async()=>{
 const{db,put}=await queueFixture();await put('a');await put('b')
 const now=Date.now(),r=(await claimTurn(db,'w','p','token',now,120000))!
 await startTurn(db,{id:'a',token:'token',now})
 const sent:string[]=[],q={target:async()=>({terminalId:'generation-1',ready:true}),execute:async(r:any)=>{sent.push(r.requestId);return true}}
 const up={getTurn:async()=>({ok:true,data:{...r,status:'completed'}})} as any
 await reconcileTurn(db,up,{...r,status:'working'},q)
 a.deepEqual(sent,['b'])
})
