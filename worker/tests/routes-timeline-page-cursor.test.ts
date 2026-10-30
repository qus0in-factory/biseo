import assert from'node:assert/strict'
import test from'node:test'
import{add,body,makeEnv,page}from'./timeline-page-fixture.js'

test('before cursor continues older and stops at the end',async()=>{
 const{env,cookie}=await makeEnv()
 for(const id of['r1','r2','r3','r4','r5'])await add(env,id,'w1T:p1')
 const first=await body(await page(env,cookie,'paneId=w1T:p1&limit=3'))
 const next=await body(await page(env,cookie,`paneId=w1T:p1&limit=3&before=${first.nextBefore}`))
 assert.deepEqual(next.items.map(i=>i.requestId),['r2','r1'])
 assert.equal(next.hasMore,false)
 assert.equal(next.nextBefore,null)
 const end=await body(await page(env,cookie,`paneId=w1T:p1&limit=3&before=${next.items[1].seq}`))
 assert.deepEqual(end.items,[])
 assert.equal(end.hasMore,false)
})
