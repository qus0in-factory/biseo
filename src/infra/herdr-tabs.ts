import type{TabInfo}from'../domain/herdr.js'
import {call,notFound}from'./herdr-exec.js'
export async function createTab(ws:string,label?:string){
 const args=['tab','create','--workspace',ws]
 if(label)args.push('--label',label)
 const r=await call(args,15000)
 const tab=r.result?.tab as Record<string,unknown>|undefined
 const pane=r.result?.root_pane as Record<string,unknown>|undefined
 return {tabId:String(tab?.tab_id??''),paneId:String(pane?.pane_id??'')}
}
export async function renameTab(id:string,label:string){await call(['tab','rename',id,label],15000)}
export async function getTab(id:string):Promise<TabInfo|undefined>{
 try{
  const r=await call(['tab','get',id],15000)
  const t=r.result?.tab as Record<string,unknown>|undefined
  if(!t)return undefined
  return{tab_id:String(t.tab_id??id),workspace_id:String(t.workspace_id??''),label:typeof t.label==='string'?t.label:null}
 }catch(e){if(notFound(e))return;throw e}
}
