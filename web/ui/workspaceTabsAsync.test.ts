import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { listState } from '../domain/asyncListState'
import type { AsyncState } from '../domain/asyncState'
import type { WorkspaceSummary } from '../domain/ports'
import { WorkspaceTabs } from './WorkspaceTabs'
import r from '../resources.json'

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
