import test from 'node:test'
import assert from 'node:assert/strict'
import { rmSync } from 'node:fs'
import { fetchAgyUsage } from './agy-usage-fetch.js'
import { putAgyTokenFile, agyTestEnv, agyQuotaBody } from './agy-test-support.js'

test('an expired file token refreshes once and returns metrics', async () => {
  const p = putAgyTokenFile('agy129-refresh', '2020-01-01')
  agyTestEnv(p)
  const orig = globalThis.fetch
  let grants = 0
  globalThis.fetch = (async (u: string) => {
    if (String(u).includes('token.example')) { grants += 1; return Response.json({ access_token: 'synthetic-new', expires_in: 3600 }) }
    return Response.json(agyQuotaBody(String(u)))
  }) as typeof fetch
  try {
    const res = await fetchAgyUsage(new Date('2026-10-30'))
    assert.equal(res.state, 'available')
    assert.ok(res.metrics.length)
    assert.equal(grants, 1)
  } finally { globalThis.fetch = orig; rmSync(p) }
})
