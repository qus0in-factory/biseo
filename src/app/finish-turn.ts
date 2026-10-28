import type{TurnStore}from'./turn-store.js'
import type{TurnStatus}from'../domain/timeline.js'
export function finish(s:TurnStore,id:string,status:TurnStatus,errorCode:string|null,responseText:string|null=null){
 s.update(id,{status,errorCode,responseText,completedAt:new Date().toISOString()})
}
