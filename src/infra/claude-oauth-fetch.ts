import type{ProviderUsage}from'../domain/usage-types.js'
import{unknownUsage}from'../domain/usage-unknown.js'
import{getUsageEndpoints as ep,getUsageTimeoutMs as to}from'../domain/usage-endpoints.js'
import{claudeHttpUsage}from'./claude-oauth-http.js'
import{readClaudeToken}from'./claude-oauth-token.js'
import{resolveClaude as resolve}from'./claude-snapshot-store.js'
export async function fetchClaudeUsage(now=new Date()):Promise<ProviderUsage>{
 try{
  const t=await readClaudeToken()
  if(!t)return resolve(now,unknownUsage('claude'))
  const h={Authorization:`Bearer ${t}`,'anthropic-beta':'oauth-2025-04-20',Accept:'application/json'}
  const res=await fetch(ep().claude,{headers:h,signal:AbortSignal.timeout(to())})
  const data=res.status===200?await res.json().catch(()=>null):null
  return resolve(now,claudeHttpUsage(res.status,res.headers,data,now))
 }catch{
  return resolve(now,unknownUsage('claude'))
 }
}
