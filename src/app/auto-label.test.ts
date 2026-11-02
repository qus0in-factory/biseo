import assert from'node:assert/strict'
import test from'node:test'
import{createAutoLabeler}from'./auto-label.js'
import type{HerdrPort}from'./ports.js'
import type{PaneInfo}from'../domain/herdr.js'
const rules=[{provider:'claude',model:'sonnet',alias:'son'}]
const p=(id:string,label:string|null=null,tab=id):PaneInfo=>({pane_id:id,tab_id:tab,workspace_id:'w',terminal_id:id,agent_status:'idle',label,revision:1})
const mk=()=>{const calls:string[]=[];return{calls,h:{renamePane:async(i:string,l:string)=>{calls.push('p'+i+l)},renameTab:async(i:string,l:string)=>{calls.push('t'+i+l)}} as unknown as HerdrPort}}
const m={a:{modelId:'claude-sonnet-4',provider:'claude'},b:{modelId:'claude-sonnet-4',provider:'claude'}}
test('labels unlabeled pane once and numbers duplicates',async()=>{
 const{calls,h}=mk(),f=createAutoLabeler(rules)
 await f(h,[p('a'),p('b')],m)
 await f(h,[p('a'),p('b')],m)
 assert.deepEqual(calls,['pason','tason','pbson2','tbson2'])
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
})
