import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{agyCliConfig}from'./agy-cli-config.js'
import{cliTsv,fail401,setupCli,doneCli}from'./agy-cli-scenario.test-util.js'
test('cli fallback is on by default',async()=>{
 const prev=process.env.BISEO_AGY_CLI_ENABLED
 const calls:string[]=[]
 const{p,o}=setupCli('agy-cli-en-def','2020-01-01T00:00:00.000Z','1',cliTsv,calls,fail401)
 delete process.env.BISEO_AGY_CLI_ENABLED
 try{
  assert.equal(agyCliConfig().enabled,true)
  assert.equal((await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))).state,'available')
  assert.equal(calls.length,1)
 }finally{
  if(prev===undefined)delete process.env.BISEO_AGY_CLI_ENABLED
  else process.env.BISEO_AGY_CLI_ENABLED=prev
  doneCli(p,o)
 }
})
