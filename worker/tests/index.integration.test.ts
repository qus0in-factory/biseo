import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestFixture } from '../test-util/helpers.js';
import { createZeroShotHarness } from '../test-util/zero-shot-harness-fixture.js';
import { openZeroShotSse, postZeroShot } from '../test-util/zero-shot-req-fixture.js';
import { ZERO_SHOT_REPLY } from '../test-util/zero-shot-record-fixture.js';
import { waitCompletedTurn } from '../test-util/zero-shot-sse-fixture.js';

test('zero-shot auth blocks missing cookie and mismatched service PASETO', async () => {
  const h = await createZeroShotHarness()
  try {
    assert.equal((await postZeroShot(h.env)).status, 401)
    assert.equal((await openZeroShotSse(h.env)).status, 401)
    const wrong = await createTestFixture()
    const badEnv = { ...h.env, SERVICE_PASETO_SECRET: wrong.secretKeyStr }
    const res=await postZeroShot(badEnv,h.cookie)
    assert.equal(res.status,202)
    assert.equal((await res.json() as any).errorCode,'target_unclear')
    assert.equal(h.getPromptCalls(), 0)
  } finally {
    await h.cleanup()
  }
})

test('zero-shot composed flow: 202, SSE reply 2, single prompt, no polling', async () => {
  const h = await createZeroShotHarness()
  try {
    const sse = await openZeroShotSse(h.env, h.cookie)
    assert.equal(sse.status, 200)
    assert.ok(sse.body)
    const post = await postZeroShot(h.env, h.cookie)
    assert.equal(post.status, 202)
    const done = await waitCompletedTurn(sse.body, 'zs-1')
    assert.equal(done.responseText, ZERO_SHOT_REPLY)
    assert.match(done.responseText ?? '', /2/)
    assert.equal(h.getPromptCalls(), 1)
    assert.equal(h.getTurnGets(), 0)
  } finally {
    await h.cleanup()
  }
})
