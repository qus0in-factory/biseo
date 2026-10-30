import test from 'node:test'
import assert from 'node:assert/strict'
import { checkAgyScenario } from './agy-scenario.test-util.js'
import { agyQuotaBody } from './agy-test-support.test-util.js'

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
