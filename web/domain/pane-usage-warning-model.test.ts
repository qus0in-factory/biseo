import assert from'node:assert/strict'
import test from'node:test'
import{evaluatePaneUsageWarning}from'./pane-usage-warning'
import{makeTestPane}from'./pane-usage-test-helper'
import{agyWarningFixture}from'./agy-warning-fixture'
import{prov,win}from'./paneUsageSummaryFixture.test-util'
const ollama=(used:number)=>({
 ...prov('ollama',[win('included_balance',null)]),
 metrics:[{id:'included_balance',label:'i',unit:'currency',used,limit:100,remaining:100-used,resetsAt:null}],
})
test('observed provider connects warning',()=>{
 const ds={...makeTestPane('opencode','ds-o'),modelProvider:'ollama'}
 assert.equal(evaluatePaneUsageWarning(ds,[ollama(98)]).hasWarning,true)
 assert.equal(evaluatePaneUsageWarning(ds,[ollama(97)]).hasWarning,false)
 const ga={...makeTestPane('agy','ga'),modelId:'gemini-4-argon'},pool=[agyWarningFixture(10)]
 assert.equal(evaluatePaneUsageWarning(ga,pool).hasWarning,true)
 assert.equal(evaluatePaneUsageWarning({...ga,modelId:'gemini-3.8-flash'},pool).hasWarning,false)
})
