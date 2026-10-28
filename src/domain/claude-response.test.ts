import test from'node:test'
import assert from'node:assert/strict'
import {claudeResponse}from'./claude-response.js'
const j=(x:unknown)=>JSON.stringify(x)
const user=(t:string)=>j({type:'user',message:{content:t}})
const tool=(t:string)=>j({type:'assistant',message:{stop_reason:'tool_use',content:[{type:'text',text:t}]}})
const end=(...t:string[])=>j({type:'assistant',message:{stop_reason:'end_turn',content:t.map(text=>({type:'text',text}))}})
test('extracts final text after matching prompt',()=>{
 const raw=[user('hi'),tool('working'),j({type:'user',message:{content:[{type:'tool_result',content:'x'}]}}),end('final','answer')].join('\n')
 assert.equal(claudeResponse(raw,'hi'),'final\n\nanswer')
})
