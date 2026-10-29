import {createTurn}from'./create-turn.js'
import {runTurn}from'./run-turn.js'
import {input,agent}from'./turn-fixture-data.test.js'
import {makeDeps}from'./turn-fixture.test.js'
export const work={...agent,agent_status:'working'}
export async function startTimeoutTurn(){
 const d=makeDeps(null)
 d.timeoutMs=1;d.lateCaptureMs=0
 let n=0
 d.capture.begin=async()=>n++?{read:async()=> 'answer'}:{read:async()=>null}
 const prompts:string[]=[]
 d.herdr.prompt=async(_p,t)=>{prompts.push(t);d.herdr.getAgent=async()=>work}
 const a=await createTurn(d,input)
 if(!a.ok||!a.reader||!a.target)throw new Error('setup')
 await runTurn(d,a.item,a.reader,a.target)
 d.herdr.listAgents=async()=>[work]
 return{d,prompts}
}
