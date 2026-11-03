import test from'node:test'
import assert from'node:assert/strict'
import {toSummaries}from'./pane-policy.js'
import type{AgentInfo,PaneInfo}from'./herdr.js'
import type{PaneInfo}from'./herdr.js'

{
const p=(id:string,agent:string|null,status:PaneInfo['agent_status']='idle'):PaneInfo=>({pane_id:id,tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:status,agent,revision:1})
const a=(id:string,status:AgentInfo['agent_status'],x:Partial<AgentInfo>={}):AgentInfo=>({pane_id:id,terminal_id:'term',agent_status:status,agent:'codex',revision:1,...x})
test('busy, blocked, unknown reasons win over capture and excludes agentless panes',()=>{
 const s=toSummaries([p('a','codex','working'),p('b','codex','blocked'),p('c','codex','unknown'),p('d',null),p('e','claude')],[a('a','working'),a('b','blocked'),a('c','unknown'),a('e','idle',{agent:'claude',launch_pending:true})],new Set(['e']))
 assert.deepEqual(s.map(x=>x.disabledReason),['agent_busy','agent_blocked','agent_unknown','agent_busy'])
})
}
{
const p=(id:string,agent:string|null,status:PaneInfo['agent_status']='idle'):PaneInfo=>({pane_id:id,tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:status,agent,revision:1})
const a=(id:string,agent:string,source?:string,status:AgentInfo['agent_status']='idle'):AgentInfo=>({pane_id:id,terminal_id:'term',agent_status:status,agent,agent_session:source?{source,agent,kind:'id',value:'s'}:undefined,revision:1})
test('disables panes without supported capture metadata',()=>{
 const s=toSummaries([p('a','claude'),p('b','agy'),p('c','codex'),p('d','pi')],[a('a','claude','herdr:claude'),a('b','agy','herdr:antigravity_cli'),a('c','codex'),a('d','pi','herdr:pi')],new Set())
 assert.deepEqual(s.map(x=>[x.sendable,x.disabledReason]),[[true,null],[true,null],[false,'response_capture_unavailable'],[false,'response_capture_unavailable']])
})
}
{
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
}
{
const p=(id:string,status:PaneInfo['agent_status'],x:Partial<PaneInfo>={}):PaneInfo=>({pane_id:id,tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:status,revision:1,...x})
const a=(id:string,status:AgentInfo['agent_status'],x:Partial<AgentInfo>={}):AgentInfo=>({pane_id:id,terminal_id:'term',agent_status:status,revision:1,...x})
test('reason precedence',()=>{
 const s=toSummaries([p('a','blocked',{agent:'x'}),p('b','unknown',{agent:'x'}),p('c','idle',{agent:'x'}),p('d','idle',{agent:'x'}),p('e','idle',{agent:'x'})],[a('a','blocked',{agent:'x'}),a('b','unknown',{agent:'x'}),a('c','idle',{agent:'x',interactive_ready:false}),a('d','idle',{agent:'x',launch_pending:true}),a('e','idle',{agent:'x'})],new Set(['e']))
 assert.deepEqual(s.map(x=>x.disabledReason),['agent_blocked','agent_unknown','agent_unknown','agent_busy','agent_busy'])
})
}
{
const P=(id:string,a?:string|null,x:Partial<PaneInfo>={})=>({pane_id:id,tab_id:'t',workspace_id:'w',terminal_id:'m',agent_status:'idle' as const,agent:a,revision:1,...x})
const A=(id:string,name?:string)=>({pane_id:id,terminal_id:'m',agent_status:'idle' as const,agent:'c',name,revision:1})
test('excludes agentless shell pane',()=>{
 const s=toSummaries([P('sh',null,{title:'pnpm',terminal_title_stripped:'pnpm'}),P('p1','c')],[A('p1','w1')],new Set())
 assert.equal(s.length,1)
 assert.equal(s[0].paneId,'p1')
})
test('never leaks terminal title as name',()=>{
 const s=toSummaries([P('p1','c',{title:'cmd',terminal_title_stripped:'cmd'}),P('p2','c',{label:'lbl',title:'cmd'}),P('p3','c',{title:'cmd'})],[A('p1','ag1'),A('p2'),A('p3')],new Set())
 assert.deepEqual(s.map(x=>x.name),['ag1','lbl','p3'])
 assert.equal(s.some(x=>x.name.includes('cmd')),false)
})
}
