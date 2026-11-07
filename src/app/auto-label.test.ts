import assert from'node:assert/strict'
import test from'node:test'
import{createAutoLabeler}from'./auto-label.js'
import type{HerdrPort}from'./ports.js'
import type{PaneInfo}from'../domain/herdr.js'
const rules=[{provider:'claude',model:'sonnet',alias:'son'}]
const p=(id:string,label:string|null=null,tab=id):PaneInfo=>({pane_id:id,tab_id:tab,workspace_id:'w',terminal_id:id,agent_status:'idle',label,revision:1})
const mk=(tab:string|null=null,fail=false)=>{const calls:string[]=[];return{calls,h:{getTab:async()=>tab?{tab_id:'t',workspace_id:'w',label:tab}:undefined,renameAgent:async(i:string,l:string)=>{calls.push('a'+i+l)},renamePane:async(i:string,l:string)=>{calls.push('p'+i+l);if(fail)throw new Error('x')},renameTab:async(i:string,l:string)=>{calls.push('t'+i+l)}} as unknown as HerdrPort}}
const m={a:{modelId:'claude-sonnet-4',provider:'claude'},b:{modelId:'claude-sonnet-4',provider:'claude'}}
test('labels unlabeled pane once and numbers duplicates',async()=>{
 const{calls,h}=mk(),f=createAutoLabeler(rules)
 await f(h,[p('a'),p('b')],m)
 await f(h,[p('a'),p('b')],m)
 assert.deepEqual(calls,['pason','aason','tason','pbson2','abson2','tbson2'])
})
test('keeps user names and unknown models',async()=>{
 const{calls,h}=mk(),f=createAutoLabeler(rules)
 await f(h,[p('a','mine'),p('b')],{a:m.a})
 assert.deepEqual(calls,[])
})
test('real samples map to aliases',async()=>{
 const{readFileSync}=await import('node:fs')
 const{pickAlias}=await import('../domain/auto-label.js')
 const r=JSON.parse(readFileSync(new URL('../../config/model-aliases.json',import.meta.url),'utf8'))
 const s:[string,string,string][]=[['opus-5.5','claude','opus'],['gemini-3.8-flash','agy','gf'],['gemini-4-argon','agy','ga'],['gpt-6.1-sol','codex','sol'],['gpt-6.1-terra','codex','terra'],['claude-sonnet-5.5','agy','son'],['deepseek-v4.1-flash','ollama','ds-o'],['deepseek-v4.1-flash','opencode','ds-f'],['beam','opencode','beam']]
 for(const[modelId,provider,a]of s)assert.equal(pickAlias(r,{modelId,provider}),a)
 assert.equal(pickAlias(r,{modelId:'1-task-s',provider:'agy'}),null)
})
test('skips all renames when agent name exists',async()=>{
 const{calls,h}=mk(),f=createAutoLabeler(rules)
 await f(h,[p('a')],{a:m.a},[{pane_id:'a',name:'sonnet'} as never])
 assert.deepEqual(calls,[])
})
test('skips all renames when tab label exists',async()=>{
 const{calls,h}=mk('sonnet'),f=createAutoLabeler(rules)
 await f(h,[p('a')],{a:m.a})
 assert.deepEqual(calls,[])
})
test('logs failed rename with id and command only',async()=>{
 const{h}=mk(null,true),w:unknown[]=[],f=createAutoLabeler(rules,(x)=>{w.push(x)})
 await f(h,[p('a')],{a:m.a})
 assert.deepEqual(w,[{id:'a',command:'pane rename'}])
})
