import test from'node:test'
import assert from'node:assert/strict'
import {auth}from'./app-fixture-data.test.js'
import {makeApp}from'./app-fixture.test.js'
const app=makeApp()
test('creates an unavailable turn',async()=>{
 const body=JSON.stringify({requestId:'r1',workspaceId:'w',paneId:'w:p1',text:'hi'})
 const res=await app.request('/herdr/turns',{method:'POST',headers:{...auth,'content-type':'application/json'},body})
 assert.equal(res.status,202)
 assert.equal((await res.json() as{status:string}).status,'capture_unavailable')
})
