import assert from 'node:assert/strict'
import test from 'node:test'
import { createPaneModelCache } from './pane-model-cache.js'
import type { HerdrPort } from './ports.js'
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
