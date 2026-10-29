import test from'node:test'
import assert from'node:assert/strict'
import{captureTurn}from'./capture-turn.js'
import{item}from'./run-data-fixture.js'
import{setup}from'./run-fixture.js'
import type{AgentInfo as A}from'../domain/herdr.js'
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
