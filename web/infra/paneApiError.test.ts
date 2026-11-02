import test from 'node:test'
import assert from 'node:assert/strict'
import { HTTPError } from 'ky'
import { apiErrorCode } from './paneApiError'

test('reads the error code from an HTTP response body', () => {
  const response = new Response(JSON.stringify({ error: 'pane_busy' }), {
    status: 409,
    headers: { 'content-type': 'application/json' },
  })
  const error = new HTTPError(response, new Request('http://localhost/api/panes/w:p1'), {} as never)
  error.data = { error: 'pane_busy' }
  assert.equal(apiErrorCode(error), 'pane_busy')
  assert.equal(apiErrorCode(new Error('network')), null)
})
