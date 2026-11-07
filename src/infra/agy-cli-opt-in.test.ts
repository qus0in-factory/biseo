import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{cliTsv,fail401,setupCli,doneCli}from'./test-util/agy-cli-scenario.test-util.js'

for(const enabled of ['1','0'])test(`cli enabled switch ${enabled}`,async()=>{
 const calls:string[]=[]
 const{p,o}=setupCli('agy-opt-in','2020-01-01',enabled,cliTsv,calls,fail401)
 try{
  const r=await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))
  assert.equal(calls.length,enabled==='1'?1:0)
  if(enabled==='1'){
   assert.equal(r.state,'available')
   assert.deepEqual(r.metrics.map(m=>m.used),[20,null])
  }else assert.equal(r.reason,'agy_auth_expired')
 }finally{doneCli(p,o)}
})
