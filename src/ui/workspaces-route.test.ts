import test from'node:test'
import assert from'node:assert/strict'
import {auth}from'./app-data-fixture.js'
import {makeApp}from'./app-fixture.js'
const app=makeApp()
test('workspace routes require auth',async()=>{
 assert.equal((await app.request('/herdr/workspaces')).status,401)
 assert.equal((await app.request('/herdr/workspaces/select',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workspaceId:'w'})})).status,401)
})
test('workspace select rejects invalid and unknown ids',async()=>{
 const bad=await app.request('/herdr/workspaces/select',{method:'POST',headers:{...auth,'content-type':'application/json'},body:JSON.stringify({workspaceId:'nope'})})
 assert.equal(bad.status,403)
 const invalid=await app.request('/herdr/workspaces/select',{method:'POST',headers:{...auth,'content-type':'application/json'},body:JSON.stringify({workspaceId:'bad id'})})
 assert.equal(invalid.status,403)
})
test('workspace select accepts detected id',async()=>{
 const ok=await app.request('/herdr/workspaces/select',{method:'POST',headers:{...auth,'content-type':'application/json'},body:JSON.stringify({workspaceId:'w'})})
 assert.equal(ok.status,200)
 assert.deepEqual(await ok.json(),{workspaceId:'w',ok:true})
})
