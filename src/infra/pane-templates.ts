import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
const p=resolve(process.cwd(),'config/pane-templates.json')
export type PaneTemplate={id:string;kind:string;label?:string;args?:string[]}
export function loadPaneTemplates(file=p):PaneTemplate[]{
 try{
  const v=JSON.parse(readFileSync(file,'utf8'))
  if(!Array.isArray(v))return[]
  return v.filter((t:any)=>t&&typeof t.id==='string'&&typeof t.kind==='string').map((t:any)=>({id:t.id,kind:t.kind,label:typeof t.label==='string'?t.label:undefined,args:Array.isArray(t.args)?t.args.filter((x:any)=>typeof x==='string'):undefined}))
 }catch{return[]}
}
export function findPaneTemplate(id:string,file=p):PaneTemplate|undefined{return loadPaneTemplates(file).find(t=>t.id===id)}
