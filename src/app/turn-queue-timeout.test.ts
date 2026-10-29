import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {queueEvent}from'./turn-queue-bind.js'
import {input,agent}from'./turn-fixture-data.test.js'
import {startTimeoutTurn}from'./turn-queue-timeout-fixture.test.js'
const wait=async(f:()=>boolean)=>{for(let i=0;i<100&&!f();i++)await new Promise(r=>setTimeout(r,1))}
test('timeout release waits for herdr idle before the next turn',async()=>{
 const{d,prompts}=await startTimeoutTurn()
 assert.equal(d.store.get('r1')?.status,'timeout')
 const b=await createTurn(d,{...input,requestId:'r2',text:'two'})
 assert.ok(b.ok)
 await new Promise(r=>setTimeout(r,10))
 assert.deepEqual(prompts,['hi'])
 d.herdr.getAgent=async()=>agent
 d.herdr.listAgents=async()=>[agent]
 queueEvent(d,'pane.agent_status_changed')
 await wait(()=>prompts.length===2)
 assert.deepEqual(prompts,['hi','two'])
})
