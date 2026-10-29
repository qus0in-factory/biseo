import test from'node:test'
import assert from'node:assert/strict'
import {Writable}from'node:stream'
import {Hono}from'hono'
import {createLogger}from'./logger.js'
import {requestLogger}from'../ui/request-logger.js'
test('requestLogger validates x-request-id and omits secrets',async()=>{
 const out:string[]=[],app=new Hono()
 app.use('*',requestLogger(createLogger('info',new Writable({write(c,_e,cb){out.push(String(c));cb()}}))))
 app.post('/t',async c=>{await c.req.json();return c.json({ok:1},202)})
 const h={authorization:'Bearer s3cr3t',cookie:'sid=c00k','x-request-id':'ray_1'}
 const r=await app.request('http://x/t',{method:'POST',headers:h,body:'{"requestId":"r1","text":"sec"}'})
 assert.equal(r.headers.get('x-request-id'),'ray_1')
 const b=await app.request('http://x/t',{method:'POST',headers:{'x-request-id':'!'},body:'{"requestId":"!"}'})
 assert.match(b.headers.get('x-request-id')!,/^[0-9a-f-]{36}$/)
 const s=out.join('')
 assert.ok(!s.includes('s3cr3t')&&!s.includes('c00k')&&!s.includes('sec'))
})
