import assert from 'node:assert/strict'
import test from 'node:test'
import { createPaneModelCache } from './pane-model-cache.js'
import type { HerdrPort } from './ports.js'
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
