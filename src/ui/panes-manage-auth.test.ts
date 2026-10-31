import test from'node:test'
import assert from'node:assert/strict'
import{makeDeps}from'../app/turn-fixture.js'
import{reader}from'../app/turn-data-fixture.js'
import{appOf}from'./route-app-fixture.js'
import{auth}from'./app-data-fixture.js'
test('pane manage routes require auth',async()=>{
 const d=makeDeps(reader)
 const app=appOf(d)
 assert.equal((await app.request('/herdr/panes',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({})})).status,401)
 assert.equal((await app.request('/herdr/panes/w:p1',{method:'DELETE'})).status,401)
 assert.equal((await app.request('/herdr/panes/w:p1/rename',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'x'})})).status,401)
})
