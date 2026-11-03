import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { listState } from '../domain/asyncListState'
import { WorkspaceTabs } from './WorkspaceTabs'
import r from '../resources.json'
import type { AsyncState } from '../domain/asyncState'
import type { WorkspaceSummary } from '../domain/ports'

test('the tab strip lists every workspace and marks the current one', () => {
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
 assert.ok(!html.includes('워크스페이스:'))
 assert.ok(!html.includes(r.workspaceSelected))
 assert.ok(!html.includes(r.workspaceFocused))
 assert.doesNotMatch(r.workspaceSwitchHint, /Herdr/)
})
const render = (state: AsyncState<WorkspaceSummary[]>) =>
 renderToStaticMarkup(createElement(WorkspaceTabs, {
  state, current: null, notice: null, busy: false, target: null, onSelect() {}, onRetry() {},
 }))

test('empty is success-only and failure offers retry instead of empty', () => {
 assert.ok(!render(listState([], true, null)).includes(r.workspacesEmpty))
 assert.ok(render(listState([], false, null)).includes(r.workspacesEmpty))
 const failed = render(listState([], false, 'connection_unavailable'))
 assert.ok(!failed.includes(r.workspacesEmpty))
 assert.ok(failed.includes(r.workspacesError))
 assert.ok(failed.includes(r.retry))
})
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
test('a missing or failed selection keeps its alert', () => {
 const html = renderToStaticMarkup(createElement(WorkspaceTabs, {
  state: listState([], false, null), current: null, notice: r.workspaceUnavailable,
  busy: false, target: null, onSelect() {}, onRetry() {},
 }))
 assert.ok(html.includes(r.workspaceUnavailable))
 assert.ok(html.includes('role="alert"'))
})
test('switching keeps the tab list mounted without the inline refresh row', () => {
 const html = renderToStaticMarkup(createElement(WorkspaceTabs, {
  state: listState([{ workspaceId: 'w1' }, { workspaceId: 'w2', label: 'learn' }], true, null),
  current: 'w1', notice: null, busy: true, target: 'w2', onSelect() {}, onRetry() {},
 }))
 assert.ok(html.includes('learn'))
 assert.ok(!html.includes(r.workspaceSwitchPending))
 assert.ok(!html.includes(r.loading))
})
