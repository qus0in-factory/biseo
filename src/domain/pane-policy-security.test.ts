import test from'node:test'
import assert from'node:assert/strict'
import {toSummaries}from'./pane-policy.js'
import type{PaneInfo}from'./herdr.js'
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