import test from'node:test'
import assert from'node:assert/strict'
import {auth}from'./app-data-fixture.js'
import {makeApp}from'./app-fixture.js'
const body=JSON.stringify({requestId:'r1',workspaceId:'w',paneId:'w:p1',text:'hi'})
test('creates a queued turn when capture is supported',async()=>{
 const res=await makeApp({read:async()=>'answer'}).request('/herdr/turns',{method:'POST',headers:{...auth,'content-type':'application/json'},body})
 assert.equal(res.status,202)
 assert.equal((await res.json() as{status:string}).status,'queued')
})
test('rejects unsupported capture instead of returning 202',async()=>{
 const res=await makeApp().request('/herdr/turns',{method:'POST',headers:{...auth,'content-type':'application/json'},body})
 assert.equal(res.status,409)
 const j=await res.json() as{error:string;reason:string}
 assert.equal(j.error,'target_not_ready')
 assert.equal(j.reason,'response_capture_unavailable')
})
