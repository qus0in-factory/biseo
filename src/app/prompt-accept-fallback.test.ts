import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
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
