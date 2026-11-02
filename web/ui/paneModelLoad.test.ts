import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneModel, paneModelLabel } from './PaneModel'
import { observedPanes } from '../domain/usage-panel-fixture.test-util'

test('missing model distinguishes matching in progress from completed unknown', () => {
  const render = () => renderToStaticMarkup(createElement(PaneModel, {
    item: { ...observedPanes[0], modelId: null },
  }))
  assert.match(render(), /확인 중/)
  assert.doesNotMatch(render(), /모델 미확인/)
  assert.equal(paneModelLabel({ ...observedPanes[0], modelId: null }, false), '모델 미확인')
})
