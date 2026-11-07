import test from'node:test'
import assert from'node:assert/strict'
import{config}from'./config.js'
import{missingConfigKeys}from'./config-missing.js'
test('legacy extra key such as agyCliEnabled is ignored',()=>{
 const c={...config,serviceIssuer:'test-issuer',serviceAudience:'test-audience',agyCliEnabled:true}as typeof config
 assert.deepEqual(missingConfigKeys(c),[])
})
