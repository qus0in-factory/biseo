import assert from 'node:assert/strict'
import test from 'node:test'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { authHeaders, expectedPrompt, interrupt, limitBody } from './routes-interrupt-fixture.js'
import { relay, relayPath, withLimit } from './routes-interrupt-fetch-fixture.js'

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
