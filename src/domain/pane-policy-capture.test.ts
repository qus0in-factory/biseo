import test from'node:test'
import assert from'node:assert/strict'
import {toSummaries}from'./pane-policy.js'
import type{AgentInfo,PaneInfo}from'./herdr.js'
const p=(id:string,agent:string|null,status:PaneInfo['agent_status']='idle'):PaneInfo=>({pane_id:id,tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:status,agent,revision:1})
const a=(id:string,agent:string,source?:string,status:AgentInfo['agent_status']='idle'):AgentInfo=>({pane_id:id,terminal_id:'term',agent_status:status,agent,agent_session:source?{source,agent,kind:'id',value:'s'}:undefined,revision:1})
test('disables panes without supported capture metadata',()=>{
 const s=toSummaries([p('a','claude'),p('b','agy'),p('c','codex'),p('d','pi')],[a('a','claude','herdr:claude'),a('b','agy','herdr:antigravity_cli'),a('c','codex'),a('d','pi','herdr:pi')],new Set())
 assert.deepEqual(s.map(x=>[x.sendable,x.disabledReason]),[[true,null],[true,null],[false,'response_capture_unavailable'],[false,'response_capture_unavailable']])
})
