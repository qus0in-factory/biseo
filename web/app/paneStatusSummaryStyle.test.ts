import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneStatusSummaryItem } from '../ui/PaneStatusSummaryItem.js'
import { statusAccentColor } from '../ui/paneStatusBadgeStyle.js'

const statuses = ['idle', 'working', 'done', 'blocked'] as const
const labels = ['대기', '실행 중', '완료', '차단됨']

test('summary labels match pane badge colors', () => {
  for (const [i, status] of statuses.entries()) {
    const out = renderToStaticMarkup(createElement(PaneStatusSummaryItem, { status, count: 1 }))
    const item = `<span class="font-semibold" style="color:${statusAccentColor(status)}">${labels[i]} 1</span>`
    assert.ok(out.includes(item), item)
  }
})
