import test from'node:test'
import assert from'node:assert/strict'
import {auth}from'./test-util/app-data-fixture.js'
import {makeApp}from'./test-util/app-fixture.js'
import {createApp}from'./app.js'
import {makeDeps}from'../app/test-util/turn-fixture.js'
import {input,reader,agent}from'../app/test-util/turn-data-fixture.js'

{
const app=makeApp()
test('herdr routes require permission and workspace allowlist',async()=>{
 assert.equal((await app.request('/herdr/workspaces/w/panes')).status,401)
 assert.equal((await app.request('/herdr/workspaces/w/panes',{headers:auth})).status,200)
 assert.equal((await app.request('/herdr/workspaces/x/panes',{headers:auth})).status,403)
})
}
{
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
}
{
test('cancelling the head dispatches the next queued turn',async()=>{
 const d=makeDeps(reader),w={...agent,agent_status:'working'},a={authorization:'Bearer x'}
 d.herdr.listAgents=async()=>[w];d.herdr.getAgent=async()=>w
 const app=createApp({...d,verify:async()=>{},healthStatus:'ok',timeoutMs:1000,graceMs:0}),h={'content-type':'application/json',...a}
 for(const t of ['one','two'])assert.equal((await app.request('/herdr/turns',{method:'POST',headers:h,body:JSON.stringify({...input,requestId:t,text:t})})).status,202)
 d.herdr.listAgents=async()=>[agent];d.herdr.getAgent=async()=>agent
 let got=''
 d.herdr.prompt=async(_p,t)=>{got=t}
 await app.request('/herdr/turns/one',{method:'DELETE',headers:a})
 for(let i=0;i<100&&!got;i++)await new Promise(x=>setTimeout(x,1))
 assert.equal(got,'two')
})
}
{
const auth={authorization:'Bearer x'}
test('DELETE route cancels a queued turn',async()=>{
 const d=makeDeps(reader),work={...agent,agent_status:'working'}
 d.herdr.listAgents=async()=>[work]
 d.herdr.getAgent=async()=>work
 const app=createApp({...d,verify:async()=>{},healthStatus:'ok',timeoutMs:1000,graceMs:0})
 const post=await app.request('/herdr/turns',{method:'POST',headers:{...auth,'content-type':'application/json'},body:JSON.stringify(input)})
 assert.equal(post.status,202)
 const del=await app.request('/herdr/turns/r1',{method:'DELETE',headers:auth})
 assert.equal(del.status,200)
 assert.equal((await del.json()as{status:string}).status,'cancelled')
 const miss=await app.request('/herdr/turns/none',{method:'DELETE',headers:auth})
 assert.equal(miss.status,404)
})
}
{
const app=makeApp({read:async()=>'answer'})
test('reads a created turn and 404s unknown ids',async()=>{
 const body=JSON.stringify({requestId:'r1',workspaceId:'w',paneId:'w:p1',text:'hi'})
 await app.request('/herdr/turns',{method:'POST',headers:{...auth,'content-type':'application/json'},body})
 const one=await app.request('/herdr/turns/r1',{headers:auth})
 assert.equal(one.status,200)
 assert.equal((await one.json() as{requestId:string}).requestId,'r1')
 assert.equal((await app.request('/herdr/turns/none',{headers:auth})).status,404)
})
}
