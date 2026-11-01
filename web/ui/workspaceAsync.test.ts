import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { WorkspacePickerView } from './WorkspacePickerView'
import { listState } from '../domain/asyncListState'
import r from '../resources.json'

test('workspace empty is success-only; failure has retry, not empty', () => {
 const render = (loading: boolean, error: string | null) => renderToStaticMarkup(createElement(WorkspacePickerView, {
  state: listState([], loading, error), current: null, loading, notice: null, onSelect() {}, onRetry() {},
 }))
 assert.ok(!render(true, null).includes(r.workspacesEmpty))
 assert.ok(render(false, null).includes(r.workspacesEmpty))
 const failed = render(false, 'connection_unavailable')
 assert.ok(!failed.includes(r.workspacesEmpty))
 assert.ok(failed.includes(r.workspacesError))
 assert.ok(failed.includes(r.retry))
})
