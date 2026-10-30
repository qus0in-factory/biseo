import test from'node:test'
import assert from'node:assert/strict'
import{parseAgyCliTsv}from'./agy-cli-tsv.js'
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
