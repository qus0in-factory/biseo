import test from'node:test'
import assert from'node:assert/strict'
import{makeDeps}from'../app/turn-fixture.js'
import{reader}from'../app/turn-data-fixture.js'
import{appOf}from'./route-app-fixture.js'
import{auth}from'./app-data-fixture.js'
import{makePane}from'./pane-manage-fixture.js'
test('close rejects busy pane',async()=>{
 const d=makeDeps(reader)
 d.herdr.getPane=async()=>makePane({agent_status:'working'})
 d.herdr.closePane=async()=>{}
 const app=appOf(d)
 const r=await app.request('/herdr/panes/w:p1',{method:'DELETE',headers:auth})
 assert.equal(r.status,409)
})
