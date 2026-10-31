import {readFileSync}from'node:fs'
import {resolve}from'node:path'
const p=resolve(process.cwd(),'config/coordinator-panels.json')
export function loadCoordinatorLabels(file=p):string[]{
 try{
  const v=JSON.parse(readFileSync(file,'utf8'))
  const a=Array.isArray(v)?v:(Array.isArray((v as {coordinators?:unknown})?.coordinators)?(v as {coordinators:string[]}).coordinators:[])
  return a.filter((x:unknown):x is string=>typeof x==='string')
 }catch{return ['opus','sol']}
}
export function isCoordinatorLabel(label:string|undefined|null):boolean{
 return !!label&&loadCoordinatorLabels().includes(label)
}
