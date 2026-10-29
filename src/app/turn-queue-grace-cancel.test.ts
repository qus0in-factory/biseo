import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {cancelTurn}from'./turn-queue-cancel.js'
import {dispatchPane}from'./turn-queue-dispatch.js'
import {input,reader,agent,pane}from'./turn-data-fixture.js'
import {makeDeps}from'./turn-fixture.js'
test('cancel during target grace does not start the removed turn',async()=>{
 const d=makeDeps(reader),w={...agent,agent_status:'working'}
 const set=(s:typeof agent)=>{d.herdr.listAgents=async()=>[s];d.herdr.getAgent=async()=>s}
 set(w)
 for(const t of'12')await createTurn(d,{...input,requestId:t,text:t})
 d.locks.reserve('w:p1','h')
 d.targetGraceMs=10
 set(agent)
 d.herdr.getPane=async()=>undefined
 let got=''
 d.herdr.prompt=async(_p,t)=>{got=t}
 dispatchPane(d,'w:p1')
 await new Promise(r=>setTimeout(r,5))
 cancelTurn(d,'1')
 d.herdr.getPane=async()=>pane
 d.locks.release('w:p1','h')
 for(let i=0;i<100&&got!=='2';i++)await new Promise(r=>setTimeout(r,1))
 assert.equal(got,'2')
})
