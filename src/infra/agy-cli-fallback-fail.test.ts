import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{fail401,setupCli,doneCli}from'./agy-cli-scenario.test-util.js'
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
