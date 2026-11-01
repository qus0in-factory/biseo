import assert from 'node:assert/strict'
import test from 'node:test'
import { createTestFixture } from './helpers.js'
import { createZeroShotHarness } from './zero-shot-harness-fixture.js'
import { openZeroShotSse, postZeroShot } from './zero-shot-req-fixture.js'

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
