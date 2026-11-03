import test from 'node:test'
import assert from 'node:assert/strict'
import { captureTurn } from './capture-turn.js'
import { setup } from './run-fixture.js'
import { item } from './run-data-fixture.js'
import type{AgentInfo as A}from'../domain/herdr.js'

{
test('immediate input request is recorded without changing turn status', async () => {
  const s = setup()
  const d = { ...s.d, input: { classify: async () => true } }
  d.herdr.getAgent = async () => ({ pane_id: item.paneId, terminal_id: 't', agent_status: 'blocked', revision: 1 })
  await captureTurn(d, item, { read: async () => null })
  assert.equal(s.store.get(item.requestId)?.status, 'blocked')
  assert.equal(s.store.get(item.requestId)?.errorCode, 'input_request')
})
}
{
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
}
{
test('late capture expiry keeps timeout status',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=200
  let n=0
  await captureTurn(s.d,item,{read:async()=>{n++;return null}})
  await t.mock.timers.tick(300)
  await new Promise(r=>setImmediate(r))
  assert.equal(n,2)
  assert.equal(s.store.get('r1')?.status,'timeout')
  assert.equal(s.store.get('r1')?.errorCode,'late_capture_expired')
 }finally{t.mock.timers.reset()}
})
}
{
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
}
