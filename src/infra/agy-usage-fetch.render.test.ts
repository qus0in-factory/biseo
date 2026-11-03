import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchAgyUsage } from './agy-usage-fetch.js'
import { putAgyTokenFile, agyTestEnv, agyQuotaBody, removeAgyTokenFile } from './agy-test-support.test-util.js'
import { checkAgyScenario } from './agy-scenario.test-util.js'

{

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
  } finally { globalThis.fetch = orig; removeAgyTokenFile(p) }
})
}
{

test('a 401 refreshes once and retries the quota endpoints', async () => {
  const p = putAgyTokenFile('agy129-retry', '2030-01-01')
  agyTestEnv(p)
  const orig = globalThis.fetch
  let grants = 0
  let phase = 0
  globalThis.fetch = (async (u: string) => {
    if (String(u).includes('token.example')) { grants += 1; return Response.json({ access_token: 'synthetic-new', expires_in: 3600 }) }
    phase += 1
    if (phase <= 2) return new Response('no', { status: 401 })
    return Response.json(agyQuotaBody(String(u)))
  }) as typeof fetch
  try {
    const res = await fetchAgyUsage(new Date('2026-10-30'))
    assert.equal(res.state, 'available')
    assert.ok(res.metrics.length)
    assert.equal(grants, 1)
  } finally { globalThis.fetch = orig; removeAgyTokenFile(p) }
})
}
{

const at = '2026-10-30T12:00:00Z'
const route = async (u: string) => {
  if (u.includes('token.example')) return Response.json({ access_token: 'n', expires_in: 3600 })
  return new Response('no', { status: 401 })
}

test('a 401 surviving the retry ends as expired', async () => {
  await checkAgyScenario('agy129-retry401', '2030-01-01', at, route, (res, grants) => {
    assert.equal(res.state, 'unknown')
    assert.equal(res.reason, 'agy_auth_expired')
    assert.deepEqual(res.metrics, [])
    assert.equal(grants.length, 1)
  })
})
}
