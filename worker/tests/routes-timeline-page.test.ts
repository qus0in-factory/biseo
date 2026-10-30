import assert from'node:assert/strict'
import test from'node:test'
import{add,body,makeEnv,page}from'./timeline-page-fixture.js'

test('initial page returns only the pane latest three with a cursor',async()=>{
 const{env,cookie}=await makeEnv()
 for(const id of['r1','r2','r3','r4','r5'])await add(env,id,'w1T:p1')
 await add(env,'x1','w1T:p2')
 const b=await body(await page(env,cookie,'paneId=w1T:p1&limit=3'))
 assert.deepEqual(b.items.map(i=>i.requestId),['r5','r4','r3'])
 assert.equal(b.hasMore,true)
 assert.equal(b.nextBefore,b.items[2].seq)
})
