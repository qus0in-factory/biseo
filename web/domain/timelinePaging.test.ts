import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeLatest } from './timelinePaging.js'
import { startPaging } from './timelinePaging.js'
import type { TimelineItem } from './timeline-item.js'
import { canLoadOlder } from './timelinePaging.js'
import { addOlder } from './timelinePaging.js'

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
test('canLoadOlder blocks the end, loading, null and duplicate cursors',()=>{
 const p={items:[],hasMore:true,before:5}
 assert.equal(canLoadOlder(p,false,null),true)
 assert.equal(canLoadOlder({...p,hasMore:false},false,null),false)
 assert.equal(canLoadOlder(p,true,null),false)
 assert.equal(canLoadOlder({...p,before:null},false,null),false)
 assert.equal(canLoadOlder(p,false,5),false)
})
{
const it=(id:string,seq:number):TimelineItem=>({requestId:id,workspaceId:'w1',paneId:'w1:p1',targetName:'p1',promptText:'hi',status:'completed',createdAt:`2026-10-29T00:00:0${seq}Z`,seq})

test('addOlder prepends the next page and stops at the end',()=>{
 const p=addOlder({items:[it('r3',3)],hasMore:true,before:3},{items:[it('r2',2),it('r1',1)],hasMore:false,nextBefore:null})
 assert.deepEqual(p.items.map(i=>i.requestId),['r1','r2','r3'])
 assert.equal(p.before,null)
 assert.equal(p.hasMore,false)
})
}
