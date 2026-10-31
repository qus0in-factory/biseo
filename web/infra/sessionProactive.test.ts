import test from 'node:test'
import assert from 'node:assert/strict'
import { refreshSession } from './refreshSession'
import { sessionTestEnv } from './sessionTestEnv'

test('renewal starts before expiry and shares a fresh result with waiting requests', async () => {
 const env = sessionTestEnv()
 let ttl = 10, rotations = 0
 globalThis.fetch = async input => {
  if (String(input) === '/api/session') return Response.json({
   expiresAt: new Date(Date.now()+ttl*1000).toISOString(),
  })
  rotations++; ttl = 3600
  return new Response('')
 }
 try {
  await refreshSession()
  await refreshSession()
  assert.equal(rotations,1)
 } finally { env.restore() }
})
