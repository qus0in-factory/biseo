import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CollapsedPaneCountControl } from './CollapsedPaneCountControl.js'

test('renders count and disables at bounds', () => {
  const html = renderToStaticMarkup(createElement(CollapsedPaneCountControl, { count: 1, onDecrease: () => {}, onIncrease: () => {}, canDecrease: false, canIncrease: true }))
  assert.match(html, /aria-label="접힌 패널 표시 개수 줄이기"/)
  assert.match(html, /disabled/)
  assert.match(html, />1</)
})

test('touch targets are 44px', () => {
  const html = renderToStaticMarkup(createElement(CollapsedPaneCountControl, { count: 2, onDecrease: () => {}, onIncrease: () => {}, canDecrease: true, canIncrease: true }))
  assert.match(html, /min-h-11 min-w-11/)
})
