import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-data-fixture.js'
import {setup}from'./run-fixture.js'
import{strict as a}from'node:assert'

{
test('timeout releases the pane lock and late capture still completes',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=200
  let n=0
  await runTurn(s.d,item,{read:async()=>{
   n++
   if(n===1)return null
   await new Promise(r=>setTimeout(r,2))
   return'late'
  }},target)
  assert.equal(s.locks.has('w:p1'),false)
  assert.equal(s.store.get('r1')?.status,'timeout')
  await t.mock.timers.tick(2)
  await new Promise(r=>setImmediate(r))
  assert.equal(s.store.get('r1')?.status,'completed')
  assert.equal(s.store.get('r1')?.responseText,'late')
 }finally{t.mock.timers.reset()}
})
}
{
test('transcript read failure becomes capture_unavailable',async()=>{
 const s=setup()
 await runTurn(s.d,item,{read:async()=>{throw new Error('read')}},target)
 const got=s.store.get('r1')
 assert.equal(got?.status,'capture_unavailable')
 assert.equal(got?.errorCode,'response_capture_unavailable')
 assert.equal(s.locks.has('w:p1'),false)
})
}
{
test('session change blocks before prompt',async()=>{
 const s=setup({pane:{...target.pane,terminal_id:'other'}})
 await runTurn(s.d,item,{read:async()=> 'x'},target)
 const got=s.store.get('r1')
 assert.equal(got?.status,'failed')
 assert.equal(got?.errorCode,'agent_session_changed')
 assert.equal(s.calls.prompt,0)
 assert.equal(s.locks.has('w:p1'),false)
})
}
{
test('collector timeout is recorded without retry',async()=>{
 const s=setup()
 s.locks.reserveRequest('r1')
 await runTurn(s.d,item,{read:async()=>null},target)
 const got=s.store.get('r1')
 assert.equal(got?.status,'timeout')
 assert.equal(got?.errorCode,'turn_timeout')
 assert.equal(s.calls.prompt,1)
 assert.equal(s.locks.has('w:p1'),false)
 assert.equal(s.locks.reserveRequest('r1'),true)
})
}
{
test('workspace move immediately before input is rejected',async()=>{
 const{d,calls,store}=setup({pane:{...target.pane,workspace_id:'moved'}})
 await runTurn(d,item,{read:async()=>'ok'},target)
 a.equal(calls.prompt,0)
 a.equal(store.get(item.requestId)?.errorCode,'agent_session_changed')
})
}
