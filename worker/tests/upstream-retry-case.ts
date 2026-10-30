import type{TestContext}from'node:test'
import{createTimelineTestEnv}from'./timeline-helpers.js'
import{run}from'./upstream-retry-helpers.js'
import{drive}from'./upstream-retry-drive.js'
export const retryCase=async(t:TestContext,fn:(n:number)=>Response)=>{
 const{env}=await createTimelineTestEnv()
 t.mock.timers.enable({apis:['setTimeout']})
 try{return await drive(t,run(env,'GET',fn))}finally{t.mock.timers.reset()}
}
