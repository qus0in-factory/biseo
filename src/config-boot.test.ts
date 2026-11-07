import test from'node:test'
import assert from'node:assert/strict'
import{config}from'./config.js'
import{validateBootConfig}from'./config-boot.js'
import{missingConfigKeys}from'./config-missing.js'

{
test('env identity passes boot',()=>{
 const c={...config,serviceIssuer:'test-issuer',serviceAudience:'test-audience'}
 validateBootConfig(c)
 assert.deepEqual(missingConfigKeys(c),[])
})
test('missing keys fail with names',()=>{
 const bad:Record<string,unknown>={
  servicePublicKeyPath:'',
  turnTimeoutMs:0,
  availabilityTtlMs:0,
  ollamaIncludedUsd:0,
 }
 for(const[k,v]of Object.entries(bad)){
  const c:any={...config,[k]:v}
  assert.throws(()=>validateBootConfig(c))
  assert.ok(missingConfigKeys(c).includes(k),k)
 }
 const l:any={...config,limitMarkers:['']}
 assert.throws(()=>validateBootConfig(l))
 assert.ok(missingConfigKeys(l).includes('limitMarkers'))
 const i:any={...config,inputMarkers:['']}
 assert.throws(()=>validateBootConfig(i))
 assert.ok(missingConfigKeys(i).includes('inputMarkers'))
})
}
