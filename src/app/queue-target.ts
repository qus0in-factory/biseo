import type{HerdrPort}from'./ports.js'
import{paneName}from'../domain/pane-name.js'
import{targetIssue,type Target}from'../domain/turn-policy.js'
export async function queueTarget(h:HerdrPort,ws:string,pane:string){
 const p=await h.getPane(pane)
 if(!p||p.workspace_id!==ws)return null
 const target:Target={pane:p,agent:await h.getAgent(pane)}
 return{target,name:paneName(p,target.agent),terminalId:p.terminal_id,ready:!targetIssue(target)}
}
