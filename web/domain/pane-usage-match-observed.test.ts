import assert from'node:assert/strict'
import test from'node:test'
import{findMatchingUsage as f}from'./pane-usage-match'
import{makeTestPane as p}from'./pane-usage-test-helper'
import{testProviders as ps}from'./pane-usage-test-providers'
test('OpenCode uses the observed provider',()=>{
 assert.equal(f({...p('opencode'),modelProvider:'ollama'},ps)?.provider,'ollama')
 assert.equal(f({...p('opencode'),modelProvider:'codex'},ps)?.provider,'codex')
 assert.equal(f({...p('opencode'),modelProvider:'claude'},ps)?.provider,'claude')
 assert.equal(f({...p('opencode'),modelProvider:'opencode-go'},ps)?.provider,'opencode-go')
})
test('unknown observed provider never falls back to the tool',()=>{
 assert.equal(f({...p('opencode'),modelProvider:'opencode'},ps),null)
 assert.equal(f({...p('opencode'),modelProvider:'google'},ps),null)
 assert.equal(f(p('opencode'),ps),null)
})
