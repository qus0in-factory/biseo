import{pickAlias,uniqueLabel,type AliasRule,type Obs}from'../domain/auto-label.js'
import type{HerdrPort}from'./ports.js'
import type{AgentInfo,PaneInfo}from'../domain/herdr.js'
export type LabelWarn=(f:{id:string;command:string},msg:string)=>void
export function createAutoLabeler(rules:AliasRule[],warn:LabelWarn=()=>{}){
 const mine=new Map<string,{alias:string;label:string}>()
 return async(h:HerdrPort,panes:PaneInfo[],models:Record<string,Obs>,agents:AgentInfo[]=[])=>{
  const ids=panes.map(p=>p.pane_id)
  for(const k of mine.keys())if(!ids.includes(k))mine.delete(k)
  const taken=new Set(panes.map(p=>p.label).filter((l):l is string=>!!l))
  for(const p of panes){
   const alias=pickAlias(rules,models[p.pane_id]),own=mine.get(p.pane_id)
   if(!alias||!h.renamePane||own?.alias===alias||p.label&&p.label!==own?.label)continue
   if(!own&&await hasName(h,p,agents))continue
   const label=uniqueLabel(alias,taken)
   mine.set(p.pane_id,{alias,label});taken.add(label)
   const step=async(command:string,id:string,run:()=>Promise<void>|undefined)=>{try{await run()}catch{warn({id,command},'auto_label.rename_failed')}}
   await step('pane rename',p.pane_id,()=>h.renamePane!(p.pane_id,label))
   await step('agent rename',p.pane_id,()=>h.renameAgent?.(p.pane_id,label))
   if(h.renameTab&&panes.filter(x=>x.tab_id===p.tab_id).length===1)await step('tab rename',p.tab_id,()=>h.renameTab!(p.tab_id,label))
  }
 }
}
async function hasName(h:HerdrPort,p:PaneInfo,agents:AgentInfo[]){
 if(agents.some(a=>a.pane_id===p.pane_id&&a.name))return true
 const t=await h.getTab?.(p.tab_id).catch(()=>undefined)
 return !!t?.label
}
