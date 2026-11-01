import test from'node:test'
import assert from'node:assert/strict'
import{renderPaneItem}from'./paneManageItem.test-util'
test('unknown model and usage parts are omitted',()=>{
 const out=renderPaneItem({agentKind:'opencode',agentName:'ds-o'})
 assert.match(out,/pane-manage-summary/)
 assert.match(out,/>opencode</)
 assert.doesNotMatch(out,/deepseek|ollama/)
})
test('a card without any known metadata has no summary line',()=>{
 assert.doesNotMatch(renderPaneItem({name:'bare'}),/pane-manage-summary/)
})
