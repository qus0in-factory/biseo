import test from 'node:test'
import assert from 'node:assert/strict'
import { PaneCloseError, paneCloseMessage } from './paneCloseError'
import r from '../resources.json'

test('close error codes map to resource messages, not raw codes', () => {
  const cases: [string, string][] = [
    ['pane_busy', r.paneCloseBusy],
    ['pane_inflight', r.paneCloseInFlight],
    ['pending_reservations', r.paneClosePending],
    ['pane_not_found', r.paneCloseNotFound],
    ['workspace_not_allowed', r.paneCloseForbidden],
  ]
  for (const [code, message] of cases) {
    assert.equal(paneCloseMessage(new PaneCloseError(code)), message)
    assert.notEqual(paneCloseMessage(new PaneCloseError(code)), code)
  }
  assert.equal(paneCloseMessage(new PaneCloseError('unknown')), r.connection_unavailable)
  assert.equal(paneCloseMessage(new Error('connection_unavailable')), r.connection_unavailable)
})
