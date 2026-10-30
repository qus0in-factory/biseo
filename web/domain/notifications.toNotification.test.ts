import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { toNotification, notifiable } from './notifications.js'
import type { TimelineItem } from './timeline.js'
const item=(s:TimelineItem['status']):TimelineItem=>({requestId:'r1',workspaceId:'w',paneId:'p1',targetName:'pane',agentKind:'claude',promptText:'hi',status:s,responseText:'result text',errorCode:null,createdAt:'2026-01-01T00:00:00Z',seq:1,completedAt:'2026-01-01T00:01:00Z'})
describe('toNotification',()=>{
 it('statuses',()=>{assert.equal(notifiable('completed'),true);assert.equal(notifiable('working'),false)})
 it('null non-notifiable',()=>{assert.equal(toNotification(item('working'),'pane'),null)})
 it('builds completed',()=>{const n=toNotification(item('completed'),'pane');assert.ok(n);assert.equal(n?.id,'r1');assert.equal(n?.paneName,'pane');assert.equal(n?.status,'completed');assert.equal(n?.text,'result text')})
})