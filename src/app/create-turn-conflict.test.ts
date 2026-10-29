import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {input,reader}from'./turn-fixture-data.test.js'
import {makeDeps}from'./turn-fixture.test.js'
test('payload mismatch is rejected and a busy pane is queued',async()=>{
 const d=makeDeps(reader)
 await createTurn(d,input)
 const bad=await createTurn(d,{...input,text:'other'})
 assert.equal(bad.ok,false)
 if(!bad.ok)assert.equal(bad.reason,'request_id_payload_mismatch')
 d.locks.reserve('w:p1','other')
 const busy=await createTurn(d,{...input,requestId:'r2'})
 assert.equal(busy.ok,true)
 if(busy.ok){assert.equal(busy.item.status,'queued');assert.equal(busy.reader,null)}
 assert.equal(d.locks.has('w:p1'),true)
})
