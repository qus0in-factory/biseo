import test from'node:test'
import assert from'node:assert/strict'
import {PaneLocks}from'./pane-locks.js'
test('lock subscribers get real changes and can unsubscribe',()=>{
 const l=new PaneLocks(),a:string[]=[],b:string[]=[]
 const off=l.subscribe(x=>a.push(x))
 l.subscribe(x=>b.push(x))
 l.reserve('p','1')
 l.reserve('p','2')
 l.release('p','x')
 l.release('p','1')
 off()
 l.reserve('q','3')
 assert.deepEqual(a,['p','p'])
 assert.deepEqual(b,['p','p','q'])
})
