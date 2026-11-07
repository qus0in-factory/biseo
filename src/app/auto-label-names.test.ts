import assert from'node:assert/strict'
import test from'node:test'
import{createNameCheck}from'./auto-label-names.js'
import type{HerdrPort}from'./ports.js'
import type{AgentInfo,PaneInfo}from'../domain/herdr.js'
test('caches failed tab reads and keeps agent-name short circuit',async()=>{
 let calls=0
 const h={getTab:async()=>{calls++;throw Error('unavailable')}}as unknown as HerdrPort
 const p={pane_id:'a',tab_id:'t'}as PaneInfo
 const check=createNameCheck(h,[{pane_id:'named',name:'user'}as AgentInfo])
 assert.equal(await check({...p,pane_id:'named'}),true)
 assert.equal(calls,0)
 assert.equal(await check(p),false)
 assert.equal(await check({...p,pane_id:'b'}),false)
 assert.equal(calls,1)
})
test('missing getTab permits labeling',async()=>{
 assert.equal(await createNameCheck({}as HerdrPort,[])({tab_id:'t'}as PaneInfo),false)
})
