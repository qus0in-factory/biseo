import assert from'node:assert/strict'
import test from'node:test'
import{mergeServerTimeline}from'./timelineHydrate.js'
import type{TimelineItem}from'./timeline-item.js'
const it=(id:string,at:string,seq=0):TimelineItem=>({requestId:id,workspaceId:'w1',paneId:'w1:p1',targetName:'p1',promptText:'hi',status:'completed',createdAt:at,seq})
const ids=(xs:TimelineItem[])=>xs.map(x=>x.requestId)
const at=(n:number)=>`2026-10-29T00:00:0${n}Z`
test('same createdAt is ordered by seq',()=>{
 const t=at(1)
 const srv=[it('r2',t,2),it('r1',t,1)]
 assert.deepEqual(ids(mergeServerTimeline([],srv)),['r1','r2'])
})
test('updating the same requestId keeps its position',()=>{
 const q=(id:string,at:string):TimelineItem=>({...it(id,at),status:'queued'})
 const cur=[it('r1',at(1)),q('r2',at(2)),it('r3',at(3))]
 const upd={...q('r2',at(2)),status:'working'as const}
 const got=mergeServerTimeline(cur,[upd])
 assert.deepEqual(ids(got),['r1','r2','r3'])
 assert.equal(got[1].status,'working')
})
