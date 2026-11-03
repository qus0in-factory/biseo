import type{TestContext}from'node:test'
import{createTimelineTestEnv}from'./timeline-helpers.js'
import{run}from'./upstream-retry-helpers.js'
import{drive}from'./upstream-retry-drive.js'
export const retryCase=async(t:TestContext,fn:(n:number)=>Response)=>{
 const{env}=await createTimelineTestEnv()
 let start!:()=>void
 const started=new Promise<void>(resolve=>{start=resolve})
 t.mock.timers.enable({apis:['setTimeout']})
 try{
  const pending=run(env,'GET',n=>{start();return fn(n)})
  await started
  return await drive(t,pending)
 }finally{t.mock.timers.reset()}
}
