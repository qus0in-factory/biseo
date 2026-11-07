import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueCallbackUrl as url}from'./queue-callback-url.js'
test('callback URL prefers env, then file, preserving explicit empty values',async()=>{
 const warn=()=>a.fail('unexpected warning')
 a.equal(await url('https://file.test','https://env.test','missing',warn),'https://env.test')
 a.equal(await url('https://file.test',undefined,'missing',warn),'https://file.test')
 a.equal(await url('https://file.test','','missing',warn),'')
 a.equal(await url('',undefined,'missing',warn),'')
})
