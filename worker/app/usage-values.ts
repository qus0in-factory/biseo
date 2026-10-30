import type{UsageState}from'../infra/d1-usage-types.js'
export const states=new Set<UsageState>(['available','limited','unknown'])
export const str=(v:unknown)=>typeof v==='string'&&v.trim()?v.trim():null
export const pct=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=100?v:null
