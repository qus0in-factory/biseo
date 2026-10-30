import{logger}from'../infra/logger.js'
import type{TurnStatus as S}from'../domain/timeline.js'
import type{TurnStore}from'./turn-store.js'
export function finish(s:TurnStore,id:string,status:S,errorCode:string|null,responseText:string|null=null){
 const before=s.get(id)
 s.update(id,{status,errorCode,responseText,completedAt:new Date().toISOString()})
 const i=s.get(id)
 logger.info({
  requestId:id,paneId:i?.paneId,agentKind:i?.agentKind,status,errorCode,
  elapsedMs:i?Date.now()-Date.parse(i.createdAt):null,
  lateRecovered:before?.status==='timeout'&&status==='completed',
 },'turn.finish')
}
