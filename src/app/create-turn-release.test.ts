import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {input,reader}from'./turn-fixture-data.test.js'
import {makeDeps}from'./turn-fixture.test.js'
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
