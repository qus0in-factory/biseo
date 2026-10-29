import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {input,reader,pane}from'./turn-data-fixture.js'
import {makeDeps}from'./turn-fixture.js'
test('same requestId on another pane is rejected while prepare is in flight',async()=>{
 const d=makeDeps(reader)
 let open!:()=>void
 const gate=new Promise<void>(r=>{open=r})
 let calls=0
 d.herdr.listPanes=async()=>{calls++;await gate;return[pane]}
 const first=createTurn(d,input)
 const second=await createTurn(d,{...input,paneId:'w:p2'})
 assert.equal(second.ok,false)
 if(!second.ok){assert.equal(second.status,409);assert.equal(second.reason,'request_in_flight')}
 assert.equal(calls,1)
 open()
 const r=await first
 assert.equal(r.ok,true)
 assert.equal(d.store.get('r1')?.paneId,'w:p1')
 const later=await createTurn(d,{...input,paneId:'w:p2'})
 assert.equal(later.ok,false)
 if(!later.ok)assert.equal(later.reason,'request_id_payload_mismatch')
})
