import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-data-fixture.js'
import {setup}from'./run-fixture.js'
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
