import type{HerdrPort}from'./ports.js'
import type{AgentInfo,PaneInfo,TabInfo}from'../domain/herdr.js'
export function createNameCheck(h:HerdrPort,agents:AgentInfo[]){
 const tabs=new Map<string,Promise<TabInfo|undefined>>()
 return async(p:PaneInfo)=>{
  if(agents.some(a=>a.pane_id===p.pane_id&&a.name))return true
  if(!tabs.has(p.tab_id))tabs.set(p.tab_id,h.getTab?.(p.tab_id).catch(()=>undefined)??Promise.resolve(undefined))
  return !!(await tabs.get(p.tab_id))?.label
 }
}
