import assert from'node:assert/strict'
import test from'node:test'
import{mergeLatest,startPaging}from'./timelinePaging.js'
import type{TimelineItem}from'./timeline-item.js'
const it=(id:string,seq:number):TimelineItem=>({requestId:id,workspaceId:'w1',paneId:'w1:p1',targetName:'p1',promptText:'hi',status:'completed',createdAt:`2026-10-29T00:00:0${seq}Z`,seq})
const ids=(p:{items:TimelineItem[]})=>p.items.map(i=>i.requestId)

test('mergeLatest sorts the first page and keeps its cursor',()=>{
 const p=mergeLatest(startPaging(),{items:[it('r3',3),it('r2',2)],hasMore:true,nextBefore:2})
 assert.deepEqual(ids(p),['r2','r3'])
 assert.equal(p.before,2)
 assert.equal(p.hasMore,true)
})

test('mergeLatest does not rewind a cursor extended by older pages',()=>{
 const p={items:[it('r1',1),it('r2',2),it('r3',3)],hasMore:true,before:1}
 const next=mergeLatest(p,{items:[it('r3',3)],hasMore:true,nextBefore:3})
 assert.equal(next.before,1)
 assert.equal(next.hasMore,true)
})
