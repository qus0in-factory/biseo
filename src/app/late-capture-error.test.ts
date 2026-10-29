import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
const until=async(f:()=>boolean,t=Date.now()+2000)=>{while(!f()&&Date.now()<t)await new Promise(r=>setTimeout(r,10))}
test('late capture read errors end quietly and keep timeout',async()=>{
 const s=setup()
 s.d.timeoutMs=1;s.d.lateCaptureMs=200
 let n=0
 await captureTurn(s.d,item,{read:async()=>{
  if(++n===1)return null
  throw new Error('late read')
 }})
 await until(()=>n===2)
 await new Promise(r=>setTimeout(r,10))
 assert.equal(s.store.get('r1')?.status,'timeout')
})
