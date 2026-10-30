import type{ProviderUsage}from'../domain/usage-types.js'
import{getClaudeCacheTtlMs}from'../domain/usage-cache-ttl.js'
type Snap={at:number;usage:ProviderUsage}
let last:Snap|null=null
export const setLastClaudeSnapshot=(u:ProviderUsage|null,at=Date.now())=>{last=u?{at,usage:u}:null}
export function resolveClaude(now:Date,fresh:ProviderUsage):ProviderUsage{
 if(fresh.state!=='unknown'){last={at:now.getTime(),usage:fresh};return fresh}
 const s=last,ttl=getClaudeCacheTtlMs()
 if(s&&!(ttl>0&&now.getTime()-s.at>ttl)){
  const u=s.usage
  return{...u,source:'claude-cache',metrics:(u.metrics??[]).map(m=>({...m})),windows:(u.windows??[]).map(w=>({...w,source:'claude-cache'}))}
 }
 return fresh
}
