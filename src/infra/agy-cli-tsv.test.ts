import test from'node:test'
import assert from'node:assert/strict'
import{parseAgyCliTsv}from'./agy-cli-tsv.js'
import{parseAgyUsage}from'./agy-usage-parse.js'
const r=(b:string,w:string,p:string,s='2026-11-01T00:00:00Z')=>`${b}\t${w}\t${p}\t${s}`
const body=[r('gemini-test','5h','80%'),r('gemini-test','weekly','50%'),r('claude-test','5h','100%'),r('mystery-pool','weekly','25%','bogus')].join('\n')
const head='Model Bucket\tLimit Window\tRemaining\tReset Time'
test('cli tsv parses with or without a header row',()=>{
 for(const tsv of[`${head}\n${body}`,body]){
  const g=parseAgyCliTsv(tsv)
  assert.equal(g?.length,3)
  assert.deepEqual(g?.[0].families,['gemini'])
  assert.deepEqual(g?.[2].families,['unknown'])
  const u=parseAgyUsage({groups:g},new Date('2026-10-30T10:00:00Z'))
  assert.equal(u.state,'available')
  assert.deepEqual(u.metrics.map((m)=>m.used),[20,50,0,75])
  assert.equal(u.windows[0].usedPercent,20)
  assert.equal(u.windows[1].usedPercent,50)
 }
})
