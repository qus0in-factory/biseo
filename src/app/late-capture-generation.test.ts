import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-data-fixture.js'
import {setup}from'./run-fixture.js'
import {wait} from '../test-wait.test-util.js'
test('immediate null late reader continues across turn and expires',async()=>{
 const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=100
 const second={...item,requestId:'r2',seq:2}
 s.store.add(second)
 let n=0
 await captureTurn(s.d,item,{read:async()=>{n++;return null}})
 await captureTurn(s.d,second,{read:async()=>'new'})
 await wait(130)
 assert.equal(n,2)
 assert.equal(s.store.get('r1')?.status,'timeout')
 assert.equal(s.store.get('r1')?.errorCode,'turn_timeout')
 assert.equal(s.store.get('r2')?.status,'completed')
})
