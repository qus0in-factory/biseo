import{test}from'node:test'
import{strict as a}from'node:assert'
import app from'../index.js'
import{createTimelineTestEnv}from'./timeline-helpers.js'
import{queueFixture}from'./queue-fixture.js'
test('retry retains original workspace despite changed selection',async()=>{
 const{env,cookie}=await createTimelineTestEnv(),{db,put}=await queueFixture()
 await put('old','p','owner','original',' hi ')
 await db.prepare("UPDATE timeline_turns SET status='failed',error_code='target_unclear'").run()
 const f=globalThis.fetch
 globalThis.fetch=async()=>Response.json({terminalId:'new',ready:false})
 try{
  const res=await app.fetch(new Request('http://localhost/api/turns/old/retry',{method:'POST',headers:{Cookie:cookie,Origin:'http://localhost'},body:JSON.stringify({requestId:'new',workspaceId:'original',paneId:'q'})}),{...env,WORKSPACE_CONFIG_SOURCE:'server',BISEO_DB:db})
  a.equal(res.status,202);a.equal((await res.json() as any).promptText,' hi ')
 }finally{globalThis.fetch=f}
})
