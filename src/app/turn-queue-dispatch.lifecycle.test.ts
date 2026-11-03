import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {dispatchPane}from'./turn-queue-dispatch.js'
import {input,reader,agent,pane}from'./test-util/turn-data-fixture.js'
import {makeDeps}from'./test-util/turn-fixture.js'
import {until,wait} from '../test-util/test-wait.test-util.js'
import {queueEvent}from'./turn-queue-bind.js'
import {startTimeoutTurn}from'./test-util/turn-queue-timeout-fixture.js'

{
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
}
{
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
 await until(()=>prompts===1)
 assert.equal(prompts,1)
})
}
{
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
 await until(()=>prompts.length===2)
 assert.deepEqual(prompts,['hi','two'])
})
}
{
test('legacy pending turn survives workspace selection changes',async()=>{
 const d=makeDeps(reader) as any
 d.allowedWorkspaceId='w'
 const work={...agent,agent_status:'working'}
 d.herdr.listAgents=async()=>[work]
 d.herdr.getAgent=async()=>work
 const prompts:string[]=[]
 d.herdr.prompt=async()=>{prompts.push('called')}
 const a=await createTurn(d,input)
 assert.ok(a.ok)
 // simulate workspace selection change before dispatch
 d.allowedWorkspaceId='w2'
 await dispatchPane(d,'w:p1')
 await new Promise(r=>setTimeout(r,50))
 assert.equal(prompts.length,0)
 const item=d.store.get('r1')
 assert.equal(item?.status,'queued')
 assert.notEqual(item?.errorCode,'workspace_not_allowed')
})
}
