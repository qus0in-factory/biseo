import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
import {agent}from'./turn-fixture-data.test.js'
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
