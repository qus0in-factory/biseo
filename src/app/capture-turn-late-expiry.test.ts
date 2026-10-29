import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
const until=async(f:()=>boolean)=>{for(let i=0;i<50&&!f();i++)await new Promise(r=>setTimeout(r,1))}
test('late capture keeps timeout when no response arrives',async()=>{
 const s=setup()
 s.d.timeoutMs=1;s.d.lateCaptureMs=1
 let n=0
 await captureTurn(s.d,item,{read:async()=>{n++;return null}})
 await until(()=>n>=2)
 assert.ok(n>=2)
 assert.equal(s.store.get('r1')?.status,'timeout')
})
