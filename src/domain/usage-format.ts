import type{ProviderUsage,WindowUsage}from'./usage-types.js'
import type{RateLimits}from'./availability.js'
export function formatCodexWindows(r:RateLimits|null,now=new Date()):ProviderUsage{
 if(!r)return unknownUsage('codex')
 const pAct=r.primary&&Date.parse(r.primary)>now.getTime()
 const sAct=r.secondary&&Date.parse(r.secondary)>now.getTime()
 const pLim=r.reached==='primary',sLim=r.reached==='secondary'
 const w:WindowUsage[]=[
  {window:'primary',usedPercent:r.primaryUsedPercent,resetsAt:r.primary,checkedAt:r.snapshotAt,limitReached:pLim,source:'codex'},
  {window:'secondary',usedPercent:r.secondaryUsedPercent,resetsAt:r.secondary,checkedAt:r.snapshotAt,limitReached:sLim,source:'codex'},
 ]
 const limited=(pLim&&pAct)||(sLim&&sAct)
 return{provider:'codex',state:r.reached?(limited?'limited':'unknown'):'available',windows:w}
}
export function unknownUsage(p:string):ProviderUsage{
 return{provider:p,state:'unknown',windows:[]}
}
