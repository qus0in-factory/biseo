import type{Context}from'hono'
import {createTurn}from'../app/create-turn.js'
import {runTurn}from'../app/run-turn.js'
import {parseInput}from'../app/turn-input.js'
import type{TurnDeps}from'../app/turn-deps.js'
import {workspaceIssue}from'../domain/workspace.js'
type Deps=TurnDeps&{timeoutMs:number;graceMs:number}
export function postTurn(d:Deps){
 return async(c:Context)=>{
  const input=parseInput(await c.req.json().catch(()=>null))
  if(typeof input==='string')return c.json({error:input},400)
  const w=workspaceIssue(d.allowedWorkspaceId,input.workspaceId)
  if(w)return c.json({error:w},w==='workspace_not_allowed'?403:503)
  const r=await createTurn(d,input)
  if(!r.ok)return c.json({error:r.error,...r.reason?{reason:r.reason}:{},...r.resetsAt?{resetsAt:r.resetsAt}:{}},r.status)
  if(r.created&&r.reader&&r.target)void runTurn(d,r.item,r.reader,r.target)
  return c.json({requestId:r.item.requestId,status:r.item.status,createdAt:r.item.createdAt},r.created?202:200)
 }
}
