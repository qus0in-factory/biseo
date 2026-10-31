import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
const p=resolve(process.cwd(),'config/pane-templates.json')
export type PaneTemplate={id:string;kind:string;label?:string;args?:string[]}
export function loadPaneTemplates(file=p):PaneTemplate[]{
 try{
  const v=JSON.parse(readFileSync(file,'utf8'))
  if(!Array.isArray(v))return[]
  return v.filter((t:unknown)=>!!t&&typeof (t as {id?:unknown}).id==='string'&&typeof (t as {kind?:unknown}).kind==='string').map((t:unknown)=>{
   const x=t as {id:string;kind:string;label?:unknown;args?:unknown}
   return{id:x.id,kind:x.kind,label:typeof x.label==='string'?x.label:undefined,args:Array.isArray(x.args)?x.args.filter((y:unknown):y is string=>typeof y==='string'):undefined}
  })
 }catch{return[]}
}
export function findPaneTemplate(id:string,file=p):PaneTemplate|undefined{return loadPaneTemplates(file).find(t=>t.id===id)}
