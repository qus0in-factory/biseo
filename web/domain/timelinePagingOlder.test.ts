import assert from'node:assert/strict'
import test from'node:test'
import{addOlder}from'./timelinePaging.js'
import type{TimelineItem}from'./timeline-item.js'
const it=(id:string,seq:number):TimelineItem=>({requestId:id,workspaceId:'w1',paneId:'w1:p1',targetName:'p1',promptText:'hi',status:'completed',createdAt:`2026-10-29T00:00:0${seq}Z`,seq})

test('addOlder prepends the next page and stops at the end',()=>{
 const p=addOlder({items:[it('r3',3)],hasMore:true,before:3},{items:[it('r2',2),it('r1',1)],hasMore:false,nextBefore:null})
 assert.deepEqual(p.items.map(i=>i.requestId),['r1','r2','r3'])
 assert.equal(p.before,null)
 assert.equal(p.hasMore,false)
})
