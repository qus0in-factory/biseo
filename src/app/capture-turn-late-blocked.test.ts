import test from'node:test'
import assert from'node:assert/strict'
import{captureTurn}from'./capture-turn.js'
import{item}from'./run-fixture-data.test.js'
import{setup}from'./run-fixture.test.js'
import type{AgentInfo as A}from'../domain/herdr.js'
test('late capture upgrades timeout to blocked when agent is blocked',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=200
  let n=0,st:A['agent_status']='working'
  s.d.herdr.getAgent=async()=>({pane_id:'p1',terminal_id:'t1',agent_status:st,revision:1})
  await captureTurn(s.d,item,{read:async()=>{
   if(++n===1)return null
   st='blocked'
   await new Promise(r=>setTimeout(r,2))
   return null
  }})
  assert.equal(s.store.get('r1')?.status,'timeout')
  await t.mock.timers.tick(2)
  await new Promise(r=>setImmediate(r))
  assert.equal(s.store.get('r1')?.status,'blocked')
  assert.equal(s.store.get('r1')?.errorCode,'agent_blocked')
 }finally{t.mock.timers.reset()}
})
