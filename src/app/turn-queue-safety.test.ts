import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {queueEvent}from'./turn-queue-bind.js'
import {input,reader,agent}from'./turn-data-fixture.js'
import {makeDeps}from'./turn-fixture.js'
import {until as wait} from '../test-wait.test-util.js'
test('lock release alone does not start while herdr is working',async()=>{
 const d=makeDeps(reader),work={...agent,agent_status:'working'}
 d.herdr.listAgents=async()=>[work]
 d.herdr.getAgent=async()=>work
 const a=await createTurn(d,input)
 assert.equal(a.ok,true)
 let prompts=0
 d.herdr.prompt=async()=>{prompts++}
 d.locks.reserve('w:p1','other')
 d.locks.release('w:p1','other')
 await new Promise(r=>setTimeout(r,10))
 assert.equal(prompts,0)
 assert.equal(d.queue.has('w:p1'),true)
 d.herdr.listAgents=async()=>[agent]
 d.herdr.getAgent=async()=>agent
 queueEvent(d,'pane.agent_status_changed')
 await wait(()=>prompts===1)
 assert.equal(prompts,1)
})
