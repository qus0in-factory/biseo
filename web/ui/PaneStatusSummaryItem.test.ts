import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { PaneStatusSummaryItem } from './PaneStatusSummaryItem'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'

test('summary renders translated labels and counts', () => {
  for (const status of ['idle', 'working', 'done', 'blocked'] as const) {
    const out = renderToStaticMarkup(createElement(PaneStatusSummaryItem, { status, count: 1 }))
    assert.ok(out.includes(`${r[`status_${status}`]} 1`))
  }
})

test('input count uses warning text and retains label and count', () => {
  const html = render(h(PaneStatusSummaryItem, { status: 'input_required', count: 2 }))
  assert.match(html, /class="[^"]*text-warning/)
  assert.match(html, /입력 필요 2/)
})
