import test from 'node:test'
import assert from 'node:assert/strict'
import { renderPaneItem } from '../test-util/paneManageItem'
import { ollama } from '../test-util/paneManageItem'
import { observedPanes } from '../test-util/usage-panel-fixture'
import { panelProviders } from '../test-util/usage-panel-rows'
import { paneUsageLabel } from './paneUsageLabel'
test('initial unknown model and usage show matching progress',()=>{
 const out=renderPaneItem({agentKind:'opencode',agentName:'ds-o'})
 assert.match(out,/pane-manage-summary/)
 assert.match(out,/<span>opencode<\/span><span class="pane-manage-usage">확인 중<\/span>/)
 assert.doesNotMatch(out,/deepseek|ollama/)
})
test('a card without metadata still shows matching progress',()=>{
  assert.match(renderPaneItem({name:'bare'}),/>확인 중</)
})
test('the panel card summarizes harness, observed model, and usage',()=>{
 const out=renderPaneItem({agentKind:'opencode',agentName:'ds-o',modelId:'deepseek-v4.1-flash',modelProvider:'ollama'},ollama)
 assert.match(out,/<span>opencode · deepseek-v4\.1-flash<\/span><span class="pane-manage-usage">ollama 99%<\/span>/)
 assert.doesNotMatch(out,/ds-o ·/)
})
test('panels retain the observed model while usage arrives later', () => {
  const pane = observedPanes[0]
  const before = renderPaneItem(pane, [])
  assert.match(before, /opus-5\.5/)
  assert.match(before, /확인 중/)
  assert.doesNotMatch(before, /claude \d+%|모델 미확인/)
  assert.match(renderPaneItem(pane, panelProviders), /claude 39%/)
  assert.match(paneUsageLabel(pane, [], 'empty'), /사용량 미확인/)
  assert.match(paneUsageLabel(pane, [], 'error'), /사용량을 불러오지 못했습니다/)
})
