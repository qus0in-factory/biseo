import{test}from'node:test'
import{strict as a}from'node:assert'
import{logger}from'./logger.js'
import{sendQueueCallback as send}from'./queue-callback-send.js'
test('callback warns for HTTP and network failures without exposing targets',async()=>{
 const fetch=globalThis.fetch,warn=logger.warn,logs:unknown[][]=[]
 logger.warn=((...args:unknown[])=>{logs.push(args)}) as typeof warn
 try{
  globalThis.fetch=async()=>new Response(null,{status:404})
  await send(Promise.resolve('https://example.test'),100,'id','secret')
  globalThis.fetch=async()=>{throw Error('sensitive URL')}
  await send(Promise.resolve('https://example.test'),100,'id','secret')
  await send(Promise.resolve(undefined),100,'id','secret')
  a.deepEqual(logs,[[{status:404},'queue.callback_rejected'],['queue.callback_failed']])
 }finally{globalThis.fetch=fetch;logger.warn=warn}
})
