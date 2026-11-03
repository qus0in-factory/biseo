import assert from'node:assert/strict'
import test from'node:test'
import{parseModelDisplay}from'./pane-model-parse.js'
const cases:[string,string,string][]=[
 ['DeepSeek V4.1 Flash Ollama Cloud','deepseek-v4.1-flash','ollama'],
 ['GPT-6.1 Sol OpenAI','gpt-6.1-sol','codex'],
 ['Opus 5.5 Claude Agent','opus-5.5','claude'],
 ['Beam Free OpenCode Go','beam','opencode'],
 ['GLM-5.3-Flash Free Default / OpenCode','glm-5.3-flash','opencode'],
 ['GLM OpenCode Go','glm','opencode-go'],
]
test('opencode maps observed provider and model',()=>{
 for(const[s,modelId,provider]of cases)assert.deepEqual(parseModelDisplay(s,'opencode'),{modelId,provider})
})
test('unknown provider or model is not invented',()=>{
 for(const s of['Gemini 3.8 Flash','Mystery Model','  '])assert.equal(parseModelDisplay(s,'opencode'),null)
})
test('agy keeps the model and uses the agy provider',()=>{
 for(const[s,id]of[['Gemini 3.8 Flash','gemini-3.8-flash'],['Gemini 4 Argon','gemini-4-argon'],['Claude Sonnet 5.5','claude-sonnet-5.5'],['GPT-6.1 Sol','gpt-6.1-sol']])
  assert.deepEqual(parseModelDisplay(s,'agy'),{modelId:id,provider:'agy'})
})
test('agy rejects status fragments that are not model families',()=>{
 for(const s of['1 task(s)','1-task-s','/tasks','medium','accept-edits','Gemini','Mystery Model'])
  assert.equal(parseModelDisplay(s,'agy'),null)
})
