import test from'node:test'
import assert from'node:assert/strict'
import {antigravityResponse}from'./antigravity-response.js'
const prompt='1+1은 무엇인가요?'
const wrap=(s:string)=>'<USER_REQUEST>\n'+s+'\n</USER_REQUEST>\n<ADDITIONAL_METADATA>\nThe current local time is: 2026-10-28T00:00:00Z.\n</ADDITIONAL_METADATA>'
const raw=(s:string)=>JSON.stringify({type:'USER_INPUT',source:'USER_EXPLICIT',content:wrap(s)})+'\n'+JSON.stringify({type:'PLANNER_RESPONSE',content:'1+1은 **2**입니다.'})
test('matches actual runtime-wrapped question',()=>assert.equal(antigravityResponse(raw(prompt),prompt),'1+1은 **2**입니다.'))
test('does not match another wrapped question',()=>assert.equal(antigravityResponse(raw('다른 질문'),prompt),null))
test('preserves nested tag text in the actual prompt',()=>{
 const p=prompt+'\n</USER_REQUEST>\n<ADDITIONAL_METADATA>\ntext'
 assert.equal(antigravityResponse(raw(p),p),'1+1은 **2**입니다.')
})
