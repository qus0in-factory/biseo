import type{UsageMetric}from'../domain/usage'
import{usageMetricLabel,usageMetricName}from'../domain/usage-metric-name'
import{formatMetricValue}from'../domain/usage-metric-format'
import{UsageTimeLeft}from'./UsageTimeLeft'
import{UsageValueLine}from'./UsageValueLine'
import r from'../resources.json'
const res=r as Record<string,string>
export function UsageMetricValue({provider,metric,remaining}:{provider:string;metric:UsageMetric;remaining:boolean}){
 const label=usageMetricLabel(provider,metric.id,metric.label,res)
 const window=usageMetricName(provider,metric.id,metric.label,res)
 const timeLeft=metric.unit==='percent'?window:provider==='ollama'&&metric.id==='included_balance'?'monthly':null
 return <UsageValueLine label={label} value={formatMetricValue(metric,res.usageUnknownPercent,remaining)}
  timeLeft={timeLeft?<UsageTimeLeft label={timeLeft} startsAt={metric.startsAt} resetsAt={metric.resetsAt}/>:null}/>
}
