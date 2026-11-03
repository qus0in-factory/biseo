import test from 'node:test'
import assert from 'node:assert/strict'
import { refreshSession } from './refreshSession'
import { sessionTestEnv } from '../test-util/sessionTestEnv'
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
test('lost response/network error releases single-flight without expiring the screen', async () => {
 const env = sessionTestEnv()
 let expires = 0, lost = true
 env.target.addEventListener('biseo-session-expired',() => expires++)
 globalThis.fetch = async input => {
  if (String(input) === '/api/session') return new Response('',{status:401})
  if (lost) throw new TypeError('network response lost')
  return new Response('')
 }
 try {
  await assert.rejects(refreshSession())
  assert.equal(expires,0)
  lost = false
  await refreshSession()
 } finally { env.restore() }
})
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
