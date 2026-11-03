import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{agyCliConfig}from'./agy-cli-config.js'
import{cliTsv,fail401,setupCli,doneCli}from'./agy-cli-scenario.test-util.js'
import{fail401,setupCli,doneCli}from'./agy-cli-scenario.test-util.js'
import{agyTestGroup}from'./agy-test-support.test-util.js'
import{cliTsv,setupCli,doneCli}from'./agy-cli-scenario.test-util.js'

{
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
}
{
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
}
{
const at='2026-10-30T12:00:00Z'
const exp='2020-01-01T00:00:00.000Z'
async function run(name:string,out:string|null){
 const calls:string[]=[]
 const{p,o}=setupCli(name,exp,'1',out,calls,fail401)
 try{return{res:await fetchAgyUsage(new Date(at)),calls}}finally{doneCli(p,o)}
}
test('a cli timeout or bad output keeps agy_auth_expired',async()=>{
 for(const[name,out]of[['agy-cli-fb-to',null],['agy-cli-fb-bad','not\ttsv']]as const){
  const{res}=await run(name,out)
  assert.equal(res.state,'unknown')
  assert.equal(res.reason,'agy_auth_expired')
  assert.deepEqual(res.metrics,[])
 }
})
}
{
test('a live token supplements missing Argon weekly from cli',async()=>{
 const calls:string[]=[]
 const{p,o}=setupCli('agy-cli-fb-ok','2030-01-01','1',cliTsv,calls,()=>Response.json({groups:[agyTestGroup]}))
 try{
  assert.equal((await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))).state,'available')
  assert.equal(calls.length,1)
  assert.equal((await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))).metrics.find(m=>m.id.startsWith('argon:'))?.used,null)
 }finally{doneCli(p,o)}
})
}
{
const at='2026-10-30T12:00:00Z'
const exp='2020-01-01T00:00:00.000Z'
async function run(name:string,ena:string){
 const calls:string[]=[]
 const{p,o}=setupCli(name,exp,ena,cliTsv,calls,fail401)
 try{return{res:await fetchAgyUsage(new Date(at)),calls}}finally{doneCli(p,o)}
}
test('an auth failure falls back to one cli call',async()=>{
 const{res,calls}=await run('agy-cli-fb-on','1')
 assert.equal(res.state,'available')
 assert.deepEqual(res.metrics.map((m)=>m.used),[20,null])
 assert.equal(calls.length,1)
})
test('a disabled cli keeps agy_auth_expired',async()=>{
 const{res,calls}=await run('agy-cli-fb-off','0')
 assert.equal(res.state,'unknown')
 assert.equal(res.reason,'agy_auth_expired')
 assert.equal(calls.length,0)
})
}
