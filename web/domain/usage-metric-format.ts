import type { UsageMetric } from './usage'
import { metricRemaining } from './metricRemaining.js'
import r from '../resources.json'
import{formatCurrency}from'./usage-currency'
const U=(r as any).usageUnitCredits,C=(r as any).usageUnitTokens,Q=(r as any).usageUnitRequests,S=(r as any).usageUsedSuffix
export function formatMetricValue(m: UsageMetric,unk='알 수 없음',showRemaining?:boolean):string{
const show=showRemaining??(m.unit!=='percent');const rem=metricRemaining(m)
if(m.unit==='percent'){if(show){const rem=metricRemaining(m);if(rem!==null)return `${Math.max(0,rem)}%`}return m.used!==null?`${m.used}%`:unk}
if(m.unit==='credits'){if(show&&rem!==null)return `${rem} ${U}`;return m.used!==null?`${m.used} ${S}`:unk}
if(m.unit==='currency')return formatCurrency(m,unk,show)
if(m.unit==='tokens')return m.used!==null?`${m.used} ${C}`:unk
if(m.unit==='requests')return m.used!==null?`${m.used} ${Q}`:unk
return m.used!==null?`${m.used} ${m.unit}`:unk}