import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{agyTestGroup}from'./agy-test-support.test-util.js'
import{cliTsv,setupCli,doneCli}from'./agy-cli-scenario.test-util.js'
test('a live token never calls the cli',async()=>{
 const calls:string[]=[]
 const{p,o}=setupCli('agy-cli-fb-ok','2030-01-01','1',cliTsv,calls,()=>Response.json({groups:[agyTestGroup]}))
 try{
  assert.equal((await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))).state,'available')
  assert.equal(calls.length,0)
 }finally{doneCli(p,o)}
})
