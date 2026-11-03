import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { listState } from '../domain/asyncListState'
import { WorkspaceTabs } from './WorkspaceTabs'
import r from '../resources.json'

test('switching keeps the tab list mounted without the inline refresh row', () => {
 const html = renderToStaticMarkup(createElement(WorkspaceTabs, {
  state: listState([{ workspaceId: 'w1' }, { workspaceId: 'w2', label: 'learn' }], true, null),
  current: 'w1', notice: null, busy: true, target: 'w2', onSelect() {}, onRetry() {},
 }))
 assert.ok(html.includes('learn'))
 assert.ok(!html.includes(r.workspaceSwitchPending))
 assert.ok(!html.includes(r.loading))
})
