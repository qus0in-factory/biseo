import test from'node:test'
import assert from'node:assert/strict'
import{config}from'./config.js'
import{validateConfig}from'./config-validation.js'
import{missingConfigKeys}from'./config-missing.js'
test('effective config passes preflight',()=>{
 validateConfig(config)
 assert.deepEqual(missingConfigKeys(config),[])
})
test('missing keys fail with names',()=>{
 const bad:Record<string,unknown>={
  serviceIssuer:'',
  serviceAudience:'',
  servicePublicKeyPath:'',
  turnTimeoutMs:0,
  availabilityTtlMs:0,
 }
 for(const[k,v]of Object.entries(bad)){
  const c:any={...config,[k]:v}
  assert.throws(()=>validateConfig(c))
  assert.ok(missingConfigKeys(c).includes(k),k)
 }
 const l:any={...config,limitMarkers:['']}
 assert.throws(()=>validateConfig(l))
 assert.ok(missingConfigKeys(l).includes('limitMarkers'))
 const i:any={...config,inputMarkers:['']}
 assert.throws(()=>validateConfig(i))
 assert.ok(missingConfigKeys(i).includes('inputMarkers'))
})
