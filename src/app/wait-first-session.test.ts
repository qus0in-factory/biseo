import test from'node:test'
import assert from'node:assert/strict'
import{waitFirstSession}from'./wait-first-session.js'
import type{EventSub}from'./first-session-snap.js'
const ses={source:'herdr:opencode',agent:'opencode',kind:'id' as const,value:'ses_7'}
const tick=(n=10)=>new Promise(r=>setTimeout(r,n))
const mk=(get:()=>unknown)=>{
 let n=0
 const h={getPane:async()=>{n++;return{pane_id:'w:p1',terminal_id:'term',agent:'opencode',agent_session:get(),revision:1}},getAgent:async()=>undefined}as never
 return{h,reads:()=>n}
}
const mkSub=()=>{
 const r={ids:[] as string[][],ev:[] as ((e:string)=>void)[],cl:[] as (()=>void)[],un:0}
 const sub:EventSub=async(ids,ev,cl)=>{r.ids.push(ids);r.ev.push(ev);r.cl.push(cl);return()=>{r.un++}}
 return{sub,r}
}
test('event resolves session with bounded reads and unsubscribes',async()=>{
 let cur:unknown
 const{h,reads}=mk(()=>cur),{sub,r}=mkSub()
 const p=waitFirstSession(h,'w:p1','term',500,()=>false,sub)
 await tick()
 assert.equal(reads(),2)
 assert.deepEqual(r.ids,[['w:p1']])
 cur=ses
 r.ev.forEach(f=>f('agent_status'))
 assert.deepEqual(await p,ses)
 assert.equal(r.un,1)
 const n=reads()
 r.ev.forEach(f=>f('agent_status'))
 await tick()
 assert.equal(reads(),n)
})
test('session reported between first read and subscribe wins without events',async()=>{
 let cur:unknown
 const{h}=mk(()=>cur)
 let fired=0
 const sub:EventSub=async()=>{cur=ses;return()=>{fired++}}
 assert.deepEqual(await waitFirstSession(h,'w:p1','term',200,()=>false,sub),ses)
 assert.equal(fired,1)
})
test('timeout ends wait, unsubscribes, never polls',async()=>{
 const{h,reads}=mk(()=>undefined),{sub,r}=mkSub()
 assert.equal(await waitFirstSession(h,'w:p1','term',30,()=>false,sub),null)
 assert.equal(r.un,1)
 assert.equal(reads(),2)
 await tick(60)
 assert.equal(reads(),2)
})
test('pre-start cancel never subscribes; socket close ends wait',async()=>{
 const{h}=mk(()=>undefined),{sub,r}=mkSub()
 assert.equal(await waitFirstSession(h,'w:p1','term',50,()=>true,sub),null)
 assert.equal(r.ids.length,0)
 const{h:h2}=mk(()=>undefined),{sub:s2,r:r2}=mkSub()
 const p=waitFirstSession(h2,'w:p1','term',500,()=>false,s2)
 await tick()
 r2.cl.forEach(f=>f())
 assert.equal(await p,null)
 assert.equal(r2.un,1)
})
test('replaced pane and other agent stop without events',async()=>{
 const h={getPane:async()=>({pane_id:'w:p1',terminal_id:'other'}),getAgent:async()=>undefined}as never
 const{sub,r}=mkSub()
 assert.equal(await waitFirstSession(h,'w:p1','term',50,()=>false,sub),null)
 assert.equal(r.ids.length,0)
 const h2={getPane:async()=>({pane_id:'w:p1',terminal_id:'term',agent:'claude'}),getAgent:async()=>undefined}as never
 assert.equal(await waitFirstSession(h2,'w:p1','term',50,()=>false,sub),null)
})
