import {requestText}from'./antigravity-user-text.js'
import {parseLines,textOf,type Entry} from './transcript.js'
export function antigravityResponse(raw:string,prompt:string):string|null{
 const es=parseLines(raw)
 const i=es.findIndex(e=>e.type==='USER_INPUT'&&e.source==='USER_EXPLICIT'&&requestText(textOf(e.content))===prompt)
 if(i<0)return null
 let out:string|null=null
 for(let j=i+1;j<es.length;j++){
  const e=es[j]
  if(e.type==='USER_INPUT'&&e.source==='USER_EXPLICIT')break
  if(e.type==='PLANNER_RESPONSE'&&!(e.tool_calls?.length)){
   const t=textOf(e.content).trim()
   if(t)out=t
  }
 }
 return out
}
