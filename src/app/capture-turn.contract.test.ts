import test from 'node:test'
import assert from 'node:assert/strict'
import { captureTurn } from './capture-turn.js'
import { setup } from './test-util/run-fixture.js'
import { item } from './test-util/run-data-fixture.js'
import type{AgentInfo as A}from'../domain/herdr.js'
import{timeoutCase}from'./test-util/capture-turn-timeout-fixture.js'
import {agent}from'./test-util/turn-data-fixture.js'

{
test('late blocked input keeps its reason', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })
  try {
    const s = setup(), d = { ...s.d, timeoutMs: 1, lateCaptureMs: 200, input: { classify: async () => true } }
    let blocked = false, reads = 0
    d.herdr.getAgent = async () => ({ pane_id: 'p', terminal_id: 't', revision: 1, agent_status: blocked ? 'blocked' : 'working' })
    await captureTurn(d, item, { read: async () => {
      if (++reads === 1) return null
      blocked = true
      await new Promise(r => setTimeout(r, 2))
      return null
    } })
    t.mock.timers.tick(2)
    await new Promise(r => setImmediate(r))
    assert.equal(s.store.get('r1')?.status, 'blocked')
    assert.equal(s.store.get('r1')?.errorCode, 'input_request')
  } finally { t.mock.timers.reset() }
})
}
{
test('chk after generation change does not contaminate previous turn',async()=>{
 const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=100
 const snd={...item,requestId:'r2',seq:2}
 s.store.add(snd)
 let rel=()=>{},gate=new Promise<void>(r=>{rel=r}),calls=0
 const ag=(st:A['agent_status']):A=>({pane_id:'p1',terminal_id:'t1',agent_status:st,revision:1})
 s.d.herdr.getAgent=async()=>{
  calls++
  if(calls===2){await gate;return ag('blocked')}
  return ag('working')
 }
 await captureTurn(s.d,item,{read:async()=>null})
 assert.equal(s.store.get('r1')?.status,'timeout')
 await captureTurn(s.d,snd,{read:async()=>'new'})
 rel()
 await new Promise(r=>setImmediate(r))
 assert.equal(s.store.get('r1')?.status,'timeout')
 assert.equal(s.store.get('r2')?.status,'completed')
})
}
{
test('timeout is shown then upgraded when a late response arrives',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const{s,read,ms}=timeoutCase()
  await captureTurn(s.d,item,{read})
  assert.equal(s.store.get('r1')?.status,'timeout')
  assert.equal(s.store.get('r1')?.errorCode,'turn_timeout')
  assert.ok(ms.length===2&&ms[0]===1&&ms[1]>0&&ms[1]<=200,`first reads late=${ms}`)
  await t.mock.timers.tick(5)
  await new Promise(r=>setImmediate(r))
  assert.equal(s.store.get('r1')?.status,'completed')
  const got=s.store.get('r1')
  assert.equal(got?.responseText,'late')
  assert.equal(got?.errorCode,null)
  assert.ok(ms.length===2&&ms[1]>0&&ms[1]<=200,`late=${ms}`)
 }finally{t.mock.timers.reset()}
})
}
{
test('working after send is collected instead of treated as uncertain',async()=>{
 const s=setup()
 s.d.herdr.getAgent=async()=>({...agent,agent_status:'working'})
 await captureTurn(s.d,item,{read:async()=>'answer'})
 assert.equal(s.store.get('r1')?.status,'completed')
 assert.equal(s.store.get('r1')?.responseText,'answer')
})
}
