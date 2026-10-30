import assert from'node:assert/strict'
import test from'node:test'
import{mergeServerTimeline}from'./timelineHydrate.js'
import type{TimelineItem}from'./timeline-item.js'
const it=(id:string,at:string,seq=0):TimelineItem=>({requestId:id,workspaceId:'w1',paneId:'w1:p1',targetName:'p1',promptText:'hi',status:'completed',createdAt:at,seq})
const ids=(xs:TimelineItem[])=>xs.map(x=>x.requestId)
const at=(n:number)=>`2026-10-29T00:00:0${n}Z`
test('hydrates a DESC server list oldest first',()=>{
 const srv=[it('r3',at(3)),it('r2',at(2)),it('r1',at(1))]
 assert.deepEqual(ids(mergeServerTimeline([],srv)),['r1','r2','r3'])
})
test('keeps an SSE item received before hydration in order',()=>{
 const sse=it('r3',at(3))
 const srv=[it('r2',at(2)),it('r1',at(1))]
 assert.deepEqual(ids(mergeServerTimeline([sse],srv)),['r1','r2','r3'])
})
