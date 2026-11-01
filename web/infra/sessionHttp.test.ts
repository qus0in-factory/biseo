import test from 'node:test'
import assert from 'node:assert/strict'
import http from './sessionHttp'
import { sessionTestEnv } from './sessionTestEnv'

test('request retries once, retains body, and never loops on repeated 401', async () => {
 const env = sessionTestEnv()
 let requests = 0
 const bodies: string[] = []
 globalThis.fetch = async input => {
  if (typeof input === 'string') return new Response('')
  const req = input as Request
  bodies.push(await req.text()); requests++
  return new Response('',{status:401})
 }
 try {
  await assert.rejects(http.post('https://biseo.test/api/timeline/messages',{
   json:{requestId:'same',text:'unsent draft'},retry:0,
  }))
  assert.equal(requests,2)
  assert.equal(bodies[0],bodies[1])
 } finally { env.restore() }
})
