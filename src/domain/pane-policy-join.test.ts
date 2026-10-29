import test from'node:test'
import assert from'node:assert/strict'
import {toSummaries}from'./pane-policy.js'
import type{AgentInfo,PaneInfo}from'./herdr.js'
const p=(id:string,st:PaneInfo['agent_status'],x:Partial<PaneInfo>={})=>({pane_id:id,tab_id:'t',workspace_id:'w',terminal_id:'m',agent_status:st,revision:1,...x})
const a=(id:string,st:AgentInfo['agent_status'],x:Partial<AgentInfo>={})=>({pane_id:id,terminal_id:'m',agent_status:st,revision:1,...x})
test('joins panes with agents and gates sendability',()=>{
 const s=toSummaries([p('a','idle',{agent:'claude',label:'opus'}),p('b','working',{agent:'codex'}),p('c','idle')],[a('a','idle',{agent:'claude',name:'opus',agent_session:{source:'herdr:claude',agent:'claude',kind:'id',value:'s1'}}),a('b','working',{agent:'codex'})],new Set())
 assert.equal(s[0].sendable,true)
 assert.equal(s[0].name,'opus')
 assert.equal(s[0].agentName,'opus')
 assert.equal(s.length,2)
 assert.equal(s[1].disabledReason,'agent_busy')
 assert.equal(s.some(x=>x.paneId==='c'),false)
})
