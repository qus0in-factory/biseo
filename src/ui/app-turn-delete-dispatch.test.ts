import test from'node:test'
import assert from'node:assert/strict'
import {createApp}from'./app.js'
import {makeDeps}from'../app/turn-fixture.js'
import {input,reader,agent}from'../app/turn-data-fixture.js'
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
