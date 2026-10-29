export type Entry={type?:string;isSidechain?:boolean;source?:string;message?:{content?:unknown;stop_reason?:string|null};content?:unknown;tool_calls?:unknown[]}
export function parseLines(raw:string):Entry[]{
 return raw.split('\n').flatMap(l=>{if(!l.trim())return[];try{const v=JSON.parse(l);return v&&typeof v==='object'?[v as Entry]:[]}catch{return[]}})
}
export function textOf(c:unknown):string{
 if(typeof c==='string')return c
 if(!Array.isArray(c))return ''
 return c.flatMap(x=>x&&typeof x==='object'&&(x as {type?:string}).type==='text'&&typeof (x as {text?:string}).text==='string'?[(x as {text:string}).text]:[]).join('\n\n')
}
export function userText(e:Entry):string{
 return e.type==='user'&&!e.isSidechain?textOf(e.message?.content):''
}
