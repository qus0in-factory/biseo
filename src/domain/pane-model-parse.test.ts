import assert from'node:assert/strict'
import test from'node:test'
import{parseModelDisplay as p}from'./pane-model-parse.js'
test('opencode maps observed provider and model',()=>{
 assert.deepEqual(p('DeepSeek V4.1 Flash Ollama Cloud','opencode'),{modelId:'deepseek-v4.1-flash',provider:'ollama'})
 assert.deepEqual(p('GPT-6.1 Sol OpenAI','opencode'),{modelId:'gpt-6.1-sol',provider:'codex'})
 assert.deepEqual(p('Opus 5.5 Claude Agent','opencode'),{modelId:'opus-5.5',provider:'claude'})
 assert.deepEqual(p('GLM-5.3-Flash Free Default / OpenCode','opencode'),{modelId:'glm-5.3-flash-free-default',provider:'opencode'})
 assert.deepEqual(p('GLM OpenCode Go','opencode'),{modelId:'glm',provider:'opencode-go'})
})
test('unknown provider or model is not invented',()=>{
 assert.equal(p('Gemini 3.8 Flash','opencode'),null)
 assert.equal(p('Mystery Model','opencode'),null)
 assert.equal(p('  ','opencode'),null)
})
