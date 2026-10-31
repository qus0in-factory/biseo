import test from 'node:test'
import assert from 'node:assert/strict'
import { refreshSession } from './refreshSession'
import { sessionTestEnv } from './sessionTestEnv'

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
