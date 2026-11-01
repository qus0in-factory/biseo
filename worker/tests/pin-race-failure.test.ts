import assert from 'node:assert/strict'
import test from 'node:test'
import { pinLogin } from '../app/pin-login.js'
import { createPinDeps } from '../ui/pin-deps.js'
import { pinEnv } from './pin-fixture.js'
import { IP } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

test('parallel attempts reserve before PIN verification', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const deps = (await createPinDeps(env, IP))!
  let started = 0
  let release!: () => void
  const gate = new Promise<void>(r => { release = r })
  deps.verifier = { async verify() { started++; await gate; return false } }
  const requests = Array.from({ length: 12 }, () => pinLogin(deps, '000000'))
  await new Promise(resolve => setTimeout(resolve, 50))
  try { assert.equal(started, 5) } finally { release() }
  await Promise.all(requests)
})
