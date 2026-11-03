import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneStatusSummaryItem } from './PaneStatusSummaryItem.js'
import { statusAccentColor } from './paneStatusBadgeStyle.js'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
const statuses = ['idle', 'working', 'done', 'blocked'] as const
const labels = ['대기', '실행 중', '완료', '차단됨']

test('summary labels match pane badge colors', () => {
  for (const [i, status] of statuses.entries()) {
    const out = renderToStaticMarkup(createElement(PaneStatusSummaryItem, { status, count: 1 }))
    const item = `<span class="font-semibold" style="color:${statusAccentColor(status)}">${labels[i]} 1</span>`
    assert.ok(out.includes(item), item)
  }
})
test('input count uses warning text and retains label and count', () => {
  const html = render(h(PaneStatusSummaryItem, { status: 'input_required', count: 2 }))
  assert.match(html, /class="[^"]*text-warning/)
  assert.match(html, /입력 필요 2/)
})
