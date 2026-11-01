import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
import {
  PIN_PREFERRED_URL,
  pinPreferredBody,
  pinPreferredReq,
} from './pin-preferred-request.js'
import { IP } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

test('internal calls and storage failures fail closed', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const internal = new Request(PIN_PREFERRED_URL, {
    headers: { 'CF-Connecting-IP': IP, 'CF-Worker': 'internal' },
  })
  assert.equal((await pinPreferredBody(await app.fetch(internal, env))).pinPreferred, false)
  const noDb = { ...env, BISEO_DB: undefined }
  assert.equal((await pinPreferredBody(await pinPreferredReq(noDb))).pinPreferred, false)
})
