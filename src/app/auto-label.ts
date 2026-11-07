import{pickAlias,uniqueLabel,type AliasRule,type Obs}from'../domain/auto-label.js'
import type{HerdrPort}from'./ports.js'
import type{AgentInfo,PaneInfo}from'../domain/herdr.js'
import{createNameCheck}from'./auto-label-names.js'
import{renameLabels,type LabelWarn}from'./auto-label-rename.js'
import{prepareLabels,type Owned}from'./auto-label-state.js'
export function createAutoLabeler(rules:AliasRule[],warn:LabelWarn=()=>{}){
 const mine=new Map<string,Owned>()
 return async(h:HerdrPort,panes:PaneInfo[],models:Record<string,Obs>,agents:AgentInfo[]=[])=>{
  const taken=prepareLabels(mine,panes)
  const hasName=createNameCheck(h,agents)
  for(const p of panes){
   const alias=pickAlias(rules,models[p.pane_id]),own=mine.get(p.pane_id)
   if(!alias||!h.renamePane||own?.alias===alias||p.label&&p.label!==own?.label)continue
   if(!own&&await hasName(p))continue
   const label=uniqueLabel(alias,taken)
   mine.set(p.pane_id,{alias,label});taken.add(label)
   await renameLabels(h,p,panes,label,warn)
  }
 }
}
