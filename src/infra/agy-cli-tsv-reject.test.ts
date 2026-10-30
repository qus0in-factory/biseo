import test from'node:test'
import assert from'node:assert/strict'
import{parseAgyCliTsv}from'./agy-cli-tsv.js'
test('cli tsv rejects missing columns and bad remaining',()=>{
 assert.equal(parseAgyCliTsv('a\tb\tc\nx\ty\tn/a\tz'),null)
 assert.equal(parseAgyCliTsv(''),null)
 assert.equal(parseAgyCliTsv('Model Bucket\tLimit Window\tRemaining\tReset Time\n'),null)
})
