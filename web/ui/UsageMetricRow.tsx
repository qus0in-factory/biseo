import type{UsageMetric}from'../domain/usage'
import{usageMetricName}from'../domain/usage-metric-name'
import{formatMetricValue}from'../domain/usage-metric-format'
import{UsageWindowTime}from'./UsageWindowTime'
import r from'../resources.json'
export function UsageMetricRow({provider,metric,remaining=true}:{provider:string;metric:UsageMetric;remaining?:boolean}){
const label=usageMetricName(provider,metric.id,metric.label,r as Record<string,string>)
const d={window:metric.id,usedPercent:metric.used,resetsAt:metric.resetsAt,checkedAt:null,
limitReached:metric.unit==='percent'&&metric.used!==null&&metric.used>=100,source:null}
return(
<div className="flex flex-col gap-0.5 border-t border-border/60 pt-1">
<div className="flex items-center justify-between gap-2">
<span className="text-xs text-muted-foreground">{label}</span>
<span className="font-mono text-xs">{formatMetricValue(metric,'알 수 없음',remaining)}</span>
</div>
<UsageWindowTime value={d}/>
</div>)}
