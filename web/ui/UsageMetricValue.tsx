import type{UsageMetric}from'../domain/usage'
import{usageMetricLabel,usageMetricName}from'../domain/usage-metric-name'
import{formatMetricValue}from'../domain/usage-metric-format'
import{UsageTimeLeft}from'./UsageTimeLeft'
import{UsageValueLine}from'./UsageValueLine'
import{UsageValueStatus}from'./UsageValueStatus'
import r from'../resources.json'
export function UsageMetricValue({provider,metric,remaining,limited}:{provider:string;metric:UsageMetric;remaining:boolean;limited?:boolean}){
 const {id,unit}=metric
 const label=usageMetricLabel(provider,id,metric.label,r)
 const timeLeft=unit==='percent'?usageMetricName(provider,id,metric.label,r):provider==='ollama'&&id==='included_balance'?'monthly':null
 return <UsageValueLine label={label} value={<UsageValueStatus text={formatMetricValue(metric,r.usageUnknownPercent,remaining)} used={unit==='percent'?metric.used:null} window={id} limited={limited}/>}
  timeLeft={timeLeft?<UsageTimeLeft label={timeLeft} startsAt={metric.startsAt} resetsAt={metric.resetsAt} remaining={remaining}/>:null}/>
}
