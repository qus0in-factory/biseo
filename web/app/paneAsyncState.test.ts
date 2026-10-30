import assert from 'node:assert/strict'
import test from 'node:test'
import type { PaneSummary } from '../domain/timeline'
import { dataOf, readyState } from '../domain/asyncState'
import { paneOfflineState } from './paneAsyncState.js'

const pane: PaneSummary = {
  paneId: 'w1:p1',
  name: 'p',
  status: 'idle',
  sendable: true,
  disabledReason: null,
}

test('offline keeps panes and marks them unsendable', () => {
  const state = paneOfflineState(readyState([pane]))
  assert.equal(state.status, 'error')
  assert.equal(dataOf(state)?.[0]?.sendable, false)
  assert.equal(dataOf(state)?.[0]?.disabledReason, 'connection_unavailable')
})
