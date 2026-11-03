import assert from 'node:assert/strict';
import test from 'node:test';
import { streamOnce } from '../test-util/stream-helpers.js';
import app from '../index.js';
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js';

test('GET /api/timeline/stream forwards Last-Event-ID upstream', async () => {
  const { res, id } = await streamOnce('1')
  assert.equal(res.status, 200)
  assert.equal(id, '1')
})

test('GET /api/timeline/stream relays SSE with retry', async () => {
  const { text } = await streamOnce('1')
  assert.match(text, /retry: 3000/)
  assert.match(text, /event: turn\.updated/)
  assert.match(text, /event: heartbeat/)
})

test('worker validates requestId and logs upstream and sse close',async()=>{
 const {env,cookie}=await createTimelineTestEnv(),f0=globalThis.fetch,l0=console.log,logs:string[]=[]
 let upId:string|null=null
 console.log=(...a:unknown[])=>logs.push(a.map(String).join(' '))
 globalThis.fetch=async(i,init)=>{
  upId=new Request(i,init).headers.get('x-request-id')
  return new Response(new ReadableStream({start(c){c.enqueue(new Uint8Array([10]))}}))
 }
 try{
  const r=await app.fetch(new Request('https://x/api/timeline/stream?workspaceId=w1T',{headers:{Cookie:cookie,'cf-ray':'bad!'}}),env)
  assert.match(upId??'',/^[0-9a-f-]{36}$/)
  await r.body?.cancel()
  const sse=logs.map(x=>JSON.parse(x)).find(x=>x.msg==='worker.sse.close')
  assert.equal(sse?.requestId,upId)
  assert.equal(sse?.reason,'client_abort')
 }finally{globalThis.fetch=f0;console.log=l0}
})
