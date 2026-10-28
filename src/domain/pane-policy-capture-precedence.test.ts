import test from'node:test'
import assert from'node:assert/strict'
import {toSummaries}from'./pane-policy.js'
import type{AgentInfo,PaneInfo}from'./herdr.js'
const p=(id:string,agent:string|null,status:PaneInfo['agent_status']='idle'):PaneInfo=>({pane_id:id,tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:status,agent,revision:1})
const a=(id:string,status:AgentInfo['agent_status'],x:Partial<AgentInfo>={}):AgentInfo=>({pane_id:id,terminal_id:'term',agent_status:status,agent:'codex',revision:1,...x})
test('busy, blocked, unknown reasons win over capture and excludes agentless panes',()=>{
 const s=toSummaries([p('a','codex','working'),p('b','codex','blocked'),p('c','codex','unknown'),p('d',null),p('e','claude')],[a('a','working'),a('b','blocked'),a('c','unknown'),a('e','idle',{agent:'claude',launch_pending:true})],new Set(['e']))
 assert.deepEqual(s.map(x=>x.disabledReason),['agent_busy','agent_blocked','agent_unknown','agent_busy'])
})
