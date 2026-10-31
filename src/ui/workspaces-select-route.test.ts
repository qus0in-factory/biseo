import test from'node:test'
import assert from'node:assert/strict'
import {auth}from'./app-data-fixture.js'
import {makeApp}from'./app-fixture.js'
const app=makeApp()
test('workspace select accepts detected id',async()=>{
 const ok=await app.request('/herdr/workspaces/select',{method:'POST',headers:{...auth,'content-type':'application/json'},body:JSON.stringify({workspaceId:'w'})})
 assert.equal(ok.status,200)
 assert.deepEqual(await ok.json(),{workspaceId:'w',ok:true})
})