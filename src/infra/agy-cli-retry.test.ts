import test from'node:test'
import assert from'node:assert/strict'
import{writeFileSync}from'node:fs'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{setAgyCliRun}from'./agy-cli-run.js'
import{agyTestGroup}from'./agy-test-support.test-util.js'
import{cliTsv,setupCli,doneCli}from'./agy-cli-scenario.test-util.js'
test('cli refreshes file, token retry',async()=>{
 const ref={ok:false}
 const calls:string[]=[]
 const ok=(u:string)=>u.includes('token.example')?new Response('no',{status:400}):ref.ok?Response.json({groups:[agyTestGroup],buckets:[]}):new Response('no',{status:401})
 const{p,o}=setupCli('agy-retry','2020-01-01','1',cliTsv,calls,ok)
 setAgyCliRun(async()=>{calls.push('cli');ref.ok=true;writeFileSync(p,JSON.stringify({token:{access_token:'fresh',expiry:'2030-01-01'}}));return cliTsv})
 try{
  const r=await fetchAgyUsage(new Date('2026-10-30'))
  assert.equal(r.state,'available')
  assert.deepEqual(r.metrics.map((m)=>m.used),[0,null])
  assert.equal(calls.length,1)
 }finally{doneCli(p,o)}
})
