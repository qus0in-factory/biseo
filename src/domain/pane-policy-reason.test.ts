import test from'node:test'
import assert from'node:assert/strict'
import {toSummaries}from'./pane-policy.js'
import type{AgentInfo,PaneInfo}from'./herdr.js'
const p=(id:string,status:PaneInfo['agent_status'],x:Partial<PaneInfo>={}):PaneInfo=>({pane_id:id,tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:status,revision:1,...x})
const a=(id:string,status:AgentInfo['agent_status'],x:Partial<AgentInfo>={}):AgentInfo=>({pane_id:id,terminal_id:'term',agent_status:status,revision:1,...x})
test('reason precedence',()=>{
 const s=toSummaries([p('a','blocked',{agent:'x'}),p('b','unknown',{agent:'x'}),p('c','idle',{agent:'x'}),p('d','idle',{agent:'x'}),p('e','idle',{agent:'x'})],[a('a','blocked',{agent:'x'}),a('b','unknown',{agent:'x'}),a('c','idle',{agent:'x',interactive_ready:false}),a('d','idle',{agent:'x',launch_pending:true}),a('e','idle',{agent:'x'})],new Set(['e']))
 assert.deepEqual(s.map(x=>x.disabledReason),['agent_blocked','agent_unknown','agent_unknown','agent_busy','agent_busy'])
})
