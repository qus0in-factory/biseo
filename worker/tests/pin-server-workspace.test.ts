import test from'node:test'
import assert from'node:assert/strict'
import{pinEnv}from'./pin-fixture.js'
import{IP,postPin}from'./pin-request.js'
import{seedPin,seedTrusted}from'./pin-seed.js'
test('PIN login bypasses authenticated selected workspace resolution',async()=>{
 const{env,db}=await pinEnv({WORKSPACE_CONFIG_SOURCE:'server'})
 await seedTrusted(db,IP)
 await seedPin(db)
 const f=globalThis.fetch
 let calls=0
 globalThis.fetch=async()=>{calls++;throw new Error('unexpected workspace lookup')}
 try{
  assert.equal((await postPin(env,'123456')).status,200)
  assert.equal(calls,0)
 }finally{globalThis.fetch=f}
})
