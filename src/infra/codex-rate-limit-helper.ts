type R=Record<string,unknown>
export const toIso=(v:unknown):string|null=>{
 if(typeof v==='string'){const t=Date.parse(v);return Number.isFinite(t)?new Date(t).toISOString():null}
 if(typeof v!=='number'||!Number.isFinite(v)||v<=0)return null
 const t=new Date(v<1e12?v*1000:v)
 return Number.isFinite(t.getTime())?t.toISOString():null
}
export const winIso=(v:unknown)=>v&&typeof v==='object'?toIso((v as R).resets_at):null
export const usedPct=(v:unknown)=>v&&typeof v==='object'&&typeof (v as R).used_percent==='number'?(v as R).used_percent as number:null
