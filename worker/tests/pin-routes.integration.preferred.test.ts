import assert from 'node:assert/strict'
import test from 'node:test'
import { pinEnv } from '../test-util/pin-fixture.js'
import { pinPreferredBody, pinPreferredReq } from '../test-util/pin-preferred-request.js'
import { IP } from '../test-util/pin-request.js'
import { seedPin, seedTrusted } from '../test-util/pin-seed.js'

test('only a trusted IP with a configured PIN prefers PIN', async () => {
  const { env, db } = await pinEnv()
  assert.equal((await pinPreferredBody(await pinPreferredReq(env))).pinPreferred, false)
  await seedTrusted(db, IP)
  assert.equal((await pinPreferredBody(await pinPreferredReq(env))).pinPreferred, false)
  await seedPin(db)
  const r = await pinPreferredReq(env)
  assert.deepEqual(await pinPreferredBody(r), { pinPreferred: true })
  assert.equal(r.headers.get('cache-control'), 'no-store')
})
