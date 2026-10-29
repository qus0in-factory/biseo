import test from'node:test'
import assert from'node:assert/strict'
import {antigravityResponse}from'./antigravity-response.js'
const j=(x:unknown)=>JSON.stringify(x)
const user=(t:string)=>j({type:'USER_INPUT',source:'USER_EXPLICIT',content:t})
const planner=(t:string,tools=0)=>j({type:'PLANNER_RESPONSE',content:t,tool_calls:Array(tools).fill({})})
test('returns last text-only planner response',()=>{
 const raw=[user('hi'),planner('working',1),j({type:'GENERIC',content:'tool'}),planner('final')].join('\n')
 assert.equal(antigravityResponse(raw,'hi'),'final')
})
test('requires prompt match and stops at next user input',()=>{
 const raw=[user('hi'),planner('a'),user('next'),planner('b')].join('\n')
 assert.equal(antigravityResponse(raw,'hi'),'a')
 assert.equal(antigravityResponse(raw,'other'),null)
})
