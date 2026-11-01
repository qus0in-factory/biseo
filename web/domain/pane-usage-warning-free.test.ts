import assert from'node:assert/strict'
import test from'node:test'
import{evaluatePaneUsageWarning as e}from'./pane-usage-warning'
import{makeTestPane as p}from'./pane-usage-test-helper'
test('free OpenCode does not borrow Go usage',()=>{
 const pane={...p('opencode','glm'),modelProvider:'opencode'}
 const go={provider:'opencode-go',state:'limited' as const,windows:[{window:'primary',usedPercent:100,resetsAt:null,checkedAt:null,limitReached:false,source:null}]}
 assert.equal(e(pane,[go]).hasWarning,false)
})
