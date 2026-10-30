import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchAgyUsage } from './agy-usage-fetch.js'
import { checkAgyScenario } from './agy-scenario.test-util.js'
import { agyQuotaBody } from './agy-test-support.test-util.js'

const at = '2026-10-30T12:00:00Z'
const route = async (u: string) => {
  if (u.includes('token.example')) return Response.json({ access_token: 'n' })
  return Response.json(agyQuotaBody(u))
}

test('a refresh without expiry stays usable but is not pinned', async () => {
  await checkAgyScenario('agy129-noexp', '2020-01-01', at, route, async (first, grants) => {
    const later = await fetchAgyUsage(new Date(at))
    assert.deepEqual([first.state, later.state], ['available', 'available'])
    assert.equal(grants.length, 2)
  })
})
