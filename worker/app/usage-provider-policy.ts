import type{UsageState}from'../infra/d1-usage-types.js'
export type ProviderPolicy={staleReasons:string[];restoreState?:UsageState}
const STATES:readonly UsageState[]=['available','limited','unknown']
const isState=(v:unknown):v is UsageState=>typeof v==='string'&&(STATES as readonly string[]).includes(v)
const strings=(v:unknown)=>Array.isArray(v)?v.filter((x):x is string=>typeof x==='string'):[]
const parseOne=(v:unknown):ProviderPolicy|null=>{
 if(typeof v!=='object'||v===null||Array.isArray(v))return null
 const o=v as Record<string,unknown>
 return{staleReasons:strings(o.staleReasons),restoreState:isState(o.restoreState)?o.restoreState:undefined}
}
export const parseProviderPolicy=(raw:unknown):Record<string,ProviderPolicy>=>{
 const out:Record<string,ProviderPolicy>={}
 if(typeof raw!=='object'||raw===null||Array.isArray(raw))return out
 for(const[k,v]of Object.entries(raw)){const p=parseOne(v);if(p)out[k]=p}
 return out
}
