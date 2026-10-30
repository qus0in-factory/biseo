import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isPinnedPane, toPinnedNotification } from './pinnedNotification.js'
import type { TimelineItem } from './timeline.js'
const item=(s:TimelineItem['status'],p='p1'):TimelineItem=>({requestId:'r1',workspaceId:'w',paneId:p,targetName:'pane',agentKind:'claude',promptText:'hi',status:s,responseText:'txt',errorCode:null,createdAt:'2026-01-01T00:00:00Z',seq:1,completedAt:'2026-01-01T00:01:00Z'})
describe('pinned filter',()=>{
 it('isPinnedPane',()=>{assert.equal(isPinnedPane('p1',['p1']),true);assert.equal(isPinnedPane('p2',['p1']),false)})
 it('null when unpinned',()=>{assert.equal(toPinnedNotification(item('completed'),'pane',['p2']),null)})
 it('null when not notifiable',()=>{assert.equal(toPinnedNotification(item('working'),'pane',['p1']),null)})
 it('builds when pinned',()=>{const n=toPinnedNotification(item('completed'),'pane',['p1']);assert.ok(n);assert.equal(n?.paneId,'p1');assert.equal(n?.read,false)})
})