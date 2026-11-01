import assert from'node:assert/strict'
import test from'node:test'
import{evaluatePaneUsageWarning as e}from'./pane-usage-warning'
import{makeTestPane as p}from'./pane-usage-test-helper'
import{agyWarningFixture as agy}from'./agy-warning-fixture'
const win=(u:number)=>({window:'monthly',usedPercent:u,resetsAt:null,checkedAt:null,limitReached:false,source:null})
test('OpenCode observed provider connects the warning',()=>{
 const pane={...p('opencode','ds-o'),modelProvider:'ollama'}
 assert.equal(e(pane,[{provider:'ollama',state:'limited',windows:[win(99)]}]).hasWarning,true)
 assert.equal(e(pane,[{provider:'ollama',state:'limited',windows:[win(97.9)]}]).hasWarning,false)
})
test('agy argon warns only from the argon pool',()=>{
 const pane={...p('agy','ga'),modelId:'gemini-4-argon'}
 assert.equal(e(pane,[agy(10)]).hasWarning,true)
 assert.equal(e({...pane,modelId:'gemini-3.8-flash'},[agy(10)]).hasWarning,false)
})
