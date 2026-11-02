import test from'node:test'
import assert from'node:assert/strict'
import{makeDeps}from'../app/turn-fixture.js'
import{reader}from'../app/turn-data-fixture.js'
import{appOf}from'./route-app-fixture.js'
import{auth}from'./app-data-fixture.js'
test('open validates the template allowlist and accepts valid names',async()=>{
 const d=makeDeps(reader)
 d.herdr.createTab=async()=>({tabId:'t1',paneId:'w:p2'})
 const app=appOf(d)
 const bad=await app.request('/herdr/panes',{method:'POST',headers:{...auth,'content-type':'application/json'},body:JSON.stringify({templateId:'nope'})})
 assert.equal(bad.status,403)
 const named=await app.request('/herdr/panes',{method:'POST',headers:{...auth,'content-type':'application/json'},body:JSON.stringify({name:'opus'})})
 assert.equal(named.status,200)
})
