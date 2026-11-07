import test from 'node:test'
import assert from 'node:assert/strict'
import {base} from './config-file.js'

test('service identity prefers env then runtime fallback',async()=>{
 const keys=['SERVICE_ISSUER','SERVICE_AUDIENCE'] as const
 const saved=keys.map(k=>process.env[k])
 try{
  process.env.SERVICE_ISSUER='test-issuer'
  process.env.SERVICE_AUDIENCE='test-audience'
  const {serviceConfig:a}=await import('./config-service.js?env' as string)
  assert.equal(a.serviceIssuer,'test-issuer')
  assert.equal(a.serviceAudience,'test-audience')
  for(const k of keys)delete process.env[k]
  const {serviceConfig:b}=await import('./config-service.js?fallback' as string)
  assert.ok(b.serviceIssuer===base.serviceIssuer)
  assert.ok(b.serviceAudience===base.serviceAudience)
 }finally{
  keys.forEach((k,i)=>{if(saved[i]===undefined)delete process.env[k];else process.env[k]=saved[i]})
 }
})
