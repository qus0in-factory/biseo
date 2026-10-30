export type UsageState='available'|'limited'|'unknown'
export type UsageMetric={
 id:string
 label:string
 unit:'percent'|'credits'|'currency'|'tokens'|'requests'|string
 used:number|null
 limit:number|null
 remaining:number|null
 resetsAt:string|null
}
export type UsageSnapshot={
 provider:string
 window:string
 state:UsageState
 usedPercent:number|null
 resetsAt:string|null
 checkedAt:string|null
 limitReached:boolean
 source:string|null
 updatedAt:string
 metricId?:string|null
 label?:string|null
 unit?:string|null
 used?:number|null
 limitValue?:number|null
 remaining?:number|null
}
export type UsageWindow=Omit<UsageSnapshot,'provider'|'state'|'updatedAt'>
export type ProviderUsage={
 provider:string
 state:UsageState
 windows:UsageWindow[]
 metrics:UsageMetric[]
}
