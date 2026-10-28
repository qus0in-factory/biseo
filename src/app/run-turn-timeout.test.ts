import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
test('timeout is recorded without retry',async()=>{
 const s=setup({error:{code:'timeout'}})
 s.locks.reserveRequest('r1')
 await runTurn(s.d,item,{read:async()=> 'x'},target)
 const got=s.store.get('r1')
 assert.equal(got?.status,'timeout')
 assert.equal(got?.errorCode,'turn_timeout')
 assert.equal(s.calls.prompt,1)
 assert.equal(s.locks.has('w:p1'),false)
 assert.equal(s.locks.reserveRequest('r1'),true)
})
