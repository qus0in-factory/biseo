import type{TurnStatus}from'../domain/timeline.js'
export type Outcome={status:TurnStatus;errorCode:string}
export function promptError(e:unknown,sent:boolean):Outcome{
 const code=(e as{code?:string}).code??''
 if(code==='timeout')return {status:'timeout',errorCode:'turn_timeout'}
 if(code==='agent_prompt_stalled')return {status:'failed',errorCode:'agent_prompt_stalled'}
 if(code==='agent_blocked')return {status:'blocked',errorCode:'agent_blocked'}
 if(code==='agent_not_ready')return {status:'failed',errorCode:'agent_not_ready'}
 return {status:'failed',errorCode:sent?'delivery_uncertain':'herdr_error'}
}
