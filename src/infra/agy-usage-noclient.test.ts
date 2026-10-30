import test from 'node:test'
import assert from 'node:assert/strict'
import { rmSync } from 'node:fs'
import { fetchAgyUsage } from './agy-usage-fetch.js'
import { putAgyTokenFile, agyTestGroup } from './agy-test-support.js'

test('an expired file without a client id never calls the token endpoint', async () => {
  const p = putAgyTokenFile('agy129-noclient', '2020-01-01T00:00:00.000Z')
  process.env.BISEO_AGY_TOKEN_PATH = p
  process.env.BISEO_AGY_TOKEN_URL = 'https://token.example/o'
  delete process.env.BISEO_AGY_CLIENT_ID
  const orig = globalThis.fetch
  let tokens = 0
  globalThis.fetch = (async (u: string) => {
    if (String(u).includes('token.example')) tokens += 1
    return Response.json({ groups: [agyTestGroup] })
  }) as typeof fetch
  try {
    const res = await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))
    assert.equal(res.state, 'unknown')
    assert.equal(res.reason, 'agy_auth_expired')
    assert.equal(tokens, 0)
  } finally { globalThis.fetch = orig; rmSync(p) }
})
