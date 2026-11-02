import test from'node:test'
import assert from'node:assert/strict'
import{recentPrompt}from'./recent-prompt.js'
test('stored prompts follow the existing claude, codex, and antigravity formats',()=>{
 const cases=[
  ['herdr:claude',{type:'user',message:{content:'hello'}}],
  ['herdr:codex',{type:'response_item',payload:{type:'message',role:'user',content:[{type:'input_text',text:'hello'}]}}],
  ['herdr:antigravity_cli',{type:'USER_INPUT',source:'USER_EXPLICIT',content:'hello'}],
 ]as const
 for(const[source,entry]of cases)assert.equal(recentPrompt(JSON.stringify(entry),source),'hello')
 assert.equal(recentPrompt(JSON.stringify({type:'assistant',content:'noise'}),'herdr:claude'),null)
})
