import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-data-fixture.js'
import {setup}from'./run-fixture.js'
test('acceptance bound is passed and normal send completes',async()=>{
 const s=setup()
 let seen:number|undefined
 s.d.herdr.prompt=async(_p,_t,_m,ms)=>{seen=ms}
 await runTurn({...s.d,promptAcceptanceMs:8000},item,{read:async()=>'answer'},target)
 assert.equal(seen,8000)
 assert.equal(s.store.get('r1')?.status,'completed')
})
