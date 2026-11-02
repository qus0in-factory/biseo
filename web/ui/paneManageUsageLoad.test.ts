import assert from 'node:assert/strict'
import test from 'node:test'
import { observedPanes } from '../domain/usage-panel-fixture.test-util'
import { panelProviders } from '../domain/usage-panel-rows.test-util'
import { renderPaneItem } from './paneManageItem.test-util'
import { paneUsageLabel } from './paneUsageLabel'

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
