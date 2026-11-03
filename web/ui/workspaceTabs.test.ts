import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { listState } from '../domain/asyncListState'
import { WorkspaceTabs } from './WorkspaceTabs'
import r from '../resources.json'

test('the one-step selector lists every workspace with current and focus labels', () => {
 const html = renderToStaticMarkup(createElement(WorkspaceTabs, {
  state: listState([
   { workspaceId: 'w1', label: 'biseo', focused: true },
   { workspaceId: 'w2', label: 'learn' },
  ], false, null),
  current: 'w1', notice: null, busy: false, target: null, onSelect() {}, onRetry() {},
 }))
 assert.match(html, /role="group"/)
 assert.ok(html.includes('biseo'))
 assert.ok(html.includes('learn'))
 assert.match(html, /aria-current="true"/)
 assert.ok(html.includes(r.workspaceSelected))
 assert.ok(html.includes(r.workspaceFocused))
})
