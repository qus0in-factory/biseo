import test from'node:test'
import assert from'node:assert/strict'
import{captureTurn}from'./capture-turn.js'
import{item}from'./run-data-fixture.js'
import{setup}from'./run-fixture.js'
import type{AgentInfo as A}from'../domain/herdr.js'
test('late capture upgrades timeout to failed when agent is gone',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=200
  let n=0,ag:A|undefined={pane_id:'p1',terminal_id:'t1',agent_status:'working',revision:1}
  s.d.herdr.getAgent=async()=>ag
  await captureTurn(s.d,item,{read:async()=>{
   if(++n===1)return null
   ag=undefined
   await new Promise(r=>setTimeout(r,2))
   return null
  }})
  assert.equal(s.store.get('r1')?.status,'timeout')
  await t.mock.timers.tick(2)
  await new Promise(r=>setImmediate(r))
  assert.equal(s.store.get('r1')?.status,'failed')
  assert.equal(s.store.get('r1')?.errorCode,'no_agent_in_pane')
 }finally{t.mock.timers.reset()}
})
