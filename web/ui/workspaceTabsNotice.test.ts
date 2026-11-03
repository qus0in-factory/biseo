import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { listState } from '../domain/asyncListState'
import { WorkspaceTabs } from './WorkspaceTabs'
import r from '../resources.json'

test('a missing or failed selection keeps its alert', () => {
 const html = renderToStaticMarkup(createElement(WorkspaceTabs, {
  state: listState([], false, null), current: null, notice: r.workspaceUnavailable,
  busy: false, target: null, onSelect() {}, onRetry() {},
 }))
 assert.ok(html.includes(r.workspaceUnavailable))
 assert.ok(html.includes('role="alert"'))
})
