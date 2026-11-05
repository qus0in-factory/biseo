import test from'node:test'
import assert from'node:assert/strict'
import {workspaceRequest}from'./test-util/workspace-request.js'
import {readFileSync}from'node:fs'
import {workspaceSandbox}from'./test-util/workspace-sandbox.js'
const selection=workspaceSandbox()
const {makeApp}=await import('./test-util/app-fixture.js')
const app=makeApp()
const select=workspaceRequest(app)
test('workspace routes require auth',async()=>{
 assert.equal((await app.request('/herdr/workspaces')).status,401)
 assert.equal((await select('w',false)).status,401)
})
test('workspace select rejects invalid and unknown ids',async()=>{
 const bad=await select('nope')
 assert.equal(bad.status,403)
 const invalid=await select('bad id')
 assert.equal(invalid.status,403)
})
test('workspace select accepts detected id',async()=>{
 const ok=await select('w')
 assert.equal(ok.status,200)
 assert.deepEqual(await ok.json(),{workspaceId:'w',ok:true})
 assert.deepEqual(JSON.parse(readFileSync(selection,'utf8')),{workspaceId:'w'})
})
