import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
const until=async(f:()=>boolean,t=Date.now()+2000)=>{while(!f()&&Date.now()<t)await new Promise(r=>setTimeout(r,10))}
test('late capture keeps timeout when no response arrives',async()=>{
 const s=setup()
 s.d.timeoutMs=1;s.d.lateCaptureMs=200
 let n=0
 await captureTurn(s.d,item,{read:async()=>{n++;return null}})
 await until(()=>n>=2)
 assert.ok(n>=2)
 assert.equal(s.store.get('r1')?.status,'timeout')
})
