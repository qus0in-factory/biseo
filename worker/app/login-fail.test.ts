import test from 'node:test'
import assert from 'node:assert/strict'
import { login } from './login.js'
import { makeDeps } from './login-fixtures.js'

test('wrong or missing password gives fixed failure', async () => {
  for (const p of [undefined, '', 42, 'bad']) {
    assert.deepEqual(await login(makeDeps(false), p), { ok: false })
  }
})

test('missing stored verifier fails', async () => {
  const deps = makeDeps(true, { storedVerifier: '' })
  assert.deepEqual(await login(deps, 'pw'), { ok: false })
})

test('verifier or signer errors never leak', async () => {
  const boom = async () => {
    throw new Error('secret-xyz')
  }
  const badV = makeDeps(true, { verifier: { verify: boom } })
  const badS = makeDeps(true, { signer: { sign: boom } })
  assert.deepEqual(await login(badV, 'pw'), { ok: false })
  assert.deepEqual(await login(badS, 'pw'), { ok: false })
})
