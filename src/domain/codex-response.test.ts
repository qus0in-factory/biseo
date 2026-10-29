import test from'node:test'
import assert from'node:assert/strict'
import {codexResponse}from'./codex-response.js'
const j=(x:unknown)=>JSON.stringify(x)
const user=(t:string)=>j({type:'response_item',payload:{type:'message',role:'user',content:[{type:'input_text',text:t}]}})
const done=(t:string)=>j({type:'event_msg',payload:{type:'task_complete',last_agent_message:t}})
test('returns task_complete after the first matching user; begin offset excludes earlier turns',()=>{
 const raw=[done('before'),user('  hi  '),j({type:'response_item',payload:{type:'message',role:'assistant',content:[{type:'output_text',text:'partial'}]}}),done(' final '),user('next'),done('wrong')].join('\n')
 assert.equal(codexResponse(raw,'hi'),'final')
})
test('stops at next user before completion',()=>{
 const raw=[user('hi'),user('next'),done('late')].join('\n')
 assert.equal(codexResponse(raw,'hi'),null)
})
test('requires a matching user prompt',()=>{
 const raw=[user('other'),done('answer')].join('\n')
 assert.equal(codexResponse(raw,'hi'),null)
})
test('ignores broken lines and missing message text',()=>{
 const raw=['not json',j({type:'response_item',payload:{type:'message',role:'user',content:[]}}),user('hi'),done('ok')].join('\n')
 assert.equal(codexResponse(raw,'hi'),'ok')
})
