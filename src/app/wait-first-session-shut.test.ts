import test from'node:test'
import assert from'node:assert/strict'
import{waitFirstSession}from'./wait-first-session.js'
const ses={source:'herdr:opencode',agent:'opencode',kind:'id' as const,value:'ses_7'}
const tick=(n=10)=>new Promise(r=>setTimeout(r,n))
test('shut during snap cancels late session',async()=>{
 let n=0,shut=false,un=0,go!:()=>void
 const h={getPane:async()=>{n++;if(n===2)await new Promise<void>(r=>{go=()=>r()});return{pane_id:'w:p1',terminal_id:'term',agent:'opencode',agent_session:n>=2?ses:undefined}},getAgent:async()=>undefined}as never
 const sub=async()=>()=>{un++}
 const p=waitFirstSession(h,'w:p1','term',500,()=>shut,sub)
 await tick(20)
 shut=true
 go()
 assert.equal(await p,null)
 assert.equal(un,1)
})
