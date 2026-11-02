import{pickAlias,uniqueLabel,type AliasRule}from'../domain/auto-label.js'
import type{HerdrPort}from'./ports.js'
import type{PaneInfo}from'../domain/herdr.js'
export function createAutoLabeler(rules:AliasRule[]){
 const mine=new Map<string,{alias:string;label:string}>()
 return async(h:HerdrPort,panes:PaneInfo[],models:Record<string,{modelId:string;provider:string}>)=>{
  const ids=new Set(panes.map(p=>p.pane_id))
  for(const k of mine.keys())if(!ids.has(k))mine.delete(k)
  const taken=new Set(panes.map(p=>p.label).filter((l):l is string=>!!l))
  for(const p of panes){
   const alias=pickAlias(rules,models[p.pane_id]),own=mine.get(p.pane_id)
   if(!alias||!h.renamePane||own?.alias===alias)continue
   if(p.label&&p.label!==own?.label)continue
   const label=uniqueLabel(alias,taken)
   mine.set(p.pane_id,{alias,label});taken.add(label)
   try{
    await h.renamePane(p.pane_id,label)
    if(h.renameTab&&panes.filter(x=>x.tab_id===p.tab_id).length===1)await h.renameTab(p.tab_id,label)
   }catch{}
  }
 }
}
