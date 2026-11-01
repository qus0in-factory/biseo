import assert from 'node:assert/strict'
import test from 'node:test'
import { pinEnv } from './pin-fixture.js'
import { pinPreferredBody, pinPreferredReq } from './pin-preferred-request.js'
import { IP } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

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
