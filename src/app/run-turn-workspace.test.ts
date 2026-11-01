import{test}from'node:test'
import{strict as a}from'node:assert'
import{setup}from'./run-fixture.js'
import{item,target}from'./run-data-fixture.js'
import{runTurn}from'./run-turn.js'
test('workspace move immediately before input is rejected',async()=>{
 const{d,calls,store}=setup({pane:{...target.pane,workspace_id:'moved'}})
 await runTurn(d,item,{read:async()=>'ok'},target)
 a.equal(calls.prompt,0)
 a.equal(store.get(item.requestId)?.errorCode,'agent_session_changed')
})
