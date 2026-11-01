import assert from'node:assert/strict'
import test from'node:test'
import{modelDisplay as d}from'./pane-model-line.js'
test('opencode reads the last Build line',()=>{
 assert.equal(d(['Build auto · old · low','talk','┃  Build auto · GPT-6.1 Sol OpenAI · low','footer'],'opencode'),'GPT-6.1 Sol OpenAI')
})
test('agy reads the bottom status line',()=>{
 assert.equal(d(['talk','>','accept-edits · Gemini 3.8 Flash · medium'],'agy'),'Gemini 3.8 Flash')
 assert.equal(d(['esc to cancel                    accept-edits · Gemini 3.8 Flash · medium'],'agy'),'Gemini 3.8 Flash')
})
test('missing or unsupported kind returns null',()=>{
 assert.equal(d(['no status'],'opencode'),null)
 assert.equal(d(['Build auto · GPT-6.1 Sol OpenAI · low'],'claude'),null)
 assert.equal(d(['talk · about'],'agy'),null)
 assert.equal(d([],'agy'),null)
})
