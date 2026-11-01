import test from 'node:test'
import assert from 'node:assert/strict'
import { refreshSession } from './refreshSession'
import { sessionTestEnv } from './sessionTestEnv'

test('concurrent requests share one refresh and preserve UI on transient failure', async () => {
 const env = sessionTestEnv()
 let refreshed = 0, expired = 0, status = 503
 env.target.addEventListener('biseo-session-expired',() => expired++)
 globalThis.fetch = async input => {
  if (String(input) === '/api/session') return new Response('',{status:401})
  refreshed++
  return new Response('',{status})
 }
 try {
  await Promise.all([refreshSession(),refreshSession()].map(p => assert.rejects(p)))
  assert.equal(refreshed,1)
  assert.equal(expired,0)
  status = 200
  await Promise.all([refreshSession(),refreshSession()])
  assert.equal(refreshed,2)
  status = 401
  await assert.rejects(refreshSession())
  assert.equal(expired,1)
 } finally { env.restore() }
})
