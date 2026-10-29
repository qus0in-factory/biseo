import type{RateLimits}from'../domain/availability.js'
type R=Record<string,unknown>
const at=(v:unknown):string|null=>{
 if(typeof v==='string'){const t=Date.parse(v);return Number.isFinite(t)?new Date(t).toISOString():null}
 if(typeof v!=='number'||!Number.isFinite(v)||v<=0)return null
 const ms=v<1e12?v*1000:v,t=new Date(ms)
 return Number.isFinite(t.getTime())?t.toISOString():null
}
const win=(v:unknown)=>v&&typeof v==='object'?at((v as R).resets_at):null
export function parseRateLimits(line:string):RateLimits|null{
 try{
  const o=JSON.parse(line) as R,p=(o.payload&&typeof o.payload==='object'?o.payload:o) as R
  if(p.type!=='token_count')return null
  const r=(p.rate_limits??o.rate_limits) as R|undefined
  if(!r||typeof r!=='object')return null
  const up=(v:unknown)=>v&&typeof v==='object'&&typeof (v as R).used_percent==='number'?(v as R).used_percent as number:null
  return{reached:typeof r.rate_limit_reached_type==='string'?r.rate_limit_reached_type:null,primary:win(r.primary),secondary:win(r.secondary),primaryUsedPercent:up(r.primary),secondaryUsedPercent:up(r.secondary),snapshotAt:at(o.timestamp)}
 }catch{return null}
}
