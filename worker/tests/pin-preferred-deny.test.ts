import assert from 'node:assert/strict'
import test from 'node:test'
import { pinEnv } from './pin-fixture.js'
import { pinPreferredBody, pinPreferredReq } from './pin-preferred-request.js'
import { IP } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

test('untrusted IP and workers.dev never prefer PIN', async () => {
  const { env, db } = await pinEnv({
    PIN_ALLOWED_HOSTS: 'biseo.qus0in.dev,biseo.qus0in.workers.dev',
  })
  await seedTrusted(db, IP)
  await seedPin(db)
  const workers = 'https://biseo.qus0in.workers.dev/api/login/pin-preferred'
  assert.equal((await pinPreferredBody(await pinPreferredReq(env, IP, workers))).pinPreferred, false)
  assert.equal((await pinPreferredBody(await pinPreferredReq(env, '198.51.100.9'))).pinPreferred, false)
  assert.equal((await pinPreferredBody(await pinPreferredReq(env, null))).pinPreferred, false)
})
