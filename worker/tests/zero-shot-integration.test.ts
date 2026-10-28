import assert from 'node:assert/strict'
import test from 'node:test'
import { createZeroShotHarness } from './zero-shot-harness-fixture.js'
import { ZERO_SHOT_REPLY } from './zero-shot-record-fixture.js'
import { openZeroShotSse, postZeroShot } from './zero-shot-req-fixture.js'
import { waitCompletedTurn } from './zero-shot-sse-fixture.js'

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
