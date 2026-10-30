import assert from'node:assert/strict'
import test from'node:test'
import{hasCollectingTimeout}from'./collectingTimeout.js'
import type{TimelineItem}from'./timeline-item.js'
const it=(status:TimelineItem['status'],errorCode:string|null=null):TimelineItem=>({requestId:'r',workspaceId:'w1',paneId:'w1:p1',targetName:'p',promptText:'hi',status,errorCode,createdAt:'2026-10-30T00:00:00Z'})

test('collecting timeout excludes an expired turn',()=>{
 assert.equal(hasCollectingTimeout([it('timeout','turn_timeout')]),true)
 assert.equal(hasCollectingTimeout([it('timeout','late_capture_expired')]),false)
 assert.equal(hasCollectingTimeout([it('completed')]),false)
})
