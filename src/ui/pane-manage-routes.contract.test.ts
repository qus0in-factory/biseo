import test from'node:test'
import assert from'node:assert/strict'
import{makeDeps}from'../app/turn-fixture.js'
import{reader}from'../app/turn-data-fixture.js'
import{appOf}from'./route-app-fixture.js'
import{auth}from'./app-data-fixture.js'
import{makePane}from'./pane-manage-fixture.js'
import{makeQueueItem}from'./pane-manage-fixture.js'

{
test('pane manage routes require auth',async()=>{
 const d=makeDeps(reader)
 const app=appOf(d)
 assert.equal((await app.request('/herdr/panes',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({})})).status,401)
 assert.equal((await app.request('/herdr/panes/w:p1',{method:'DELETE'})).status,401)
 assert.equal((await app.request('/herdr/panes/w:p1/rename',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'x'})})).status,401)
})
}
{
test('close rejects busy pane',async()=>{
 const d=makeDeps(reader)
 d.herdr.getPane=async()=>makePane({agent_status:'working'})
 d.herdr.closePane=async()=>{}
 const app=appOf(d)
 const r=await app.request('/herdr/panes/w:p1',{method:'DELETE',headers:auth})
 assert.equal(r.status,409)
})
}
{
test('close rejects inflight pane',async()=>{
 const d=makeDeps(reader)
 d.herdr.getPane=async()=>makePane()
 d.herdr.closePane=async()=>{}
 d.locks.reserve('w:p1','r1')
 const app=appOf(d)
 const r=await app.request('/herdr/panes/w:p1',{method:'DELETE',headers:auth})
 assert.equal(r.status,409)
})
}
{
test('close rejects pending pane',async()=>{
 const d=makeDeps(reader)
 d.herdr.getPane=async()=>makePane()
 d.herdr.closePane=async()=>{}
 d.queue.add(makeQueueItem())
 const app=appOf(d)
 const r=await app.request('/herdr/panes/w:p1',{method:'DELETE',headers:auth})
 assert.equal(r.status,409)
})
}
{
test('close rejects other workspace',async()=>{
 const d=makeDeps(reader)
 d.herdr.getPane=async()=>makePane({workspace_id:'other'})
 d.herdr.closePane=async()=>{}
 const app=appOf(d)
 const r=await app.request('/herdr/panes/w:p1',{method:'DELETE',headers:auth})
 assert.equal(r.status,403)
})
}
{
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
}
