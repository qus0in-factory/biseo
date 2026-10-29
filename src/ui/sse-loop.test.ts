import test from'node:test'
import assert from'node:assert/strict'
import {Writable}from'node:stream'
import {createLogger}from'../infra/logger.js'
import {sseLoop}from'./sse-loop.js'
test('sseLoop logs sse.open and sse.close with reason and durationMs',async()=>{
 const lines:string[]=[]
 const log=createLogger('info',new Writable({write(c,_e,cb){lines.push(String(c).trim());cb()}}))
 const loop=sseLoop({aborted:true,writeSSE:async()=>{}} as never,async()=>{},()=>{},15000,log)
 loop.end()
 const open=JSON.parse(lines[0]),close=JSON.parse(lines[1])
 assert.equal(open.event,'sse.open')
 assert.equal(close.event,'sse.close')
 assert.equal(close.reason,'client_abort')
 assert.equal(typeof close.durationMs,'number')
})
