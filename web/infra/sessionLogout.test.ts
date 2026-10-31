import test from 'node:test'
import assert from 'node:assert/strict'
import { sessionLock } from './sessionLock'
import { refreshSession } from './refreshSession'
import { sessionTestEnv } from './sessionTestEnv'

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
