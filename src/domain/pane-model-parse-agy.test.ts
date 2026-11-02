import assert from'node:assert/strict'
import test from'node:test'
import{parseModelDisplay}from'./pane-model-parse.js'
test('agy keeps the model and uses the agy provider',()=>{
 for(const[s,id]of[['Gemini 3.8 Flash','gemini-3.8-flash'],['Gemini 4 Argon','gemini-4-argon'],['Claude Sonnet 5.5','claude-sonnet-5.5'],['GPT-6.1 Sol','gpt-6.1-sol']])
  assert.deepEqual(parseModelDisplay(s,'agy'),{modelId:id,provider:'agy'})
})
test('agy rejects status fragments that are not model families',()=>{
 for(const s of['1 task(s)','1-task-s','/tasks','medium','accept-edits','Gemini','Mystery Model'])
  assert.equal(parseModelDisplay(s,'agy'),null)
})
