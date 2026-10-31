import test from 'node:test'
import assert from 'node:assert/strict'
import { sessionLock } from './sessionLock'
import { refreshSession } from './refreshSession'
import { sessionTestEnv } from './sessionTestEnv'

test('waiting tab probes shared cookie instead of issuing a second rotation', async () => {
 const env = sessionTestEnv()
 let valid = false, rotations = 0
 globalThis.fetch = async input => {
  if (String(input) === '/api/session') return new Response('',{status:valid?200:401})
  rotations++; valid = true
  return new Response('')
 }
 try {
  const tab1 = refreshSession()
  const tab2 = sessionLock(async () => {
   const r = await fetch('/api/session')
   assert.equal(r.status,200)
  })
  await Promise.all([tab1,tab2])
  await refreshSession()
  assert.equal(rotations,1)
 } finally { env.restore() }
})
