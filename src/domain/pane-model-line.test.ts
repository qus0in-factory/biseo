import assert from'node:assert/strict'
import test from'node:test'
import{modelDisplay}from'./pane-model-line.js'
const oc:[string,string][]=[
 ['┃  Build auto · Opus 5.5 Claude Agent · low','Opus 5.5 Claude Agent'],
 ['┃  Build auto · GPT-6.1 Sol OpenAI · low','GPT-6.1 Sol OpenAI'],
 ['┃  Build auto · DeepSeek V4.1 Flash Ollama Cloud · max','DeepSeek V4.1 Flash Ollama Cloud'],
 ['┃  Build auto · Beam Free OpenCode Go · max','Beam Free OpenCode Go'],
]
test('reads observed status lines and rejects missing kinds',()=>{
 for(const[line,exp]of oc)assert.equal(modelDisplay(['┃',line,'~/Factory'],'opencode'),exp)
 assert.equal(modelDisplay(['>','? for shortcuts  accept-edits · Gemini 3.8 Flash · medium'],'agy'),'Gemini 3.8 Flash')
 assert.equal(modelDisplay(['>','Press up  accept-edits · Gemini 4 Argon · low'],'agy'),'Gemini 4 Argon')
 for(const[lines,k]of[[['no'],'opencode'],[['Build auto · X · low'],'claude'],[['talk · about'],'agy'],[[],'agy']]as const)
  assert.equal(modelDisplay([...lines],k),null)
})
