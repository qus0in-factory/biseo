import test from'node:test'
import assert from'node:assert/strict'
import{renderPaneItem,ollama}from'./paneManageItem.test-util'
test('the panel card summarizes harness, observed model, and usage',()=>{
 const out=renderPaneItem({agentKind:'opencode',agentName:'ds-o',modelId:'deepseek-v4.1-flash',modelProvider:'ollama'},ollama)
 assert.match(out,/<span>opencode · deepseek-v4\.1-flash<\/span><span class="pane-manage-usage">ollama 99%<\/span>/)
 assert.doesNotMatch(out,/ds-o ·/)
})
