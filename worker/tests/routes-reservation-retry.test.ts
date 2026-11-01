import{test}from'node:test'
import{strict as a}from'node:assert'
import app from'../index.js'
import{createTimelineTestEnv}from'./timeline-helpers.js'
test('retry path requires owner and Origin even without selected workspace',async()=>{
 const{env,cookie}=await createTimelineTestEnv()
 const url='http://localhost/api/turns/old/retry'
 const send=(headers:Record<string,string>)=>app.fetch(new Request(url,{method:'POST',headers,body:'{}'}),{...env,WORKSPACE_CONFIG_SOURCE:'server'})
 a.equal((await send({Origin:'http://localhost'})).status,401)
 a.equal((await send({Cookie:cookie,Origin:'https://evil.test'})).status,403)
 a.equal((await send({Cookie:cookie,Origin:'http://localhost'})).status,400)
})
