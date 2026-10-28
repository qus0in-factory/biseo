import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {input,reader}from'./turn-fixture-data.test.js'
import {makeDeps}from'./turn-fixture.test.js'
test('supported capture queues and locks the pane',async()=>{
 const d=makeDeps(reader)
 const r=await createTurn(d,input)
 assert.equal(r.ok,true)
 if(!r.ok)return
 assert.equal(r.item.status,'queued')
 assert.equal(r.reader,reader)
 assert.equal(d.locks.has('w:p1'),true)
 const again=await createTurn(d,input)
 assert.equal(again.ok,true)
 if(again.ok)assert.equal(again.created,false)
})
