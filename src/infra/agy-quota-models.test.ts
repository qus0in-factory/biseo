import test from'node:test'
import assert from'node:assert/strict'
import{modelBucketsToGroups as groups,modelBucketsToGroups}from'./agy-quota-models.js'
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
test('chat_* and tab_* stay hidden, not Gemini 4 Argon', () => {
  const g = modelBucketsToGroups([
    { modelId: 'chat_20706', remainingFraction: 1 },
    { modelId: 'chat_23310', remainingFraction: 1 },
    { modelId: 'tab_flash_lite_preview', remainingFraction: 1 },
    { modelId: 'tab_jump_flash_lite_preview', remainingFraction: 1 }
  ])
  assert.deepEqual(g, [])
})

test('explicit gemini-argon ids stay out of generic Gemini Models', () => {
  const g = modelBucketsToGroups([
    { modelId: 'gemini-2.5-pro', remainingFraction: 0.4 },
    { modelId: 'gemini-argon-wtu-weekly', remainingFraction: 0.75 }
  ])
  assert.deepEqual(g.map(x => x.displayName).sort(), ['Gemini 4 Argon', 'Gemini Models'])
  assert.deepEqual(g.find(x => x.displayName === 'Gemini 4 Argon')?.families, ['argon'])
  assert.deepEqual(g.find(x => x.displayName === 'Gemini Models')?.families, ['gemini'])
})

test('bucketId-only argon maps to Gemini 4 Argon', () => {
  const g = modelBucketsToGroups([{ bucketId: 'gemini-argon-wtu-weekly', remainingFraction: 0.5 }])
  assert.deepEqual(g.map((x) => x.displayName), ['Gemini 4 Argon'])
  assert.deepEqual(g[0].families, ['argon'])
})
