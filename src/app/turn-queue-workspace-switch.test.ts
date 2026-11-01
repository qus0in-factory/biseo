import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {dispatchPane}from'./turn-queue-dispatch.js'
import {input,reader,agent}from'./turn-data-fixture.js'
import {makeDeps}from'./turn-fixture.js'
import {until as wait}from'../test-wait.test-util.js'
test('legacy pending turn survives workspace selection changes',async()=>{
 const d=makeDeps(reader) as any
 d.allowedWorkspaceId='w'
 const work={...agent,agent_status:'working'}
 d.herdr.listAgents=async()=>[work]
 d.herdr.getAgent=async()=>work
 const prompts:string[]=[]
 d.herdr.prompt=async()=>{prompts.push('called')}
 const a=await createTurn(d,input)
 assert.ok(a.ok)
 // simulate workspace selection change before dispatch
 d.allowedWorkspaceId='w2'
 await dispatchPane(d,'w:p1')
 await new Promise(r=>setTimeout(r,50))
 assert.equal(prompts.length,0)
 const item=d.store.get('r1')
 assert.equal(item?.status,'queued')
 assert.notEqual(item?.errorCode,'workspace_not_allowed')
})
