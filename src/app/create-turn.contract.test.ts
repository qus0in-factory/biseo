import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {input,reader,pane}from'./turn-data-fixture.js'
import {makeDeps}from'./turn-fixture.js'
import {input,reader,agent}from'./turn-data-fixture.js'
import {input,reader}from'./turn-data-fixture.js'

{
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
}
{
const spy=()=>{const d=makeDeps(reader);let n=0;d.capture.begin=async()=>{n++;return reader};return{d,n:()=>n}}
test('busy agent and queued pane do not open a reader',async()=>{
 const a=spy(),w={...agent,agent_status:'working'}
 a.d.herdr.listAgents=async()=>[w];a.d.herdr.getAgent=async()=>w
 await createTurn(a.d,input)
 assert.equal(a.n(),0)
 a.d.locks.reserve('w:p1','other')
 a.d.herdr.listAgents=async()=>[agent];a.d.herdr.getAgent=async()=>agent
 await createTurn(a.d,{...input,requestId:'r2'})
 assert.equal(a.n(),0)
 const b=spy()
 b.d.locks.reserve('w:p1','other')
 await createTurn(b.d,input)
 assert.equal(b.n(),0)
})
test('idle send opens exactly one reader',async()=>{
 const a=spy()
 const r=await createTurn(a.d,input)
 assert.equal(a.n(),1)
 if(r.ok)assert.equal(r.reader,reader)
})
}
{
test('failed prepare releases the pane lock and busy panes queue',async()=>{
 const missing=makeDeps(reader)
 missing.herdr.listPanes=async()=>[]
 const a=await createTurn(missing,input)
 assert.equal(a.ok,false)
 assert.equal(missing.locks.has('w:p1'),false)
 const busy=makeDeps(reader)
 busy.herdr.listAgents=async()=>[{pane_id:'w:p1',terminal_id:'term',agent_status:'working',agent:'claude',revision:1}]
 const b=await createTurn(busy,input)
 assert.equal(b.ok,true)
 if(b.ok)assert.equal(b.item.status,'queued')
 assert.equal(busy.locks.has('w:p1'),false)
 const broken=makeDeps(reader)
 broken.herdr.listPanes=async()=>{throw new Error('down')}
 const c=await createTurn(broken,input)
 assert.equal(c.ok,false)
 assert.equal(broken.locks.has('w:p1'),false)
})
}
{
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
}
