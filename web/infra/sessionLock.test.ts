import test from 'node:test'
import assert from 'node:assert/strict'
import { sessionLock } from './sessionLock'
import { refreshSession } from './refreshSession'
import { sessionTestEnv } from '../test-util/sessionTestEnv'

test('logout shares the rotation lock, so late refresh cannot overwrite logout', async () => {
 const env = sessionTestEnv()
 const order: string[] = []
 globalThis.fetch = async input => {
  if (String(input) === '/api/session') return new Response('',{status:401})
  await Promise.resolve()
  order.push('refresh response')
  return new Response('')
 }
 try {
  await Promise.all([refreshSession(),sessionLock(async () => { order.push('logout') })])
  assert.deepEqual(order,['refresh response','logout'])
 } finally { env.restore() }
})
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
