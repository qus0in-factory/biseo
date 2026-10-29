import test from'node:test'
import assert from'node:assert/strict'
import{beginReader}from'./turn-queue-target.js'
import type{Target}from'../domain/turn-policy.js'
import type{TurnDeps}from'./turn-deps.js'
const pane={pane_id:'w:p1',tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:'idle' as const,agent:'opencode',revision:1}
const ag=(a:string,s:any)=>({pane_id:'w:p1',terminal_id:'term',agent_status:'idle' as const,agent:a,agent_session:s,revision:1})
const ses={source:'herdr:opencode',agent:'opencode',kind:'id' as const,value:'ses_1'}
const deps=(cap:any)=>({herdr:{listPanes:async()=>[],listAgents:async()=>[],getPane:async()=>undefined,getAgent:async()=>undefined,prompt:async()=>{}},capture:{begin:cap}}as unknown as TurnDeps)
const input={requestId:'r1',workspaceId:'w',paneId:'w:p1',text:'hi'}
test('first send allowed only for opencode without session',async()=>{
 const t:Target={pane}
 assert.notEqual(await beginReader(deps(async()=>null),input,t),null)
 const c:Target={pane:{...pane,agent:'claude'},agent:ag('claude',undefined)}
 assert.equal(await beginReader(deps(async()=>null),input,c),null)
 let n=0
 const e:Target={pane,agent:ag('opencode',ses)}
 const r=await beginReader(deps(async()=>{n++;return{read:async()=>'x'}}),input,e)
 assert.notEqual(r,null)
 assert.equal(n,1)
})
