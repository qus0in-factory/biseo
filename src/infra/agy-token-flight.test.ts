import test from 'node:test'
import assert from 'node:assert/strict'
import { rmSync } from 'node:fs'
import { fetchAgyUsage } from './agy-usage-fetch.js'
import { putAgyTokenFile, agyTestEnv, agyQuotaBody } from './agy-test-support.test-util.js'

test('concurrent callers share a single grant', async () => {
  const p = putAgyTokenFile('agy129-fl', '2020-01-01T00:00:00.000Z')
  agyTestEnv(p)
  const orig = globalThis.fetch
  let grants = 0
  globalThis.fetch = (async (u: string) => {
    if (u.includes('token.example')) { grants += 1; return Response.json({ access_token: 'n', expires_in: 3600 }) }
    return Response.json(agyQuotaBody(u))
  }) as typeof fetch
  try {
    const at = new Date('2026-10-30T12:00:00Z')
    const [a, b] = await Promise.all([fetchAgyUsage(at), fetchAgyUsage(at)])
    assert.deepEqual([a.state, b.state], ['available', 'available'])
    assert.equal(grants, 1)
  } finally { globalThis.fetch = orig; rmSync(p) }
})
