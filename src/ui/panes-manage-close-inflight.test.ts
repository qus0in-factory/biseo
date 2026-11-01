import test from'node:test'
import assert from'node:assert/strict'
import{makeDeps}from'../app/turn-fixture.js'
import{reader}from'../app/turn-data-fixture.js'
import{appOf}from'./route-app-fixture.js'
import{auth}from'./app-data-fixture.js'
import{makePane}from'./pane-manage-fixture.js'
test('close rejects inflight pane',async()=>{
 const d=makeDeps(reader)
 d.herdr.getPane=async()=>makePane()
 d.herdr.closePane=async()=>{}
 d.locks.reserve('w:p1','r1')
 const app=appOf(d)
 const r=await app.request('/herdr/panes/w:p1',{method:'DELETE',headers:auth})
 assert.equal(r.status,409)
})
