import{interruptAllowed,type InterruptKey}from'../domain/interrupt-key.js'
import{interruptAudit}from'./interrupt-audit.js'
import type{InterruptBad,InterruptDeps,InterruptFail,InterruptOk}from'./interrupt-types.js'
import type{PaneInfo}from'../domain/herdr.js'
export async function interruptSend(d:InterruptDeps,pane:PaneInfo,paneId:string,key:InterruptKey):Promise<InterruptOk|InterruptBad|InterruptFail>{
 const agent=pane.agent??pane.agent_session?.agent??null
 if(!interruptAllowed(agent,key,d.interruptAllowlist)){
  interruptAudit(d.audit,paneId,key,'denied')
  return{status:400,body:{error:'bad_request',reason:'key_not_allowed'}}
 }
 if(!d.herdr.sendKeys){
  interruptAudit(d.audit,paneId,key,'unavailable')
  return{status:502,body:{error:'herdr_unavailable'}}
 }
 try{await d.herdr.sendKeys(paneId,key)}
 catch{interruptAudit(d.audit,paneId,key,'failed')
  return{status:502,body:{error:'herdr_unavailable'}}
 }
 interruptAudit(d.audit,paneId,key,'sent')
 return{status:200,body:{paneId,key,status:'sent'}}
}
