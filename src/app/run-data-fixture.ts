import type{Target}from'../domain/turn-policy.js'
import type{TimelineItem}from'../domain/timeline.js'
import {agent,pane}from'./turn-data-fixture.js'
export const target:Target={pane,agent}
export const item:TimelineItem={requestId:'r1',workspaceId:'w',paneId:'w:p1',targetName:'opus',agentKind:'claude',promptText:'hi',status:'queued',responseText:null,errorCode:null,createdAt:'2026-01-01T00:00:00Z',seq:1,completedAt:null}
