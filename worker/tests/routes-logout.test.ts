import assert from 'node:assert/strict'
import test from 'node:test'
import { createAuthedEnv } from './auth-helpers.js'
import { parseCookieAttrs, postJson } from './cookie-helpers.js'

test('POST /api/logout clears cookie with symmetric attributes', async () => {
  const { env, password } = await createAuthedEnv()
  const cEnv = { ...env, COOKIE_DOMAIN: 'example.com', COOKIE_SAME_SITE: 'Strict' as const }
  const inRes = await postJson('/api/login', { password }, cEnv)
  const outRes = await postJson('/api/logout', undefined, cEnv)
  assert.equal(outRes.status, 200)

  const cIn = parseCookieAttrs(inRes.headers.get('set-cookie') || '')
  const cOut = parseCookieAttrs(outRes.headers.get('set-cookie') || '')
  assert.equal(cOut.name, cIn.name)
  for (const a of ['path', 'domain', 'secure', 'httponly', 'samesite']) {
    assert.equal(cOut.attrs.get(a), cIn.attrs.get(a))
  }
  assert.equal(cOut.attrs.get('max-age'), '0')
})
