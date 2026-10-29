import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
import {wait} from '../test-wait.test-util.js'
test('a new turn on the same pane does not abort previous late capture',async()=>{
 const s=setup()
 s.d.timeoutMs=1;s.d.lateCaptureMs=100
 const second={...item,requestId:'r2',seq:2}
 s.store.add(second)
 let first=true,release:()=>void=()=>{}
 const gate=new Promise<void>(r=>{release=r})
 const oldReader={read:async()=>{
  if(first){first=false;return null}
  await gate
  return'old'
 }}
 await captureTurn(s.d,item,oldReader)
 assert.equal(s.store.get('r1')?.status,'timeout')
 await captureTurn(s.d,second,{read:async()=>'new'})
 release()
 await wait(10)
 assert.equal(s.store.get('r1')?.status,'completed')
 assert.equal(s.store.get('r1')?.responseText,'old')
 assert.equal(s.store.get('r2')?.status,'completed')
})
