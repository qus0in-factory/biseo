import test from'node:test'
import assert from'node:assert/strict'
import app from'../index.js'
import{createTimelineTestEnv}from'./timeline-helpers.js'
test('recent pulls require owner and same-origin authorization',async()=>{
 const{env,cookie}=await createTimelineTestEnv()
 const request=(headers:Record<string,string>)=>new Request('http://localhost/api/panes/w1T:p1/recent',{method:'POST',headers})
 assert.equal((await app.fetch(request({Origin:'http://localhost'}),env)).status,401)
 assert.equal((await app.fetch(request({Cookie:cookie,Origin:'https://other.example'}),env)).status,403)
})
