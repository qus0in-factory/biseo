import test from'node:test'
import assert from'node:assert/strict'
import{parseAgyCliTsv}from'./agy-cli-tsv.js'
import{parseAgyUsage}from'./agy-usage-parse.js'
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
