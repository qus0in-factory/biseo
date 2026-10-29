import {parseLines,type Entry}from'./transcript.js'
type P={type?:string;role?:string;content?:unknown;last_agent_message?:unknown}
type E=Entry&{payload?:P}
export function codexResponse(raw:string,prompt:string):string|null{
 const want=prompt.trim()
 const es=parseLines(raw) as E[],i=es.findIndex(e=>u(e)&&txt(e.payload?.content).trim()===want)
 if(i<0)return null
 let out:string|null=null
 for(let j=i+1;j<es.length;j++){
  if(u(es[j]))break
  const t=d(es[j])
  if(t)out=t
 }
 return out
}
function u(e:E){return e.type==='response_item'&&e.payload?.type==='message'&&e.payload.role==='user'}
function d(e:E){
 if(e.type!=='event_msg'||e.payload?.type!=='task_complete')return null
 const t=e.payload.last_agent_message,x=typeof t==='string'?t.trim():''
 return x||null
}
function txt(c:unknown):string{
 if(typeof c==='string')return c
 if(!Array.isArray(c))return''
 return c.flatMap(x=>x&&typeof x==='object'&&typeof(x as{text?:unknown}).text==='string'?[(x as{text:string}).text]:[]).join('\n')
}
