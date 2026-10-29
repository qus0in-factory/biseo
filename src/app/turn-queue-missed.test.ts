import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {dispatchPane}from'./turn-queue-dispatch.js'
import {input,reader,agent}from'./turn-data-fixture.js'
import {makeDeps}from'./turn-fixture.js'
import {until,wait} from '../test-wait.test-util.js'
test('busy park recovers without watch event',async()=>{
 const d=makeDeps(reader),work={...agent,agent_status:'working'}
 d.queueParkMs=30
 d.herdr.listAgents=async()=>[work]
 d.herdr.getAgent=async()=>work
 assert.ok((await createTurn(d,input)).ok)
 await wait(20)
 let prompt=''
 d.herdr.prompt=async(_p,t)=>{prompt=t}
 await dispatchPane(d,'w:p1')
 assert.equal(d.queue.has('w:p1'),true)
 d.herdr.listAgents=async()=>[agent]
 d.herdr.getAgent=async()=>agent
 await until(()=>prompt==='hi',3000)
 assert.equal(prompt,'hi')
})
