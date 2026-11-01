import assert from'node:assert/strict'
import test from'node:test'
import{paneUsageSummary}from'./paneUsageSummary'
import{makeTestPane}from'./pane-usage-test-helper'
import{prov,win}from'./paneUsageSummaryFixture.test-util'
test('lowest remaining window wins and ollama currency balance is included',()=>{
 const claude=[prov('claude',[win('primary',20),win('secondary',60)])]
 assert.deepEqual(paneUsageSummary(makeTestPane('claude'),claude),{provider:'claude',remaining:40})
 const ollama={...prov('ollama',[win('included_balance',null),win('purchased_balance',null)]),metrics:[
  {id:'included_balance',label:'i',unit:'currency',used:1.25,limit:60,remaining:58.75,resetsAt:null},
 ]}
 assert.deepEqual(paneUsageSummary({...makeTestPane('opencode'),modelProvider:'ollama'},[ollama]),{provider:'ollama',remaining:98})
 assert.equal(paneUsageSummary(makeTestPane('opencode'),[]),null)
 assert.equal(paneUsageSummary(makeTestPane('claude'),[{...claude[0],state:'unknown'}]),null)
})
