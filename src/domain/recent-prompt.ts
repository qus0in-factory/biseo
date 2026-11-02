import{parseLines,textOf,userText}from'./transcript.js'
import{requestText}from'./antigravity-user-text.js'
export function recentPrompt(raw:string,source:string){
 const entries=parseLines(raw)
 for(const entry of entries.reverse()){
  if(source==='herdr:claude'){
   const text=userText(entry)
   if(text)return text
  }else if(source.endsWith(':codex')){
   const payload=(entry as{payload?:{type?:string;role?:string;content?:unknown}}).payload
   if(entry.type==='response_item'&&payload?.type==='message'&&payload.role==='user'){
    const content=payload.content
    return typeof content==='string'?content:Array.isArray(content)?content.map(part=>part.text??'').join('\n'):''
   }
  }else if(entry.type==='USER_INPUT'&&entry.source==='USER_EXPLICIT')return requestText(textOf(entry.content))
 }
 return null
}
