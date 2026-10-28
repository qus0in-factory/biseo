import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'

test('POST /api/login fails-closed on missing secret', async () => {
  const req = new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'any' }),
  })
  const res = await app.fetch(req, {})
  assert.equal(res.status, 500)
  assert.deepEqual(await res.json(), { error: 'misconfigured' })
})
