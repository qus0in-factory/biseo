import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueCallbackUrl as url}from'./queue-callback-url.js'
test('callback URL prefers env, then file, then server address',()=>{
 const server={host:'localhost',port:4321}
 a.equal(url(server,'http://file.test','http://env.test'),'http://env.test')
 a.equal(url(server,'http://file.test'),'http://file.test')
 a.equal(url(server),'http://localhost:4321/api/queue/completed')
 a.equal(url(server,'http://file.test',''),'')
})
test('callback URL replaces wildcard binds and brackets IPv6 addresses',()=>{
 for(const host of ['0.0.0.0','::','[::]'])
  a.equal(url({host,port:4321}),'http://127.0.0.1:4321/api/queue/completed')
 for(const host of ['::1','[::1]'])
  a.equal(url({host,port:4321}),'http://[::1]:4321/api/queue/completed')
})
