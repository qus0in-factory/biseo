import test from'node:test'
import assert from'node:assert/strict'
import{makeDeps}from'../app/turn-fixture.js'
import{reader}from'../app/turn-data-fixture.js'
import{appOf}from'./route-app-fixture.js'
import{auth}from'./app-data-fixture.js'
import{makePane}from'./pane-manage-fixture.js'
const post={...auth,'content-type':'application/json'}
test('pane names do not block close, rename, or open',async()=>{
 const d=makeDeps(reader)
 d.herdr.getPane=async()=>makePane({label:'sol'})
 d.herdr.closePane=async()=>{}
 d.herdr.createTab=async()=>({tabId:'t1',paneId:'w:p2'})
 d.herdr.renamePane=async()=>{}
 const app=appOf(d)
 assert.equal((await app.request('/herdr/panes/w:p1',{method:'DELETE',headers:auth})).status,200)
 assert.equal((await app.request('/herdr/panes/w:p1/rename',{method:'POST',headers:post,body:JSON.stringify({name:'opus'})})).status,200)
 assert.equal((await app.request('/herdr/panes',{method:'POST',headers:post,body:JSON.stringify({name:'sol'})})).status,200)
})
