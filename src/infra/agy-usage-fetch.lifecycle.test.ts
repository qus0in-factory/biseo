import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchAgyUsage } from './agy-usage-fetch.js'
import { putAgyTokenFile, agyTestEnv, removeAgyTokenFile } from './test-util/agy-test-support.test-util.js'
import { isolatedAgy } from './test-util/agy-isolate.test-util.js'
import { checkAgyScenario } from './test-util/agy-scenario.test-util.js'
import { agyTestGroup } from './test-util/agy-test-support.test-util.js'
import { agyQuotaBody } from './test-util/agy-test-support.test-util.js'

{

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
    assert.deepEqual(res.metrics, [])
    assert.equal(grants, 1)
  } finally { globalThis.fetch = orig; removeAgyTokenFile(p) }
})
}
{

test('a rejected refresh yields unknown agy_auth_expired with no default metric', async () => {
  const p = putAgyTokenFile('agy129-expired', '2020-01-01T00:00:00.000Z')
  agyTestEnv(p)
  const orig = globalThis.fetch
  globalThis.fetch = (async () => new Response('no', { status: 400 })) as typeof fetch
  try {
    const res = await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))
    assert.equal(res.state, 'unknown')
    assert.equal(res.reason, 'agy_auth_expired')
    assert.deepEqual(res.metrics, [])
  } finally { globalThis.fetch = orig; removeAgyTokenFile(p) }
})
}
{

test('fetchAgyUsage parses live token or falls back to unknown', async () => {
  const res = await isolatedAgy(() => fetchAgyUsage(new Date('2026-10-30T10:00:00Z')))
  assert.equal(res.provider, 'agy')
  assert.ok(['available', 'limited', 'unknown'].includes(res.state))
})
}
{

const at = '2026-10-30T12:00:00Z'

test('an expired file without a client id never calls the token endpoint', async () => {
  const hits: string[] = []
  const route = (async (u: string) => {
    if (u.includes('token.example')) { hits.push(u); return new Response('no', { status: 400 }) }
    return Response.json({ groups: [agyTestGroup] })
  }) as typeof fetch
  process.env.BISEO_AGY_CLIENT_ID = ''
  try {
    await checkAgyScenario('agy129-noclient', '2020-01-01T00:00:00.000Z', at, route, (res) => {
      assert.equal(res.state, 'unknown')
      assert.equal(res.reason, 'agy_auth_expired')
      assert.deepEqual(res.metrics, [])
      assert.equal(hits.length, 0)
    })
  } finally { process.env.BISEO_AGY_CLIENT_ID = 'id' }
})
}
{

const at = '2026-10-30T12:00:00Z'
const valid = { buckets: [{ modelId: 'gemini-3-pro', bucketId: 'b', remainingFraction: 1 }] }
const route = async (u: string, init?: RequestInit) => {
  if (u.includes('token.example')) return Response.json({ access_token: 'n', expires_in: 3600 })
  const auth = String((init?.headers as Record<string, string>)?.Authorization ?? '')
  if (!auth.endsWith('n')) return u.includes('retrieveUserQuotaSummary') ? new Response('no', { status: 401 }) : Response.json(valid)
  return Response.json(agyQuotaBody(u))
}

test('one-sided 401 still refreshes once and retries', async () => {
  await checkAgyScenario('agy129-partial', '2030-01-01', at, route, (res, grants) => {
    assert.equal(res.state, 'available')
    assert.ok(res.metrics.length > 0)
    assert.equal(grants.length, 1)
  })
})
}
