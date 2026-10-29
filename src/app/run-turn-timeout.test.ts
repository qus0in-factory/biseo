import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-data-fixture.js'
import {setup}from'./run-fixture.js'
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
