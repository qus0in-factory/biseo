import test from 'node:test'
import assert from 'node:assert/strict'
import { createTurn } from './create-turn.js'
import { runQueue } from './turn-queue-run.js'
import { makeDeps } from './test-util/turn-fixture.js'
import { agent, input, reader } from './test-util/turn-data-fixture.js'
import {dispatchPane}from'./turn-queue-dispatch.js'
import{transientLoss}from'./turn-queue-grace-transient.js'
import{cancelDuringGrace}from'./turn-queue-grace-cancel-case.js'
import{dropAfterGrace}from'./turn-queue-grace-drop-case.js'
import {until,wait} from '../test-util/test-wait.test-util.js'

{
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
}

{

test('queue dispatch cannot send while a done pane is still capturing', async () => {
  const d = makeDeps(reader)
  d.herdr.listAgents = async () => [{ ...agent, agent_status: 'done' }]
  d.locks.reserve(input.paneId, 'capturing')
  await createTurn(d, input)
  let calls = 0
  d.capture.begin = async () => { calls++; return reader }
  d.herdr.prompt = async () => { calls++ }
  await runQueue(d, input.paneId, () => {})
  assert.equal(calls, 0)
  assert.equal(d.queue.peek(input.paneId)?.requestId, input.requestId)
  assert.equal(d.store.get(input.requestId)?.status, 'queued')
})
}
{
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
 await until(()=>prompts.length===2)
 assert.deepEqual(prompts,['hi','two'])
})
}
{
const cases=[
 ['target_not_found waits for a transient pane loss',transientLoss],
 ['cancel during target grace does not start the removed turn',cancelDuringGrace],
 ['still missing drops after the configured grace',dropAfterGrace],
]as const
for(const[name,fn]of cases)test(name,fn)
}
