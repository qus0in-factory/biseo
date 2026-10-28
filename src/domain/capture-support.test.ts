import test from'node:test'
import assert from'node:assert/strict'
import {captureReason,captureSupported}from'./capture-support.js'
test('names unsupported capture reasons',()=>{
 assert.equal(captureReason(undefined),'no_agent_session')
 assert.equal(captureReason({source:'herdr:codex',agent:'codex',kind:'id',value:'s'}),'unsupported_agent')
 assert.equal(captureReason({source:'herdr:claude',agent:'claude',kind:'id',value:'s'}),'path_unresolved')
 assert.equal(captureSupported({source:'herdr:antigravity_cli',agent:'agy',kind:'id',value:'s'}),true)
 assert.equal(captureSupported(undefined),false)
})
