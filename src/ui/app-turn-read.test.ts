import test from'node:test'
import assert from'node:assert/strict'
import {auth}from'./app-fixture-data.test.js'
import {makeApp}from'./app-fixture.test.js'
const app=makeApp()
test('reads a created turn and 404s unknown ids',async()=>{
 const body=JSON.stringify({requestId:'r1',workspaceId:'w',paneId:'w:p1',text:'hi'})
 await app.request('/herdr/turns',{method:'POST',headers:{...auth,'content-type':'application/json'},body})
 const one=await app.request('/herdr/turns/r1',{headers:auth})
 assert.equal(one.status,200)
 assert.equal((await one.json() as{status:string}).status,'capture_unavailable')
 assert.equal((await app.request('/herdr/turns/none',{headers:auth})).status,404)
})
