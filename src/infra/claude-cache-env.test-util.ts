import{setLastClaudeSnapshot as set}from'./claude-snapshot-store.js'
import type{ProviderUsage}from'../domain/usage-types.js'
export const chk='2026-10-30T10:00:00.000Z'
export const good:ProviderUsage={provider:'claude',state:'available',
 metrics:[{id:'five_hour',label:'5h',unit:'percent',used:12,limit:100,remaining:88,resetsAt:null}],
 windows:[{window:'primary',usedPercent:12,resetsAt:null,checkedAt:chk,limitReached:false,source:'claude'}],
 source:'claude',checkedAt:chk}
export const withCacheEnv=async(fn:()=>Promise<void>)=>{
 const u=process.env.BISEO_CLAUDE_USAGE_URL,t=process.env.BISEO_CLAUDE_CACHE_TTL_MS
 process.env.BISEO_CLAUDE_USAGE_URL='http://127.0.0.1:1/invalid'
 process.env.BISEO_CLAUDE_CACHE_TTL_MS='3600000'
 set(null)
 try{await fn()}finally{
  if(u===undefined)delete process.env.BISEO_CLAUDE_USAGE_URL
  else process.env.BISEO_CLAUDE_USAGE_URL=u
  if(t===undefined)delete process.env.BISEO_CLAUDE_CACHE_TTL_MS
  else process.env.BISEO_CLAUDE_CACHE_TTL_MS=t
  set(null)}
}
