import test from'node:test'
import assert from'node:assert/strict'
import{mergeTurn}from'./mergeTurn.js'
import type{TimelineItem as T}from'./timeline.js'
const mk=(s:T['status'],r:string|null=null,c:string|null=null):T=>
 ({requestId:'r1',workspaceId:'w1',paneId:'p1',targetName:'t',promptText:'p',status:s,responseText:r,completedAt:c,createdAt:'2026-01-01'})
test('mergeTurn timeout upgrades and terminal states reject regressions', ()=>{
 for(const st of ['completed','blocked','failed','capture_unavailable'] as const){
  assert.equal(mergeTurn([mk('timeout')],mk(st,'ans'))[0].status,st)
 }
 assert.equal(mergeTurn([mk('completed','ans')],mk('blocked'))[0].status,'completed')
})
test('mergeTurn duplicate preserves non-empty fields idempotently', ()=>{
 const cur=mk('completed','orig','2026-01-01T12:00:00Z')
 const res=mergeTurn([cur],mk('completed',null,null))
 assert.equal(res[0].responseText,'orig')
 assert.equal(res[0].completedAt,'2026-01-01T12:00:00Z')
})
