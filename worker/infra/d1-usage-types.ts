export type UsageState='available'|'limited'|'unknown'
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
}
export type UsageWindow=Omit<UsageSnapshot,'provider'|'state'|'updatedAt'>
export type ProviderUsage={provider:string;state:UsageState;windows:UsageWindow[]}
