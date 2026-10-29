import type{RateLimits}from'../domain/availability.js'
import{toIso,winIso,usedPct}from'./codex-rate-limit-helper.js'
type R=Record<string,unknown>
export function parseRateLimits(l:string):RateLimits|null{
 try{
  const o=JSON.parse(l) as R,p=(o.payload??o) as R
  if(p.type!=='token_count')return null
  const r=(p.rate_limits??o.rate_limits) as R|undefined
  if(!r||typeof r!=='object')return null
  const reached=typeof r.rate_limit_reached_type==='string'?r.rate_limit_reached_type:null
  return{reached,primary:winIso(r.primary),secondary:winIso(r.secondary),primaryUsedPercent:usedPct(r.primary),secondaryUsedPercent:usedPct(r.secondary),snapshotAt:toIso(o.timestamp)}
 }catch{return null}
}
