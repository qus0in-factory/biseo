import test from'node:test'
import assert from'node:assert/strict'
import{createTurn}from'../app/create-turn.js'
import{queueEvent}from'../app/turn-queue-bind.js'
import{input,reader,agent}from'../app/turn-data-fixture.js'
import{makeDeps}from'../app/turn-fixture.js'
import{fakeWatch}from'./herdr-watch-fixture.js'
import{until as wait}from'../test-wait.test-util.js'
import{startHerdrWatch}from'./herdr-watch.js'
test('server watch dispatches without SSE',async()=>{
 const d=makeDeps(reader),w={...agent,agent_status:'working'}
 d.herdr.listAgents=async()=>[w]
 d.herdr.getAgent=async()=>w
 assert.ok((await createTurn(d,input)).ok)
 let p=''
 d.herdr.prompt=async(_,t)=>{p=t}
 const{f,subscribe}=fakeWatch()
 const x=startHerdrWatch({listPanes:async()=>['w:p1'],subscribe,onEvent:e=>queueEvent(d,e)})
 await wait(()=>f.events.length===1)
 d.herdr.listAgents=async()=>[agent]
 d.herdr.getAgent=async()=>agent
 f.events[0]!('pane.agent_status_changed')
 await wait(()=>p==='hi')
 assert.equal(p,'hi')
})
