import assert from 'node:assert/strict'
import test from 'node:test'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { enforcement } from './routes-interrupt-enforcement-fixture.js'

test('POST /api/panes/:paneId/interrupt enforces Origin and workspace prefix', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const { badOrigin, other, badKey, noAuth } = await enforcement(env, cookie)
  assert.equal(badOrigin.status, 403)
  assert.deepEqual(await badOrigin.json(), { error: 'forbidden', reason: 'origin_not_allowed' })
  assert.equal(other.status, 403)
  assert.deepEqual(await other.json(), { error: 'forbidden', reason: 'workspace_not_allowed' })
  assert.equal(badKey.status, 400)
  assert.equal(noAuth.status, 401)
})
