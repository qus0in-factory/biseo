import{test}from'node:test'
import{strict as a}from'node:assert'
import app from'../index.js'
import{createTimelineTestEnv}from'./timeline-helpers.js'
test('completion callback bypasses selection but rejects absent or wrong lease capability',async()=>{
 const{env}=await createTimelineTestEnv()
 const send=(b:unknown)=>app.fetch(new Request('http://localhost/api/queue/completed',{
  method:'POST',body:JSON.stringify(b),
 }),{...env,WORKSPACE_CONFIG_SOURCE:'server'})
 a.equal((await send({requestId:'old'})).status,400)
 a.equal((await send({requestId:'old',token:'wrong'})).status,404)
})
