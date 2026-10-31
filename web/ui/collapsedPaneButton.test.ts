import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CollapsedPaneButton } from './CollapsedPaneButton'
import { makeTestPane } from '../domain/pane-usage-test-helper'
test('compact panel uses initial, full accessible name, and selected styling, never ID', () => {
 const html = renderToStaticMarkup(createElement(CollapsedPaneButton, {
  pane: {...makeTestPane('agy','Gemini worker'),paneId:'w1X:p3'}, selected:true, onSelect() {},
 }))
 assert.match(html, />G<\/button>/)
 assert.match(html, /title="Gemini worker"/)
 assert.match(html, /aria-label="Gemini worker"/)
 assert.match(html, /aria-pressed="true"/)
 assert.match(html, /overflow-hidden/)
 assert.doesNotMatch(html, /w1X:p3/)
})
