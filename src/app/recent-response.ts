import type{HerdrPort}from'./ports.js'
import{findTarget,sameSession}from'../domain/turn-policy.js'
import{recentOpencode}from'../infra/recent-opencode.js'
import{recentTranscript}from'../infra/recent-transcript.js'
import{createHash}from'node:crypto'
export async function recentResponse(herdr:HerdrPort,workspace:string,pane:string){
 const target=findTarget(await herdr.listPanes(workspace),await herdr.listAgents(),pane)
 if(!target)return null
 const session=target.agent?.agent_session??target.pane.agent_session
 if(!session)return null
 const result=session.source==='herdr:opencode'?recentOpencode(session.value):await recentTranscript(session,target.pane.cwd)
 const current=await herdr.getPane(pane)
 if(!result||!current||!sameSession(target.pane,current))return null
 const key=createHash('sha256').update(JSON.stringify([workspace,pane,session,result])).digest('hex')
 return{...result,key,targetName:target.agent?.name??target.pane.label??pane,agentKind:session.agent}
}
