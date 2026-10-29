import test from'node:test'
import assert from'node:assert/strict'
import {userSeen}from'./transcript-confirm.js'
test('claude user line confirms the prompt',()=>{
 const raw=JSON.stringify({type:'user',message:{content:[{type:'text',text:'hi'}]}})+'\n'
 assert.equal(userSeen(raw,'hi','herdr:claude'),true)
 assert.equal(userSeen(raw,'bye','herdr:claude'),false)
})
test('codex and agy user lines confirm the prompt',()=>{
 const c=JSON.stringify({type:'response_item',payload:{type:'message',role:'user',content:[{type:'text',text:'hi'}]}})+'\n'
 assert.equal(userSeen(c,'hi','herdr:codex'),true)
 const a=JSON.stringify({type:'USER_INPUT',source:'USER_EXPLICIT',content:[{type:'text',text:'hi'}]})+'\n'
 assert.equal(userSeen(a,'hi','herdr:antigravity_cli'),true)
})
