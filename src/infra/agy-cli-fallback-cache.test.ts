import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{cliTsv,fail401,setupCli,doneCli}from'./agy-cli-scenario.test-util.js'
const at='2026-10-30T12:00:00Z'
test('a cli result is cached for the minimum call interval',async()=>{
 process.env.BISEO_AGY_CLI_CACHE_MS='60000'
 const calls:string[]=[]
 const{p,o}=setupCli('agy-cli-fb-cache','2020-01-01T00:00:00.000Z','1',cliTsv,calls,fail401)
 try{
  const t0=new Date(at)
  assert.equal((await fetchAgyUsage(t0)).state,'available')
  assert.equal((await fetchAgyUsage(new Date(t0.getTime()+30000))).state,'available')
  assert.equal(calls.length,1)
  assert.equal((await fetchAgyUsage(new Date(t0.getTime()+90000))).state,'available')
  assert.equal(calls.length,2)
 }finally{doneCli(p,o);delete process.env.BISEO_AGY_CLI_CACHE_MS}
})
