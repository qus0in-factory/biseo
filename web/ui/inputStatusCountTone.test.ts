import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { PaneStatusSummaryItem } from './PaneStatusSummaryItem'
test('input count uses warning text and retains label and count', () => {
  const html = render(h(PaneStatusSummaryItem, { status: 'input_required', count: 2 }))
  assert.match(html, /class="[^"]*text-warning/)
  assert.match(html, /입력 필요 2/)
})
