import type{TurnDeps}from'./turn-deps.js'
import {fail,type Fail}from'./turn-result.js'
export function claim(d:TurnDeps,paneId:string,id:string):Fail|null{
 if(d.locks.reserve(paneId,id))return null
 return fail(409,'target_not_ready','agent_busy')
}
export function release(d:Pick<TurnDeps,'locks'>,paneId:string,id:string){
 d.locks.release(paneId,id)
 d.locks.releaseRequest(id)
}
