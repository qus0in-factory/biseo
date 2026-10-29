import test from'node:test'
import assert from'node:assert/strict'
import{waitFirstSession}from'./wait-first-session.js'
const tick=(n=10)=>new Promise(r=>setTimeout(r,n))
test('late sub after timeout unsubs once',async()=>{
 const h={getPane:async()=>({pane_id:'w:p1',terminal_id:'term',agent:'opencode'}),getAgent:async()=>undefined}as never
 let un=0,go!:(u:()=>void)=>void
 const sub=async()=>new Promise<()=>void>(r=>{go=()=>r(()=>{un++})})
 const p=waitFirstSession(h,'w:p1','term',20,()=>false,sub)
 assert.equal(await p,null)
 go()
 await tick()
 assert.equal(un,1)
})
