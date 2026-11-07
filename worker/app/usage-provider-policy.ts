import type{UsageState}from'../infra/d1-usage-types.js'
export type ProviderPolicy={staleReasons:string[];restoreState?:UsageState}
export type PolicyMap=Record<string,ProviderPolicy>
const STATES:readonly string[]=['available','limited','unknown']
const isState=(v:unknown):v is UsageState=>typeof v==='string'&&STATES.includes(v)
const strings=(v:unknown)=>Array.isArray(v)?v.filter((x):x is string=>typeof x==='string'):[]
const isObj=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v)
const parseOne=(o:Record<string,unknown>):ProviderPolicy=>
 ({staleReasons:strings(o.staleReasons),restoreState:isState(o.restoreState)?o.restoreState:undefined})
export const parseProviderPolicy=(raw:unknown):PolicyMap=>{
 const out:PolicyMap=Object.create(null)
 if(isObj(raw))for(const[k,v]of Object.entries(raw))if(isObj(v))out[k]=parseOne(v)
 return out
}
export const lookupPolicy=(m:PolicyMap,k:string)=>Object.hasOwn(m,k)?m[k]:undefined
