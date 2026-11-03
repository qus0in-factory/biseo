import test from'node:test'
import assert from'node:assert/strict'
import{parseAgyCliTsv}from'./agy-cli-tsv.js'
import{parseAgyUsage}from'./agy-usage-parse.js'

{
const now=new Date('2026-10-30T10:00:00Z').getTime()
const human='GEMINI 4 ARGON\nShared Argon capacity for editors\nGemini 4 Argon Weekly Limit\n#### 0.00%\nRefreshes in 32h 37m'
test('argon human weekly parses 0% used with refresh time',()=>{
 const g=parseAgyCliTsv(human,now)
 assert.deepEqual(g?.[0].families,['argon'])
 assert.equal(g?.[0].buckets[0]?.window,'weekly')
 assert.equal(g?.[0].buckets[0]?.remainingFraction,1)
 assert.equal(g?.[0].buckets[0]?.resetTime,new Date(now+1957*6e4).toISOString())
})
test('tsv groups survive next to human argon',()=>{
 const g=parseAgyCliTsv('Gemini Models\tWeekly Limit Remaining\t80%\t2026-11-01T00:00:00Z\n'+human,now)
 assert.equal(g?.length,2)
 assert.deepEqual(g?.[1].families,['argon'])
})
}
{
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
}
{
test('cli tsv rejects missing columns and bad remaining',()=>{
 assert.equal(parseAgyCliTsv('a\tb\tc\nx\ty\tn/a\tz'),null)
 assert.equal(parseAgyCliTsv(''),null)
 assert.equal(parseAgyCliTsv('Model Bucket\tLimit Window\tRemaining\tReset Time\n'),null)
})
test('cli tsv skips blank remaining without a false limited',()=>{
 const tsv='Gemini Models\tFive Hour Limit Remaining\t\t2026-11-01T00:00:00Z\nGemini Models\tWeekly Limit Remaining\t80%\t2026-11-01T00:00:00Z'
 const g=parseAgyCliTsv(tsv)
 assert.equal(g?.length,1)
 assert.equal(g?.[0].buckets.length,1)
 assert.equal(parseAgyCliTsv('Gemini Models\tFive Hour Limit Remaining\t \t2026-11-01T00:00:00Z'),null)
})
}
{
// Masked synthetic: real CLI label shape, synthetic values.
const r=(b:string,w:string,p:string)=>`${b}\t${w}\t${p}\t2026-11-01T00:00:00Z`
const body=[r('Gemini Models','Weekly Limit Remaining','80%'),r('Gemini Models','Five Hour Limit Remaining','50%')].join('\n')
test('cli tsv maps contract labels to 5h/weekly and families',()=>{
 const g=parseAgyCliTsv(body)
 assert.deepEqual(g?.[0].families,['gemini'])
 const u=parseAgyUsage({groups:g},new Date('2026-10-30T10:00:00Z'))
 assert.deepEqual(u.windows.map((w)=>w.window),['primary','secondary'])
 assert.equal(u.windows[0].usedPercent,50)
 assert.equal(u.windows[1].usedPercent,20)
})
}
