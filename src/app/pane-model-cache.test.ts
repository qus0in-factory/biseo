import assert from 'node:assert/strict'
import test from 'node:test'
import { createPaneModelCache } from './pane-model-cache.js'
import type { HerdrPort } from './ports.js'

const panes=[{paneId:'p1',agentKind:'opencode'},{paneId:'p2',agentKind:'agy'}]
const fake=()=>{
 let calls=0
 const h={readRecent:async(id:string)=>{calls++;return id==='p1'?[calls>2?'Build auto · Opus 5.5 Claude Agent · low':'Build auto · GPT-6.1 Sol OpenAI · low']:['accept-edits · Gemini 3.8 Flash · medium']}} as unknown as HerdrPort
 return{h,calls:()=>calls}
}
test('keeps the last valid model when the footer loses its model',async()=>{
 let now=0,lines=['? for shortcuts  accept-edits · Gemini 3.8 Flash · medium · 1 task(s) · /tasks']
 const h={readRecent:async()=>lines} as unknown as HerdrPort
 const o=createPaneModelCache(1000,()=>now),panes=[{paneId:'p1',agentKind:'agy'}]
 const a=await o(h,panes)
 assert.deepEqual(a.p1,{modelId:'gemini-3.8-flash',provider:'agy'})
 lines=['>','1-task-s']
 now=1000
 assert.deepEqual((await o(h,panes)).p1,a.p1)
})
test('cache limits reads and refreshes after ttl',async()=>{
 let now=0
 const f=fake(),o=createPaneModelCache(1000,()=>now),a=await o(f.h,panes)
 assert.equal(f.calls(),2)
 assert.deepEqual(a.p1,{modelId:'gpt-6.1-sol',provider:'codex'})
 assert.deepEqual(a.p2,{modelId:'gemini-3.8-flash',provider:'agy'})
 now=999;await o(f.h,panes);assert.equal(f.calls(),2)
 now=1000;const b=await o(f.h,panes);assert.equal(f.calls(),4)
 assert.deepEqual(b.p1,{modelId:'opus-5.5',provider:'claude'})
})
test('failed identification is cached and never warns',async()=>{
 let calls=0
 const h={readRecent:async()=>{calls++;throw new Error('read failed')}} as unknown as HerdrPort
 const o=createPaneModelCache(1000,()=>0)
 assert.deepEqual(await o(h,[{paneId:'p1',agentKind:'opencode'}]),{})
 await o(h,[{paneId:'p1',agentKind:'opencode'}])
 assert.equal(calls,1)
})
test('claude kind is read and stays empty without a model line',async()=>{
 let calls=0
 const h={readRecent:async()=>{calls++;return[]}} as unknown as HerdrPort
 const o=createPaneModelCache(1000,()=>0)
 assert.deepEqual(await o(h,[{paneId:'p1',agentKind:'claude'}]),{})
 assert.equal(calls,1)
})
test('concurrent initial snapshots wait for the same model observation', async () => {
  let finish!: (lines: string[]) => void
  let calls = 0
  const h = { readRecent: () => {
    calls++
    return new Promise<string[]>(resolve => { finish = resolve })
  } } as unknown as HerdrPort
  const cache = createPaneModelCache()
  const panes = [{ paneId: 'cold:p1', agentKind: 'opencode' }]
  const first = cache(h, panes)
  const second = cache(h, panes)
  finish(['Build auto · Opus 5.5 Claude Agent · low'])
  const expected = { 'cold:p1': { modelId: 'opus-5.5', provider: 'claude' } }
  assert.deepEqual(await first, expected)
  assert.deepEqual(await second, expected)
  assert.equal(calls, 1)
})
