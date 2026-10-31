import type{UsageMetric}from'../domain/usage'
import{usageMetricLabel}from'../domain/usage-metric-name'
import{formatMetricValue}from'../domain/usage-metric-format'
import r from'../resources.json'
export function UsageMetricValue({provider,metric,remaining}:{provider:string;metric:UsageMetric;remaining:boolean}){
 const label=usageMetricLabel(provider,metric.id,metric.label,r as Record<string,string>)
 return <div className="flex items-center justify-between gap-2">
  <span className="text-xs text-muted-foreground">{label}</span>
  <span className="font-mono text-xs">{formatMetricValue(metric,'알 수 없음',remaining)}</span>
 </div>
}
