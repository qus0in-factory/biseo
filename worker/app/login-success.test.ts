import test from 'node:test'
import assert from 'node:assert/strict'
import { login } from './login.js'
import { makeDeps } from './login-fixtures.js'

test('success returns token with injected claims', async () => {
  const deps = makeDeps(true)
  const res = await login(deps, 'pw')
  assert.deepEqual(res, { ok: true, token: 'T:a-user:iss:owner' })
})
