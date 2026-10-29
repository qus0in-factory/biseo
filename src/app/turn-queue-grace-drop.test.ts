import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {dispatchPane}from'./turn-queue-dispatch.js'
import {input,reader,agent}from'./turn-data-fixture.js'
import {makeDeps}from'./turn-fixture.js'
test('still missing drops after the configured grace',async()=>{
 const d=makeDeps(reader),w={...agent,agent_status:'working'}
 d.herdr.listAgents=async()=>[w];d.herdr.getAgent=async()=>w
 assert.ok((await createTurn(d,input)).ok)
 d.targetGraceMs=10
 d.herdr.getPane=async()=>undefined
 const t=Date.now()
 await dispatchPane(d,'w:p1')
 for(let i=0;i<100&&d.store.get('r1')?.status!=='failed';i++)await new Promise(r=>setTimeout(r,1))
 assert.ok(Date.now()-t>=8)
 assert.equal(d.queue.has('w:p1'),false)
 assert.equal(d.store.get('r1')?.errorCode,'target_not_found')
})
