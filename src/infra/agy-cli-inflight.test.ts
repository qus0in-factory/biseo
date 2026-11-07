import test from'node:test'
import assert from'node:assert/strict'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{setAgyCliRun}from'./agy-cli-run.js'
import{cliTsv,fail401,setupCli,doneCli}from'./test-util/agy-cli-scenario.test-util.js'

test('overlapping cli calls share one run',async()=>{
 const calls:string[]=[]
 const{p,o}=setupCli('agy-flight','2020-01-01','1',null,calls,fail401)
 let rel:(v:string)=>void=()=>{}
 let go:()=>void=()=>{}
 const start=new Promise<void>(r=>{go=r})
 setAgyCliRun(()=>{calls.push('cli');if(calls.length>1)return Promise.resolve(cliTsv);go();return new Promise(r=>{rel=r})})
 try{
  const t=Date.parse('2026-10-30T12:00:00Z')
  const both=Promise.all([fetchAgyUsage(new Date(t)),fetchAgyUsage(new Date(t))])
  await start
  await new Promise(setImmediate)
  assert.equal(calls.length,1)
  rel(cliTsv)
  const[a,b]=await both
  assert.deepEqual([a.state,b.state],['available','available'])
  assert.equal(calls.length,1)
 }finally{doneCli(p,o)}
})
