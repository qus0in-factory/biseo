import type{UsageSnapshot}from'../infra/d1-usage-types.js'
export const statusOnly=(r:UsageSnapshot)=>r.window==='status'&&(r.metricId??r.window)==='status'
