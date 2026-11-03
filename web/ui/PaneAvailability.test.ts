import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneAvailability } from './PaneAvailability'
import { PaneMeta } from './PaneMeta'
import { makeTestPane } from '../test-util/pane-usage-test-helper'

test('unknown availability renders no question mark icon on pane cards', () => {
  const unknown = { state: 'unknown' as const, source: null, checkedAt: null, resetsAt: null, reason: null, window: null }
  assert.equal(renderToStaticMarkup(createElement(PaneAvailability, { availability: unknown })), '')
  const pane = { ...makeTestPane('claude', 'opus'), modelId: 'opus-5.5', availability: unknown }
  const html = renderToStaticMarkup(createElement(PaneMeta, { item: pane }))
  assert.doesNotMatch(html, /lucide-circle-question-mark|lucide-help-circle|제공자 사용량 한도를 확인할 수 없습니다/)
})
