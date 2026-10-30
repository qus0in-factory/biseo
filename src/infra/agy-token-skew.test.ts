import test from 'node:test'
import assert from 'node:assert/strict'
import { checkAgyScenario } from './agy-scenario.test-util.js'
import { agyQuotaBody } from './agy-test-support.test-util.js'

const at = '2026-10-30T12:00:00Z'
const cases: Array<[string, number]> = [['2026-10-30T12:00:30Z', 1], ['2026-10-30T12:05:00Z', 0]]
const route = async (u: string) => {
  if (u.includes('token.example')) return Response.json({ access_token: 'n', expires_in: 3600 })
  return Response.json(agyQuotaBody(u))
}

for (const [expiry, expected] of cases) {
  test(`skew ${expiry} grants ${expected}`, async () => {
    await checkAgyScenario('agy129-skew', expiry, at, route, (res, grants) => {
      assert.equal(res.state, 'available')
      assert.equal(grants.length, expected)
    })
  })
}
