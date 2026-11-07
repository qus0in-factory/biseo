import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{agyCliConfig}from'./agy-cli-config.js'
import{agyCliFlag}from'../config-agy-cli.js'
import{cliTsv,fail401,setupCli,doneCli}from'./test-util/agy-cli-scenario.test-util.js'

test('legacy runtime opt-in cannot enable model fallback by default',async()=>{
 const calls:string[]=[]
 const{p,o}=setupCli('agy-default-off','2020-01-01','1',cliTsv,calls,fail401)
 delete process.env.BISEO_AGY_CLI_ENABLED
 try{
  assert.equal(agyCliFlag.agyCliEnabled,false)
  assert.equal(agyCliConfig().enabled,false)
  const r=await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))
  assert.equal(r.reason,'agy_auth_expired')
  assert.equal(calls.length,0)
 }finally{doneCli(p,o)}
})
