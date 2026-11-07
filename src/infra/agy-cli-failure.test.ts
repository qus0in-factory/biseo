import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{fail401,setupCli,doneCli}from'./test-util/agy-cli-scenario.test-util.js'

test('opted-in cli timeout or bad output keeps auth failure',async()=>{
 for(const out of [null,'not\ttsv']){
  const calls:string[]=[]
  const{p,o}=setupCli('agy-failure','2020-01-01','1',out,calls,fail401)
  try{
   const r=await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))
   assert.equal(r.state,'unknown')
   assert.equal(r.reason,'agy_auth_expired')
   assert.deepEqual(r.metrics,[])
  }finally{doneCli(p,o)}
 }
})
