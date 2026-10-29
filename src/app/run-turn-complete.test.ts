import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-data-fixture.js'
import {setup}from'./run-fixture.js'
test('completed response is stored',async()=>{
 const s=setup()
 await runTurn(s.d,item,{read:async()=> 'answer'},target)
 const got=s.store.get('r1')
 assert.equal(got?.status,'completed')
 assert.equal(got?.responseText,'answer')
 assert.ok(got?.completedAt)
})
