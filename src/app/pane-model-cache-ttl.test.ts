import assert from 'node:assert/strict'
import test from 'node:test'
import { createPaneModelCache } from './pane-model-cache.js'
import type { HerdrPort } from './ports.js'
const panes=[{paneId:'p1',agentKind:'opencode'},{paneId:'p2',agentKind:'agy'}]
test('cache limits reads and refreshes after ttl',async()=>{
 let now=0,calls=0
 const h={readRecent:async(id:string)=>{calls++;return id==='p1'?[calls>2?'Build auto · Opus 5.5 Claude Agent · low':'Build auto · GPT-6.1 Sol OpenAI · low']:['accept-edits · Gemini 3.8 Flash · medium']}} as unknown as HerdrPort
 const o=createPaneModelCache(1000,()=>now),a=await o(h,panes)
 assert.equal(calls,2)
 assert.deepEqual(a.p1,{modelId:'gpt-6.1-sol',provider:'codex'})
 assert.deepEqual(a.p2,{modelId:'gemini-3.8-flash',provider:'agy'})
 now=999;await o(h,panes);assert.equal(calls,2)
 now=1000;const b=await o(h,panes);assert.equal(calls,4)
 assert.deepEqual(b.p1,{modelId:'opus-5.5',provider:'claude'})
})
