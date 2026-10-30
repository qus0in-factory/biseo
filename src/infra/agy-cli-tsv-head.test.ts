import test from'node:test'
import assert from'node:assert/strict'
import{parseAgyCliTsv}from'./agy-cli-tsv.js'
import{parseAgyUsage}from'./agy-usage-parse.js'
// Masked synthetic: full 4-row contract shape, header stripped or kept.
const r=(b:string,w:string,p:string)=>`${b}\t${w}\t${p}\t2026-11-01T00:00:00Z`
const body=[r('Gemini Models','Weekly Limit Remaining','80%'),r('Gemini Models','Five Hour Limit Remaining','50%'),r('Claude and GPT models','Weekly Limit Remaining','90%'),r('Claude and GPT models','Five Hour Limit Remaining','100%')].join('\n')
const head='Model Bucket\tLimit Window\tRemaining\tReset Time'
test('cli tsv parses the contract shape with or without a header',()=>{
 for(const tsv of[`${head}\n${body}`,body]){
  const g=parseAgyCliTsv(tsv)
  assert.equal(g?.length,2)
  assert.deepEqual(g?.[1].families,['claude','gpt'])
  assert.equal(parseAgyUsage({groups:g},new Date('2026-10-30T10:00:00Z')).state,'available')
 }
})
