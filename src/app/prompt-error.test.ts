import test from'node:test'
import assert from'node:assert/strict'
import {promptError}from'./prompt-error.js'
test('prompt transport timeout is delivery uncertain, not turn timeout',()=>{
 assert.deepEqual(promptError({code:'timeout'},false),{status:'failed',errorCode:'delivery_uncertain'})
})
test('blocked and stalled prompt errors keep their codes',()=>{
 assert.deepEqual(promptError({code:'agent_blocked'},false),{status:'blocked',errorCode:'agent_blocked'})
 assert.deepEqual(promptError({code:'agent_prompt_stalled'},false),{status:'failed',errorCode:'agent_prompt_stalled'})
})
