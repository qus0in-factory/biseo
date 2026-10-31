import{test}from'node:test'
import{strict as a}from'node:assert'
import{makeDeps}from'./turn-fixture.js'
import{queueTarget}from'./queue-target.js'
test('trusted snapshot requires matching workspace and current terminal',async()=>{
 const d=makeDeps(null)
 a.equal(await queueTarget(d.herdr,'wrong','w:p1'),null)
 a.equal((await queueTarget(d.herdr,'w','w:p1'))?.terminalId,'term')
})
