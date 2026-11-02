import test from'node:test'
import assert from'node:assert/strict'
import{recentWindow}from'./recent-window.js'
import{claudeResponse}from'./claude-response.js'
test('latest repeated prompt is isolated and unfinished responses stay empty',()=>{
 const user={type:'user',message:{content:'same'}}
 const answer={type:'assistant',message:{content:'old',stop_reason:'end_turn'}}
 const raw=[user,answer,user].map(value=>JSON.stringify(value)).join('\n')
 const window=recentWindow(raw,'herdr:claude')!
 assert.equal(window.prompt,'same')
 assert.equal(claudeResponse(window.raw,window.prompt),null)
 assert.equal(recentWindow('terminal noise','herdr:claude'),null)
})
