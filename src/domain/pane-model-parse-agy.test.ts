import assert from'node:assert/strict'
import test from'node:test'
import{parseModelDisplay as p}from'./pane-model-parse.js'
test('agy keeps the model and uses the agy provider',()=>{
 assert.deepEqual(p('Gemini 3.8 Flash','agy'),{modelId:'gemini-3.8-flash',provider:'agy'})
 assert.deepEqual(p('Gemini 4 Argon','agy'),{modelId:'gemini-4-argon',provider:'agy'})
})
