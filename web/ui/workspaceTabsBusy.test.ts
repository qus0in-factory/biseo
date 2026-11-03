import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { listState } from '../domain/asyncListState'
import { WorkspaceTabs } from './WorkspaceTabs'
import r from '../resources.json'

test('a pending tab shows immediate busy text and disables every tab', () => {
 const html = renderToStaticMarkup(createElement(WorkspaceTabs, {
  state: listState([
   { workspaceId: 'w1', label: 'biseo' },
   { workspaceId: 'w2', label: 'learn' },
  ], false, null),
  current: 'w1', notice: null, busy: true, target: 'w2', onSelect() {}, onRetry() {},
 }))
 assert.match(html, /aria-busy="true"/)
 assert.ok(!html.includes(r.workspaceSwitchPending))
 assert.match(html, /disabled=""/)
})
