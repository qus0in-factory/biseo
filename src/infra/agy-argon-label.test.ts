import test from'node:test'
import assert from'node:assert/strict'
import{modelBucketsToGroups}from'./agy-quota-models.js'
import{mergeAgyGroups}from'./agy-usage-merge.js'
import{parseAgyUsage}from'./agy-usage-parse.js'
const at=new Date('2026-10-30T10:00:00Z')
const rst='2026-11-07T00:00:00.000Z'
test('bucketId argon groups with reset',()=>{
 const g=modelBucketsToGroups([{bucketId:'gemini-argon-wtu-weekly',remainingFraction:0,resetTime:rst}])
 assert.equal(g.length,1)
 assert.equal(g[0].displayName,'Gemini 4 Argon')
 assert.deepEqual(g[0].families,['argon'])
 assert.equal(g[0].buckets[0].resetTime,rst)
})
test('summary argon weekly shows label and reset',()=>{
 const s=[{displayName:'Gemini 4 Argon',buckets:[{bucketId:'weekly',remainingFraction:0,resetsAt:rst}]} as any]
 const res=parseAgyUsage({groups:mergeAgyGroups(s,[])},at)
 const m=res.metrics.find((x)=>x.id.startsWith('argon:'))
 assert.ok(m)
 assert.equal(m?.used,100)
 assert.equal(m?.resetsAt,rst)
})
