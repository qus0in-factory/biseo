import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
const wait=(ms:number)=>new Promise(r=>setTimeout(r,ms))
test('immediate null late reader stops on pane generation change',async()=>{
 const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=100
 const second={...item,requestId:'r2',seq:2}
 s.store.add(second)
 let n=0
 await captureTurn(s.d,item,{read:async()=>{n++;return null}})
 const before=n
 await captureTurn(s.d,second,{read:async()=>'new'})
 await wait(130)
 assert.equal(n,before)
 assert.equal(s.store.get('r1')?.status,'timeout')
 assert.equal(s.store.get('r2')?.status,'completed')
})
