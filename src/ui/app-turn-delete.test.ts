import test from'node:test'
import assert from'node:assert/strict'
import {createApp}from'./app.js'
import {makeDeps}from'../app/turn-fixture.test.js'
import {input,reader,agent}from'../app/turn-fixture-data.test.js'
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
