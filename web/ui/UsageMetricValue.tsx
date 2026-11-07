import type{UsageMetric}from'../domain/usage'
import{usageMetricLabel}from'../domain/usage-metric-name'
import{formatMetricValue}from'../domain/usage-metric-format'
import{UsageMetricTimeLeft}from'./UsageMetricTimeLeft'
import{UsageValueLine}from'./UsageValueLine'
import{UsageValueStatus}from'./UsageValueStatus'
import{UsageMetricGauge}from'./UsageMetricGauge'
import{isBalanceMetric}from'../domain/usage-balance'
import r from'../resources.json'
export function UsageMetricValue({provider,metric,remaining,limited}:{provider:string;metric:UsageMetric;remaining:boolean;limited?:boolean}){
 const {id,unit}=metric,showRemaining=remaining||isBalanceMetric(metric)
 const label=usageMetricLabel(provider,id,metric.label,r)
 return <UsageValueLine label={label} gauge={<UsageMetricGauge provider={provider} metric={metric} limited={limited} remaining={showRemaining}/>} value={<UsageValueStatus text={formatMetricValue(metric,r.usageUnknownPercent,remaining)} used={unit==='percent'?metric.used:null} window={id} limited={limited}/>}
  timeLeft={<UsageMetricTimeLeft provider={provider} metric={metric} remaining={showRemaining}/>}/>
}
