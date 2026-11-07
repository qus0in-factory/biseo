import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{agyTestGroup}from'./test-util/agy-test-support.test-util.js'
import{cliTsv,setupCli,doneCli}from'./test-util/agy-cli-scenario.test-util.js'

test('api groups without argon trigger cli supplement',async()=>{
 const calls:string[]=[]
 const{p,o}=setupCli('agy-argon-off','2030-01-01','1',cliTsv,calls,
  ()=>Response.json({groups:[agyTestGroup]}))
 delete process.env.BISEO_AGY_CLI_ENABLED
 try{
  const r=await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))
  assert.equal(r.state,'available')
  assert.equal(r.metrics.find(m=>m.id.startsWith('argon:'))?.used,null)
  await fetchAgyUsage(new Date('2026-10-30T12:01:00Z'))
  assert.equal(calls.length,1)
 }finally{doneCli(p,o)}
})
