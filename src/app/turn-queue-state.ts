import{targetIssue,type Target}from'../domain/turn-policy.js'
import{isLimited}from'../domain/availability.js'
import type{Availability}from'../domain/timeline.js'
import{targetAvailability}from'./target-availability.js'
import type{TurnDeps}from'./turn-deps.js'
export type State={target:Target}|{wait:true}|{limited:Availability}|{reason:string}
export async function queueState(d:TurnDeps,p:string):Promise<State>{
 const[pane,agent]=await Promise.all([d.herdr.getPane(p),d.herdr.getAgent(p)])
 if(!pane)return{reason:'target_not_found'}
 const target={pane,agent},issue=targetIssue(target)
 if(issue==='agent_busy'||issue==='agent_blocked')return{wait:true}
 if(issue)return{reason:issue}
 const a=await targetAvailability(d,target)
 return isLimited(a)?{limited:a}:{target}
}
