import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{runD1Queue}from'../app/run-d1-queue.js'
import{claimTurn}from'../infra/d1-queue-claim.js'
import{startTurn}from'../infra/d1-queue-start.js'
test('restart expires working once and allows its follower without resending',async()=>{
 const{db,put}=await queueFixture();await put('a');await put('b')
 await db.prepare('UPDATE timeline_turns SET created_at=?').bind(new Date().toISOString()).run()
 await claimTurn(db,'w','p','old',0,10)
 await startTurn(db,{id:'a',token:'old',now:1})
 const sent:string[]=[]
 const q={target:async()=>({terminalId:'generation-1',ready:true}),execute:async(r:{requestId:string})=>{sent.push(r.requestId);return true}}
 await runD1Queue(db,q,{getTurn:async()=>({ok:false,status:404,body:{}})} as never)
 a.deepEqual(sent,['b'])
})
