import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {dispatchPane}from'./turn-queue-dispatch.js'
import {input,reader,agent}from'./turn-fixture-data.test.js'
import {makeDeps}from'./turn-fixture.test.js'
const wait=async(f:()=>boolean)=>{for(let i=0;i<100&&!f();i++)await new Promise(r=>setTimeout(r,1))}
test('busy POSTs queue FIFO per pane',async()=>{
 const d=makeDeps(reader),work={...agent,agent_status:'working'}
 d.herdr.listAgents=async()=>[work]
 d.herdr.getAgent=async()=>work
 const a=await createTurn(d,input)
 const b=await createTurn(d,{...input,requestId:'r2',text:'two'})
 assert.ok(a.ok&&b.ok)
 assert.ok(!d.locks.has('w:p1'))
 assert.equal(d.queue.peek('w:p1')?.requestId,'r1')
 d.herdr.listAgents=async()=>[agent]
 d.herdr.getAgent=async()=>agent
 const prompts:string[]=[]
 d.herdr.prompt=async(_p,t)=>{prompts.push(t)}
 await dispatchPane(d,'w:p1')
 await wait(()=>prompts.length===2)
 assert.deepEqual(prompts,['hi','two'])
})
