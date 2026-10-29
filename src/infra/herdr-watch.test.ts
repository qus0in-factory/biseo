import test from'node:test'
import assert from'node:assert/strict'
import {startHerdrWatch}from'./herdr-watch.js'
import {fakeWatch}from'./herdr-watch-fixture.test.js'
import {until as wait}from'../test-wait.test-util.js'
test('refreshes panes and reconnects after close',async()=>{
 let panes=['p1']
 let ready=0
 const{f,subscribe}=fakeWatch()
 const w=startHerdrWatch({listPanes:async()=>panes,subscribe,onEvent:()=>{},onReady:()=>ready++,baseMs:1})
 await wait(()=>f.ids.length===1)
 assert.deepEqual(f.ids[0],['p1'])
 assert.equal(ready,1)
 panes=['p1','p2']
 f.events[0]!('pane.created')
 await wait(()=>f.ids.length===2)
 assert.deepEqual(f.ids[1],['p1','p2'])
 assert.equal(ready,2)
 f.closes[1]!()
 await wait(()=>f.ids.length===3)
 assert.deepEqual(f.ids[2],['p1','p2'])
 assert.equal(ready,3)
 w.stop()
 assert.ok(f.closed>=2)
 const n=f.ids.length
 f.closes[2]!()
 await new Promise(r=>setTimeout(r,10))
 assert.equal(f.ids.length,n)
})
