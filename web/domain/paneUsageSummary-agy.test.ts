import assert from'node:assert/strict'
import test from'node:test'
import{paneUsageSummary as s}from'./paneUsageSummary'
import{makeTestPane as p}from'./pane-usage-test-helper'
import{percent}from'./paneUsageSummaryFixture.test-util'
import type{UsageProvider}from'./usage'
const agy:UsageProvider={provider:'agy',state:'available',windows:[],metrics:[
 percent('gemini:pool:gemini-5h',8),percent('gemini:pool:gemini-weekly',22),percent('claude-gpt:pool:claude-weekly',99),
]}
test('an agy summary only uses the observed model pool',()=>{
 assert.deepEqual(s({...p('agy'),modelId:'gemini-3.8-flash',modelProvider:'agy'},[agy]),{provider:'agy',remaining:78})
})
test('an agy summary is omitted when the model is unknown',()=>{
 assert.equal(s({...p('agy'),modelProvider:'agy'},[agy]),null)
})
