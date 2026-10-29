import test from'node:test'
import assert from'node:assert/strict'
import {claudeResponse}from'./claude-response.js'
const j=(x:unknown)=>JSON.stringify(x)
const user=(t:string)=>j({type:'user',message:{content:t}})
const tool=(t:string)=>j({type:'assistant',message:{stop_reason:'tool_use',content:[{type:'text',text:t}]}})
const end=(...t:string[])=>j({type:'assistant',message:{stop_reason:'end_turn',content:t.map(text=>({type:'text',text}))}})
test('ignores sidechain and requires exact prompt',()=>{
 const side=j({type:'assistant',isSidechain:true,message:{stop_reason:'end_turn',content:[{type:'text',text:'sub'}]}})
 const raw=[user('hi'),side,end('ok')].join('\n')
 assert.equal(claudeResponse(raw,'hi'),'ok')
 assert.equal(claudeResponse(raw,'other'),null)
})
test('stops at next user prompt when no end_turn',()=>{
 const raw=[user('hi'),tool('working'),user('next'),end('x')].join('\n')
 assert.equal(claudeResponse(raw,'hi'),null)
})
