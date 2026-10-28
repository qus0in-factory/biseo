import {parseLines,textOf,userText,type Entry} from './transcript.js'
export function claudeResponse(raw:string,prompt:string):string|null{
 const es=parseLines(raw)
 const i=es.findIndex(e=>userText(e)===prompt)
 if(i<0)return null
 for(let j=i+1;j<es.length;j++){
  const e=es[j]
  if(userText(e))return null
  if(e.type==='assistant'&&!e.isSidechain&&e.message?.stop_reason==='end_turn'){
   const t=finalText(e)
   if(t)return t
  }
 }
 return null
}
function finalText(e:Entry):string{
 const t=textOf(e.message?.content).trim()
 return t
}
