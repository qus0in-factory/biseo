import test from 'node:test'
import assert from 'node:assert/strict'
import { checkAgyScenario } from './agy-scenario.test-util.js'

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
