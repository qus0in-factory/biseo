import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{claimTurn}from'../infra/d1-queue-claim.js'
import{startTurn}from'../infra/d1-queue-start.js'
import{recoverQueue}from'../infra/d1-queue-recover.js'
import{applyQueueResult}from'../infra/d1-queue-result.js'
test('late completion cannot resurrect expired working',async()=>{
 const{db,put}=await queueFixture();await put('a')
 const r=(await claimTurn(db,'w','p','token',0,10))!
 await startTurn(db,{id:'a',token:'token',now:1})
 await recoverQueue(db,11)
 await applyQueueResult(db,r,'token',{...r,status:'completed',seq:1})
 a.equal((await db.prepare('SELECT error_code FROM timeline_turns').first())?.error_code,'delivery_uncertain')
})
