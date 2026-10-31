import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{cliTsv,fail401,setupCli,doneCli}from'./agy-cli-scenario.test-util.js'
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
