import assert from 'node:assert/strict';
import test from 'node:test';
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js';
import { enforcement } from '../test-util/routes-interrupt-enforcement-fixture.js';
import { authHeaders, expectedPrompt, interrupt, limitBody } from '../test-util/routes-interrupt-fixture.js';
import { relay, relayPath, withLimit } from '../test-util/routes-interrupt-fetch-fixture.js';

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

test('worker relays Esc and upstream usage-limit conflicts', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const headers = authHeaders(cookie)
  await relay(async (seen) => {
    const ok = await interrupt(env, 'w1T:p1', 'escape', headers)
    assert.equal(ok.status, 200)
    assert.equal(seen.req!.method, 'POST')
    assert.equal(new URL(seen.req!.url).pathname, relayPath)
    assert.deepEqual(await seen.req!.json(), expectedPrompt)
    await withLimit(async () => {
      const limited = await interrupt(env, 'w1T:p1', 'esc', headers)
      assert.equal(limited.status, 409)
      assert.deepEqual(await limited.json(), limitBody)
    })
  })
})
