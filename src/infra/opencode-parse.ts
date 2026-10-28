import {textOf}from'../domain/transcript.js'
export type Row={type:string;data:string}
type Data={text?:unknown;content?:unknown;outcome?:unknown}
export function parseTurn(rows:Row[],prompt:string):{done:boolean;text:string|null}{
 const want=prompt.trim(),es=rows.map(r=>({type:r.type,d:parse(r.data)}))
 const i=es.findIndex(e=>e.type==='user'&&typeof e.d.text==='string'&&e.d.text.trim()===want)
 if(i<0)return {done:false,text:null}
 const out:string[]=[]
 for(let j=i+1;j<es.length;j++){
  const {type,d}=es[j]
  if(type==='user')return {done:true,text:null}
  if(type==='assistant'){const t=textOf(d.content).trim();if(t)out.push(t)}
  if(type==='idle')return {done:true,text:d.outcome==='succeeded'&&out.length?out.join('\n\n'):null}
 }
 return {done:false,text:null}
}
function parse(raw:string):Data{
 try{const v=JSON.parse(raw);return v&&typeof v==='object'?v as Data:{}}catch{return{}}
}
