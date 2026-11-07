import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{agyCliConfig}from'./agy-cli-config.js'
import{cliTsv,fail401,setupCli,doneCli}from'./test-util/agy-cli-scenario.test-util.js'

test('cli fallback runs by default unless disabled',async()=>{
 const calls:string[]=[]
 const{p,o}=setupCli('agy-default-on','2020-01-01','1',cliTsv,calls,fail401)
 delete process.env.BISEO_AGY_CLI_ENABLED
 try{
  assert.equal(agyCliConfig().enabled,true)
  const r=await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))
  assert.equal(r.state,'available')
  assert.equal(calls.length,1)
 }finally{doneCli(p,o)}
})
