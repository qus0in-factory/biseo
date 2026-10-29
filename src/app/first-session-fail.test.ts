import test from'node:test'
import assert from'node:assert/strict'
import{beginFirstReader}from'./first-session-reader.js'
import type{Target}from'../domain/turn-policy.js'
const pane={pane_id:'w:p1',tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:'idle' as const,agent:'opencode',revision:1}
const noSes:Target={pane}
const herd=(p:any)=>({listPanes:async()=>[],listAgents:async()=>[],getPane:async()=>p,getAgent:async()=>undefined,prompt:async()=>{}}as never)
const sub=async()=>()=>{}
const base={pane_id:'w:p1',terminal_id:'term',agent_status:'idle',agent:'opencode'}
test('no session, replaced pane, other agent all throw',async()=>{
 const w=beginFirstReader({herdr:herd({...base}),firstSessionMs:20,sub},noSes,'hi')!
 await assert.rejects(w.read(500))
 const x=beginFirstReader({herdr:herd({...base,terminal_id:'other'}),firstSessionMs:20,sub},noSes,'hi')!
 await assert.rejects(x.read(500))
 const y=beginFirstReader({herdr:herd({...base,agent:'claude'}),firstSessionMs:20,sub},noSes,'hi')!
 await assert.rejects(y.read(500))
})
