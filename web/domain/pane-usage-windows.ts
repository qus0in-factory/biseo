import type{PaneSummary}from'./timeline'
import type{UsageMetric,UsageProvider,UsageWindow}from'./usage'
const family=(s?:string|null)=>{
 const m=s??''
 return m.includes('argon')?'argon':/^(gemini|claude|gpt)-/.exec(m)?.[1]??''
}
const pct=(m?:UsageMetric)=>
 m?.used!=null&&m.limit!=null&&m.limit>0?Math.round(Math.max(0,Math.min(1,m.used/m.limit))*100):null
export function paneAgyMetrics(pane:PaneSummary,p:UsageProvider):UsageMetric[]{
 const f=p.provider==='agy'?family(pane.modelId):''
 return f?(p.metrics??[]).filter(m=>m.unit==='percent'&&m.id.split(':')[0].split('-').includes(f)):[]
}
export function paneUsageWindows(pane:PaneSummary,p:UsageProvider):UsageWindow[]{
 if(p.provider==='agy')
  return paneAgyMetrics(pane,p).map(m=>({
   window:m.id.split(':').pop()!,usedPercent:m.used,resetsAt:m.resetsAt,
   checkedAt:null,limitReached:m.remaining===0,source:p.provider,
  }))
 return p.windows.map(w=>({
  ...w,usedPercent:w.usedPercent??pct(p.metrics?.find(x=>x.id===w.window)),
 }))
}
