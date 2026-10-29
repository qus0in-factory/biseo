import test from'node:test'
import assert from'node:assert/strict'
import{waitFirstSession}from'./wait-first-session.js'
const ses={source:'herdr:opencode',agent:'opencode',kind:'id' as const,value:'ses_7'}
const tick=(n=10)=>new Promise(r=>setTimeout(r,n))
test('event before ack unsubs once, duplicates add no reads',async()=>{
 let cur:unknown,n=0,un=0,ev!:(e:string)=>void,go!:()=>void
 const h={getPane:async()=>{n++;return{pane_id:'w:p1',terminal_id:'term',agent:'opencode',agent_session:cur,revision:1}},getAgent:async()=>undefined}as never
 const sub=async(_:string[],e:(x:string)=>void)=>{ev=e;return new Promise<()=>void>(r=>{go=()=>r(()=>{un++})})}
 const p=waitFirstSession(h,'w:p1','term',500,()=>false,sub)
 await tick()
 assert.equal(n,1)
 cur=ses
 ev('agent_status')
 assert.deepEqual(await p,ses)
 assert.equal(un,0)
 go()
 await tick()
 assert.equal(un,1)
 const m=n
 ev('agent_status')
 await tick(20)
 assert.equal(n,m)
 assert.equal(un,1)
})
