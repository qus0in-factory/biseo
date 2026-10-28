import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {input}from'./turn-fixture-data.test.js'
import {makeDeps}from'./turn-fixture.test.js'
test('unsupported capture records capture_unavailable without sending',async()=>{
 const d=makeDeps(null)
 const r=await createTurn(d,input)
 assert.equal(r.ok,true)
 if(!r.ok)return
 assert.equal(r.item.status,'capture_unavailable')
 assert.equal(r.item.errorCode,'response_capture_unavailable:path_unresolved')
 assert.equal(r.reader,null)
 assert.equal(d.locks.has('w:p1'),false)
})
