import assert from'node:assert/strict'
import{createTurn,dispatchPane,input,reader,agent,makeDeps}from'./turn-queue-grace-fixture.js'
export const dropAfterGrace=async()=>{
 const d=makeDeps(reader),w={...agent,agent_status:'working'as const}
 d.herdr.listAgents=async()=>[w]
 d.herdr.getAgent=async()=>w
 assert.ok((await createTurn(d,input)).ok)
 d.targetGraceMs=10
 d.herdr.getPane=async()=>undefined
 const t=Date.now()
 await dispatchPane(d,'w:p1')
 for(let i=0;i<100&&d.store.get('r1')?.status!=='failed';i++)await new Promise(r=>setTimeout(r,1))
 assert.ok(Date.now()-t>=8)
 assert.equal(d.queue.has('w:p1'),false)
 assert.equal(d.store.get('r1')?.errorCode,'target_not_found')
}
