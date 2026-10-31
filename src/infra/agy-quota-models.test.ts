import test from'node:test'
import assert from'node:assert/strict'
import{modelBucketsToGroups as groups}from'./agy-quota-models.js'
const b=(modelId:string,remainingFraction=1)=>({modelId,remainingFraction})
test('official pools keep Gemini, Claude and GPT',()=>{
const g=groups([b('gemini-2.5-pro',.4),b('claude-opus-5-5-high',0),b('gpt-oss-120b-medium',.2)])
assert.deepEqual(g.map(x=>x.displayName),['Gemini Models','Claude and GPT models'])
assert.deepEqual(g.map(x=>x.families),[['gemini'],['claude','gpt']])
assert.deepEqual(g.map(x=>x.buckets[0].remainingFraction),[.4,0])
assert.deepEqual(groups([]),[])
})
test('chat_* and tab_* stay hidden, including bucketId fallback',()=>{
const g=groups([b('chat_20706'),b('chat_23310'),b('tab_flash_lite_preview'),
b('tab_jump_flash_lite_preview'),{bucketId:'chat_20706',remainingFraction:1},
{bucketId:'tab_jump_flash_lite_preview',remainingFraction:1},b('gemini-2.5-pro')])
assert.deepEqual(g.map(x=>x.displayName),['Gemini Models'])
})
