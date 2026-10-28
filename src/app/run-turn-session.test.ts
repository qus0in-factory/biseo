import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
test('session change blocks before prompt',async()=>{
 const s=setup({pane:{...target.pane,terminal_id:'other'}})
 await runTurn(s.d,item,{read:async()=> 'x'},target)
 const got=s.store.get('r1')
 assert.equal(got?.status,'failed')
 assert.equal(got?.errorCode,'agent_session_changed')
 assert.equal(s.calls.prompt,0)
 assert.equal(s.locks.has('w:p1'),false)
})
