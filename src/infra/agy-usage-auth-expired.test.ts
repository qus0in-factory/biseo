import test from 'node:test'
import assert from 'node:assert/strict'
import { rmSync } from 'node:fs'
import { fetchAgyUsage } from './agy-usage-fetch.js'
import { putAgyTokenFile, agyTestEnv } from './agy-test-support.js'

test('a 401 after a refresh is not refreshed again', async () => {
  const p = putAgyTokenFile('agy129-auth-expired', '2020-01-01T00:00:00.000Z')
  agyTestEnv(p)
  const orig = globalThis.fetch
  let grants = 0
  globalThis.fetch = (async (u: string) => {
    if (String(u).includes('token.example')) { grants += 1; return Response.json({ access_token: 'synthetic-new', expires_in: 3600 }) }
    return new Response('no', { status: 401 })
  }) as typeof fetch
  try {
    const res = await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))
    assert.equal(res.state, 'unknown')
    assert.equal(res.reason, 'agy_auth_expired')
    assert.equal(grants, 1)
  } finally { globalThis.fetch = orig; rmSync(p) }
})
