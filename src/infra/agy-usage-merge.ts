import type{AgyGroup}from'./agy-quota-types.js'
import{cliPoolFamilies}from'./agy-cli-pools.js'
const key=(g:AgyGroup)=>g.displayName.trim().toLowerCase().replace(/\s+/g,' ')
const wk=(v:unknown)=>Array.isArray(v)?(v as any[]).find((b)=>b?.window==='weekly'||b?.bucketId==='weekly'):undefined
export function mergeAgyGroups(summary:AgyGroup[],derived:AgyGroup[]):AgyGroup[]{
 const groups=Array.isArray(summary)?[...summary]:[]
 const byKey=new Map(groups.map((g)=>[key(g),g]))
 for(const group of Array.isArray(derived)?derived:[]){
  const hit=byKey.get(key(group))
  if(hit){
   if(!hit.families?.length)hit.families=[...(group.families??[])]
   const s=wk(hit.buckets),d=wk(group.buckets)
   if(s&&d&&typeof s.resetTime!=='string'&&typeof d.resetTime==='string')s.resetTime=d.resetTime
   continue}
  groups.push(group)
  byKey.set(key(group),group)}
 for(const g of groups)if(!g.families?.length)g.families=cliPoolFamilies(g.displayName)??['unknown']
 return groups}
