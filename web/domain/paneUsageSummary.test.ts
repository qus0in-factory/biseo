import assert from'node:assert/strict'
import test from'node:test'
import{paneUsageSummary as s}from'./paneUsageSummary'
import{makeTestPane as p}from'./pane-usage-test-helper'
import{prov,win}from'./paneUsageSummaryFixture.test-util'
test('the lowest remaining window of the matched provider wins',()=>{
 assert.deepEqual(s({...p('claude'),modelId:'opus-5.5'},[prov('claude',[win('primary',20),win('secondary',60)])]),{provider:'claude',remaining:40})
})
test('ollama included balance contributes its remaining share',()=>{
 assert.deepEqual(s({...p('opencode'),modelProvider:'ollama'},[prov('ollama',[win('included_balance',1),win('purchased_balance',null)])]),{provider:'ollama',remaining:99})
})
test('unknown providers and empty rows are omitted',()=>{
 assert.equal(s(p('opencode'),[]),null)
 assert.equal(s({...p('claude'),modelId:'opus-5.5'},[{provider:'claude',state:'unknown',windows:[win('primary',20)]}]),null)
})
