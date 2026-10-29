import{findLatestRollout}from'./codex-latest.js'
import{readRateLimits}from'./codex-rate-limit-read.js'
import{formatCodexWindows,unknownUsage}from'../domain/usage-format.js'
import type{UsageReport}from'../domain/usage-types.js'
export class UsageCollector{
 async getReport(now=new Date()):Promise<UsageReport>{
  try{
   const p=await findLatestRollout()
   const r=p?await readRateLimits(p):null
   return{providers:[formatCodexWindows(r,now)],updatedAt:now.toISOString()}
  }catch{
   return{providers:[unknownUsage('codex')],updatedAt:now.toISOString()}
  }
 }
}
