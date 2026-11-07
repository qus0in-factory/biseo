import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{cliTsv,fail401,setupCli,doneCli}from'./test-util/agy-cli-scenario.test-util.js'

test('explicit cli opt-in caches results for its interval',async()=>{
 process.env.BISEO_AGY_CLI_CACHE_MS='7200000'
 const calls:string[]=[]
 const{p,o}=setupCli('agy-cache','2020-01-01','1',cliTsv,calls,fail401)
 try{
  const t=Date.parse('2026-10-30T12:00:00Z')
  for(const delta of [0,3600000,7200000]){
   assert.equal((await fetchAgyUsage(new Date(t+delta))).state,'available')
   assert.equal(calls.length,delta<7200000?1:2)
  }
 }finally{doneCli(p,o);delete process.env.BISEO_AGY_CLI_CACHE_MS}
})
