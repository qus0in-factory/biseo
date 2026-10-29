import test from'node:test'
import assert from'node:assert/strict'
import{captureTurn}from'./capture-turn.js'
import{beginFirstReader}from'./first-session-reader.js'
import{TurnStore}from'./turn-store.js'
import type{Target}from'../domain/turn-policy.js'
test('missing session ends capture_unavailable with one prompt',async()=>{
 const pane={pane_id:'w:p1',tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:'idle' as const,agent:'opencode',revision:1}
 const t:Target={pane}
 let n=0
 const herdr={listPanes:async()=>[],listAgents:async()=>[],getPane:async()=>pane,getAgent:async()=>({pane_id:'w:p1',terminal_id:'term',agent_status:'idle',agent:'opencode',revision:1}),prompt:async()=>{n++}}
 const store=new TurnStore()
 const item={requestId:'r1',workspaceId:'w',paneId:'w:p1',targetName:'o',agentKind:'opencode',promptText:'hi',status:'queued' as const,responseText:null,errorCode:null,createdAt:'2026-01-01T00:00:00Z',seq:1,completedAt:null}
 store.add({...item})
 const r=beginFirstReader({herdr:herdr as never,firstSessionMs:20},t,'hi')!
 await captureTurn({herdr:herdr as never,store,timeoutMs:500,lateCaptureMs:0},item,r)
 assert.equal(store.get('r1')?.status,'capture_unavailable')
 assert.equal(store.get('r1')?.errorCode,'response_capture_unavailable')
 assert.equal(n,1)
})
