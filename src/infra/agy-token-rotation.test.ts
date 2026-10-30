import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchAgyUsage } from './agy-usage-fetch.js'
import { checkAgyScenario } from './agy-scenario.test-util.js'

const at = '2026-10-30T12:00:00Z'
const group = { groups: [{ displayName: 'P', buckets: [] }] }
const route = async (u: string, init: RequestInit | undefined, grants: string[]) => {
  if (u.includes('token.example')) return Response.json(grants.length > 1 ? { access_token: 'n2' } : { access_token: 'n1', expires_in: 60, refresh_token: 'next' })
  return Response.json(group)
}

test('a rotated refresh token wins over the stale file', async () => {
  await checkAgyScenario('agy129-rot', '2020-01-01', at, route, async (first, grants) => {
    const later = await fetchAgyUsage(new Date('2026-10-30T12:05:00Z'))
    assert.deepEqual([first.state, later.state], ['available', 'available'])
    assert.equal(grants.length, 2)
    assert.match(grants[1], /refresh_token=next/)
  })
})
