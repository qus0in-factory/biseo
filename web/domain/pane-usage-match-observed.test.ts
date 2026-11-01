import assert from'node:assert/strict'
import test from'node:test'
import{findMatchingUsage}from'./pane-usage-match'
import{makeTestPane}from'./pane-usage-test-helper'
import{testProviders}from'./pane-usage-test-providers'
test('OpenCode uses the observed provider',()=>{
 for(const k of['ollama','codex','claude','opencode-go'])
  assert.equal(findMatchingUsage({...makeTestPane('opencode'),modelProvider:k},testProviders)?.provider,k)
})
test('unknown observed provider never falls back to the tool',()=>{
 for(const k of['opencode','google'])
  assert.equal(findMatchingUsage({...makeTestPane('opencode'),modelProvider:k},testProviders),null)
 assert.equal(findMatchingUsage(makeTestPane('opencode'),testProviders),null)
})
