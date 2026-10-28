import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {input,reader}from'./turn-fixture-data.test.js'
import {makeDeps}from'./turn-fixture.test.js'
test('unsupported capture is rejected without storing or locking',async()=>{
 const d=makeDeps(null)
 const r=await createTurn(d,input)
 assert.equal(r.ok,false)
 if(!r.ok){assert.equal(r.status,409);assert.equal(r.error,'target_not_ready');assert.equal(r.reason,'response_capture_unavailable')}
 assert.equal(d.store.get('r1'),undefined)
 assert.equal(d.locks.has('w:p1'),false)
 d.capture.begin=async()=>reader
 const retry=await createTurn(d,input)
 assert.equal(retry.ok,true)
})
