import{requestText}from'../domain/antigravity-user-text.js'
import{parseLines,textOf,userText,type Entry}from'../domain/transcript.js'
type P={type?:string;role?:string;content?:unknown}
type E=Entry&{payload?:P}
export function userSeen(raw:string,prompt:string,source:string){
 const es=parseLines(raw)
 if(source==='herdr:claude')return es.some(e=>userText(e)===prompt)
 if(source.endsWith(':codex'))return es.some(e=>codexUser(e,prompt))
 return es.some(e=>e.type==='USER_INPUT'&&e.source==='USER_EXPLICIT'&&requestText(textOf(e.content))===prompt)
}
function codexUser(e:E,prompt:string){
 const p=e.payload
 return e.type==='response_item'&&p?.type==='message'&&p.role==='user'&&txt(p.content).trim()===prompt.trim()
}
function txt(c:unknown){
 if(typeof c==='string')return c
 if(!Array.isArray(c))return''
 return c.flatMap(x=>x&&typeof x==='object'&&typeof(x as{text?:unknown}).text==='string'?[(x as{text:string}).text]:[]).join('\n')
}
