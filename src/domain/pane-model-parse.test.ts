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
