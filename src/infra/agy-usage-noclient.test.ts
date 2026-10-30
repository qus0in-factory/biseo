import test from 'node:test'
import assert from 'node:assert/strict'
import { checkAgyScenario } from './agy-scenario.test-util.js'
import { agyTestGroup } from './agy-test-support.test-util.js'

const at = '2026-10-30T12:00:00Z'

test('an expired file without a client id never calls the token endpoint', async () => {
  const hits: string[] = []
  const route = (async (u: string) => {
    if (u.includes('token.example')) { hits.push(u); return new Response('no', { status: 400 }) }
    return Response.json({ groups: [agyTestGroup] })
  }) as typeof fetch
  process.env.BISEO_AGY_CLIENT_ID = ''
  await checkAgyScenario('agy129-noclient', '2020-01-01T00:00:00.000Z', at, route, (res) => {
    assert.equal(res.state, 'unknown')
    assert.equal(res.reason, 'agy_auth_expired')
    assert.deepEqual(res.metrics, [])
    assert.equal(hits.length, 0)
  })
})
