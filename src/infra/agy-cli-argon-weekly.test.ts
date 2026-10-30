import test from'node:test'
import assert from'node:assert/strict'
import{parseAgyCliTsv}from'./agy-cli-tsv.js'
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
