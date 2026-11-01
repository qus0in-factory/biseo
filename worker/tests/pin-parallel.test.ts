import assert from 'node:assert/strict'
import test from 'node:test'
import { pinEnv } from './pin-fixture.js'
import { IP, postPin } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

test('parallel wrong PINs never succeed and still lock the IP', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const results = await Promise.all(
    Array.from({ length: 12 }, () => postPin(env, '000000')),
  )
  const codes = results.map((r) => r.status)
  assert.equal(codes.includes(200), false)
  assert.ok(codes.includes(429))
  const row = await db
    .prepare('SELECT locked_until FROM pin_attempts WHERE scope=?')
    .bind(`ip:${IP}`)
    .first<{ locked_until: number }>()
  assert.ok(row && row.locked_until > 0)
})
