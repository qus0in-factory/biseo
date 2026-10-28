import {sameSession,targetIssue,type Target}from'../domain/turn-policy.js'
import type{TurnStatus}from'../domain/timeline.js'
import type{HerdrPort}from'./ports.js'
export type Recheck={ok:true}|{ok:false;status:TurnStatus;errorCode:string}
export async function recheck(h:HerdrPort,paneId:string,target:Target):Promise<Recheck>{
 const pane=await h.getPane(paneId)
 if(!pane||!sameSession(target.pane,pane))return {ok:false,status:'failed',errorCode:'agent_session_changed'}
 const agent=await h.getAgent(paneId)
 const issue=targetIssue({pane,agent})
 if(issue)return {ok:false,status:issue==='agent_blocked'?'blocked':'failed',errorCode:issue}
 return {ok:true}
}
