import{targetIssue,type Target}from'../domain/turn-policy.js'
import type{HerdrPort}from'./ports.js'
export type State={target:Target}|{wait:true}|{reason:string}
export async function queueState(h:HerdrPort,p:string):Promise<State>{
 const[pane,agent]=await Promise.all([h.getPane(p),h.getAgent(p)])
 if(!pane)return{reason:'target_not_found'}
 const target={pane,agent},issue=targetIssue(target)
 if(issue==='agent_busy'||issue==='agent_blocked')return{wait:true}
 if(issue)return{reason:issue}
 return{target}
}
