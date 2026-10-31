import test from'node:test'
import assert from'node:assert/strict'
import{makeDeps}from'../app/turn-fixture.js'
import{reader}from'../app/turn-data-fixture.js'
import{appOf}from'./route-app-fixture.js'
import{auth}from'./app-data-fixture.js'
import{makePane}from'./pane-manage-fixture.js'
test('rename validates name and workspace',async()=>{
 const d=makeDeps(reader)
 d.herdr.getPane=async()=>makePane()
 d.herdr.renamePane=async()=>{}
 d.herdr.renameTab=async()=>{}
 d.herdr.renameAgent=async()=>{}
 const app=appOf(d)
 const bad=await app.request('/herdr/panes/w:p1/rename',{method:'POST',headers:{...auth,'content-type':'application/json'},body:JSON.stringify({name:'bad name!'})})
 assert.equal(bad.status,400)
 const ok=await app.request('/herdr/panes/w:p1/rename',{method:'POST',headers:{...auth,'content-type':'application/json'},body:JSON.stringify({name:'renamed'})})
 assert.equal(ok.status,200)
})
