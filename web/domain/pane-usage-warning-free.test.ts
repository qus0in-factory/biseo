import assert from'node:assert/strict'
import test from'node:test'
import{evaluatePaneUsageWarning}from'./pane-usage-warning'
import{paneUsageSummary}from'./paneUsageSummary'
import{makeTestPane}from'./pane-usage-test-helper'
test('free models do not connect to paid Go usage or warn',()=>{
 const go={provider:'opencode-go',state:'limited' as const,windows:[{window:'primary',usedPercent:100,resetsAt:null,checkedAt:null,limitReached:true,source:null}]}
 for(const modelId of['beam','glm-5.3-flash']){
  const pane={...makeTestPane('opencode',modelId),modelId,modelProvider:'opencode'}
  const w=evaluatePaneUsageWarning(pane,[go])
  assert.equal(w.hasWarning,false)
  assert.equal(w.isUnknown,true)
  assert.equal(paneUsageSummary(pane,[go]),null)
 }
})
