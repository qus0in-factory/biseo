import test from'node:test'
import assert from'node:assert/strict'
import{renderPaneItem}from'./paneManageItem.test-util'
test('initial unknown model and usage show matching progress',()=>{
 const out=renderPaneItem({agentKind:'opencode',agentName:'ds-o'})
 assert.match(out,/pane-manage-summary/)
  assert.match(out,/>opencode · 확인 중</)
 assert.doesNotMatch(out,/deepseek|ollama/)
})
test('a card without metadata still shows matching progress',()=>{
  assert.match(renderPaneItem({name:'bare'}),/>확인 중</)
})
