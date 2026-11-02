import test from'node:test'
import assert from'node:assert/strict'
import app from'../index.js'
import{createTimelineTestEnv}from'./timeline-helpers.js'
import{withFetch}from'./routes-interrupt-fetch-fixture.js'
test('recent pull distinguishes missing history and persisted duplicate',async()=>{
 const{env,cookie}=await createTimelineTestEnv()
 const request=()=>new Request('http://localhost/api/panes/w1T:p1/recent',{method:'POST',headers:{Cookie:cookie,Origin:'http://localhost'}})
 let recent:unknown=null
 await withFetch(async()=>Response.json({recent}),async()=>{
  const run=async()=>await(await app.fetch(request(),env)).json()
  assert.deepEqual(await run(),{state:'empty'})
  recent={key:'test',promptText:'hi',responseText:'done',targetName:'pane',agentKind:'codex'}
  assert.deepEqual(await run(),{state:'imported'})
  assert.deepEqual(await run(),{state:'duplicate'})
 })
})
