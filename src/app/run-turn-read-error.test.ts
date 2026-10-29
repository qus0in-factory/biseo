import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-data-fixture.js'
import {setup}from'./run-fixture.js'
test('transcript read failure becomes capture_unavailable',async()=>{
 const s=setup()
 await runTurn(s.d,item,{read:async()=>{throw new Error('read')}},target)
 const got=s.store.get('r1')
 assert.equal(got?.status,'capture_unavailable')
 assert.equal(got?.errorCode,'response_capture_unavailable')
 assert.equal(s.locks.has('w:p1'),false)
})
