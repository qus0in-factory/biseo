import assert from'node:assert/strict'
import test from'node:test'
import{modelDisplay}from'./pane-model-line.js'
const oc:[string,string][]=[
 ['┃  Build auto · Opus 5.5 Claude Agent · low','Opus 5.5 Claude Agent'],
 ['┃  Build auto · GPT-6.1 Sol OpenAI · low','GPT-6.1 Sol OpenAI'],
 ['┃  Build auto · DeepSeek V4.1 Flash Ollama Cloud · max','DeepSeek V4.1 Flash Ollama Cloud'],
 ['┃  Build auto · Beam Free OpenCode Go · max','Beam Free OpenCode Go'],
]
// Live idle capture plus the working, accept-edits, and GPT footer variants.
const agy:[string,string][]=[
 ['? for shortcuts                                                                                                     accept-edits · Gemini 3.8 Flash · medium · 1 task(s) · /tasks','Gemini 3.8 Flash'],
 ['esc to cancel                                                                                                       accept-edits · Claude Sonnet 5.5 · high · 2 task(s) · /tasks','Claude Sonnet 5.5'],
 ['? for shortcuts  accept-edits · Gemini 4 Argon · low','Gemini 4 Argon'],
 ['esc to cancel  accept-edits · GPT-6.1 Sol · high','GPT-6.1 Sol'],
]
test('reads observed status lines and rejects missing kinds',()=>{
 for(const[line,exp]of oc)assert.equal(modelDisplay(['┃',line,'~/Factory'],'opencode'),exp)
 for(const[line,exp]of agy)assert.equal(modelDisplay(['>',line],'agy'),exp)
 for(const[lines,k]of[[['no'],'opencode'],[['Build auto · X · low'],'claude'],[['talk · about'],'agy'],[[],'agy']]as const)
  assert.equal(modelDisplay([...lines],k),null)
})
test('agy ignores footers without a known model family',()=>{
 for(const line of[
  '? for shortcuts  accept-edits · 1 task(s) · /tasks',
  'esc to cancel  accept-edits · /tasks · 1 task(s)',
  '1-task-s',
  'Gemini 3.8 Flash',
 ])assert.equal(modelDisplay(['>',line],'agy'),null)
})
