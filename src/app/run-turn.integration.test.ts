import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-data-fixture.js'
import {setup}from'./run-fixture.js'
import { pane, agent } from './turn-data-fixture.js'

{
test('stalled prompt fails fast and releases without resend',async()=>{
 const e=Object.assign(new Error('x'),{code:'agent_prompt_stalled'})
 const s=setup({error:e})
 await runTurn({...s.d,promptAcceptanceMs:8000},item,{read:async()=>'answer'},target)
 const got=s.store.get('r1')
 assert.equal(got?.status,'failed')
 assert.equal(got?.errorCode,'prompt_not_accepted')
 assert.equal(s.calls.prompt,1)
 assert.equal(s.locks.has('w:p1'),false)
})
}
{
test('transcript confirmation accepts a stalled prompt',async()=>{
 const e=Object.assign(new Error('x'),{code:'agent_prompt_stalled'})
 const s=setup({error:e})
 let confirmed=0
 const r={read:async()=>'answer',confirm:async()=>{confirmed++;return true}}
 await runTurn({...s.d,promptAcceptanceMs:8000},item,r,target)
 const got=s.store.get('r1')
 assert.equal(got?.status,'completed')
 assert.equal(got?.responseText,'answer')
 assert.equal(confirmed,1)
 assert.equal(s.calls.prompt,1)
})
}
{
test('acceptance bound is passed and normal send completes',async()=>{
 const s=setup()
 let seen:number|undefined
 s.d.herdr.prompt=async(_p,_t,_m,ms)=>{seen=ms}
 await runTurn({...s.d,promptAcceptanceMs:8000},item,{read:async()=>'answer'},target)
 assert.equal(seen,8000)
 assert.equal(s.store.get('r1')?.status,'completed')
})
}
{
test('working state after stall is accepted',async()=>{
 const e=Object.assign(new Error('x'),{code:'agent_prompt_stalled'})
 const s=setup(),status:{v:'idle'|'working'}={v:'idle'}
 let sent=0
 s.d.herdr.getAgent=async()=>({...agent,agent_status:status.v})
 s.d.herdr.prompt=async()=>{sent++;status.v='working';throw e}
 await runTurn({...s.d,promptAcceptanceMs:8000},item,{read:async()=>'answer'},target)
 assert.equal(s.store.get('r1')?.status,'completed')
 assert.equal(sent,1)
})
}
{
test('completed response is stored',async()=>{
 const s=setup()
 await runTurn(s.d,item,{read:async()=> 'answer'},target)
 const got=s.store.get('r1')
 assert.equal(got?.status,'completed')
 assert.equal(got?.responseText,'answer')
 assert.ok(got?.completedAt)
})
}
{
test('blocked recheck records input reason without sending a prompt', async () => {
  const s = setup(), d = { ...s.d, input: { classify: async () => true } }
  d.herdr.getAgent = async () => ({ ...agent, agent_status: 'blocked' })
  await runTurn(d, item, { read: async () => null }, { pane, agent })
  assert.equal(s.calls.prompt, 0)
  assert.equal(s.store.get('r1')?.status, 'blocked')
  assert.equal(s.store.get('r1')?.errorCode, 'input_request')
})
}
