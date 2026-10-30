import assert from'node:assert/strict'
import{createTurn,dispatchPane,input,reader,agent,pane,makeDeps,wait}from'./turn-queue-grace-fixture.js'
export const transientLoss=async()=>{
 const d=makeDeps(reader),w={...agent,agent_status:'working'as const}
 d.herdr.listAgents=async()=>[w]
 d.herdr.getAgent=async()=>w
 assert.ok((await createTurn(d,input)).ok)
 d.targetGraceMs=20
 d.herdr.listAgents=async()=>[agent]
 d.herdr.getAgent=async()=>agent
 d.herdr.getPane=async()=>undefined
 let got=''
 d.herdr.prompt=async(_p,t)=>{got=t}
 setTimeout(()=>{d.herdr.getPane=async()=>pane},5)
 await dispatchPane(d,'w:p1')
 await wait(()=>got==='hi')
 assert.equal(got,'hi')
}
