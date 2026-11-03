import assert from 'node:assert/strict'
import test from 'node:test'
import { paneUsageSummary as s } from './paneUsageSummary'
import { makeTestPane as p } from '../test-util/pane-usage-test-helper'
import { percent } from '../test-util/paneUsageSummaryFixture'
import type { UsageProvider } from './usage'
import { paneUsageSummary } from './paneUsageSummary'
import { makeTestPane } from '../test-util/pane-usage-test-helper'
import { prov } from '../test-util/paneUsageSummaryFixture'
import { win } from '../test-util/paneUsageSummaryFixture'

const agy:UsageProvider={provider:'agy',state:'available',windows:[],metrics:[
 percent('gemini:pool:gemini-5h',8),percent('gemini:pool:gemini-weekly',22),percent('claude-gpt:pool:claude-weekly',99),
]}
test('an agy summary only uses the observed model pool',()=>{
 assert.deepEqual(s({...p('agy'),modelId:'gemini-3.8-flash',modelProvider:'agy'},[agy]),{provider:'agy',remaining:78})
})
test('an agy summary is omitted when the model is unknown',()=>{
 assert.equal(s({...p('agy'),modelProvider:'agy'},[agy]),null)
})
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
