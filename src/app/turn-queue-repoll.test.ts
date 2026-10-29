import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {dispatchPane}from'./turn-queue-dispatch.js'
import {input,reader,agent,pane}from'./turn-data-fixture.js'
import {makeDeps}from'./turn-fixture.js'
import {until,wait} from '../test-wait.test-util.js'
test('error park repolls in FIFO',async()=>{
 const d=makeDeps(reader),work={...agent,agent_status:'working'}
 d.queueParkMs=30
 d.herdr.listAgents=async()=>[work]
 d.herdr.getAgent=async()=>work
 assert.ok((await createTurn(d,input)).ok)
 assert.ok((await createTurn(d,{...input,requestId:'r2',text:'2'})).ok)
 await wait(20)
 const prompts:string[]=[]
 d.herdr.prompt=async(_p,t)=>{prompts.push(t)}
 d.herdr.listAgents=async()=>[agent]
 d.herdr.getAgent=async()=>agent
 let bad=true
 d.herdr.getPane=async()=>{if(bad)throw 0;return pane}
 await dispatchPane(d,'w:p1')
 assert.equal(d.queue.has('w:p1'),true)
 bad=false
 await until(()=>prompts[1],3000)
 assert.deepEqual(prompts,['hi','2'])
})
